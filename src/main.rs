#![feature(proc_macro_hygiene, decl_macro, plugin)]
#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_contrib;
#[macro_use]
extern crate serde_derive;
extern crate toml;

use rocket::State;
use rocket_contrib::templates::Template;
use rocket_contrib::json::Json;
use rocket::response::{NamedFile, Redirect};
use std::collections::HashMap;

use std::path::{Path, PathBuf};
use std::fs::File;
use std::fs;
use std::io::{BufReader, Read};
use std::sync::{Arc, Mutex};
use std::process::{Child, Command};

struct Service {
    ip: String,
    children: Vec<(usize, usize, Option<Child>)>,
}

#[get("/")]
fn index() -> Option<NamedFile> {
    NamedFile::open(Path::new("static/index.html")).ok()
}

fn boot_quoridor_judge(ip: &String, wsport: usize, scport: usize) -> Child {
    Command::new("../quoridor_judge/target/debug/quoridor_judge")
        .arg(ip.to_string())
        .arg(wsport.to_string())
        .arg(scport.to_string())
        .stdout(std::process::Stdio::null())
        .spawn()
        .expect("failed to execute process")
}

#[post("/boot_ai")]
fn boot_ai() {
    let _ = Command::new("python")
        .arg("../quoridor/main_socket.py")
        .arg("--ai_mode")
        .arg("r")
        .stdout(std::process::Stdio::null())
        .spawn()
        .expect("failed to execute process");
    println!("boot succeed");
}

#[post("/boot")]
fn boot(state: State<Arc<Mutex<Service>>>) -> Redirect {
    let mut state = state.lock().unwrap();
    let mut new_id = None;
    let ip = state.ip.clone();
    for (id, (wsport, scport, childprocess)) in &mut state.children.iter_mut().enumerate() {
        if let Some(childprocess) = childprocess {
            match childprocess.try_wait() {
                Ok(Some(status)) => {
                    *childprocess = boot_quoridor_judge(&ip, *wsport, *scport);
                    new_id = Some(id);
                    break;
                }
                Ok(None) => {}
                Err(e) => {
                    panic!("{}", e);
                }
            }
        } else {
            *childprocess = Some(boot_quoridor_judge(&ip, *wsport, *scport));
            new_id = Some(id);
            break;
        }
    }

    if let Some(id) = new_id {
        Redirect::to(format!("/room/{}/view.html", id))
    } else {
        Redirect::to("/")
    }
}

#[get("/room/<id>/<file..>")]
fn room(id: usize, file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("static/").join(file)).ok()
}

#[derive(Serialize, Deserialize)]
struct RoomInfo {
    wsport: String,
    scport: String,
}

#[get("/roominfo/<id>")]
fn roominfo(id: usize, state: State<Arc<Mutex<Service>>>) -> Option<Json<RoomInfo>> {
    let mut state = state.lock().unwrap();
    if state.children.len() <= id {
        return None;
    }
    let (wsport, scport, _) = state.children[id];
    Some(Json(RoomInfo {
        wsport: wsport.to_string(),
        scport: scport.to_string(),
    }))
}

#[get("/history/<file..>")]
fn history(file: PathBuf) -> Template {
    let mut f = File::open(Path::new("static/history/").join(file)).expect("file not found");
    let mut qfcode = String::new();
    f.read_to_string(&mut qfcode)
        .expect("something went wrong reading the file");
    let mut context = HashMap::new();
    context.insert("qfcode", qfcode);
    Template::render("history", &context)
}

#[derive(Debug, Deserialize)]
struct Config {
    development: Option<Development>,
}
#[derive(Debug, Deserialize)]
struct Development {
    address: String,
    port: usize,
}

fn read_file(path: String) -> Result<String, String> {
    let mut file_content = String::new();

    let mut fr = fs::File::open(path)
        .map(|f| BufReader::new(f))
        .map_err(|e| e.to_string())?;

    fr.read_to_string(&mut file_content)
        .map_err(|e| e.to_string())?;

    Ok(file_content)
}
fn main() {
    let s = match read_file("./Rocket.toml".to_owned()) {
        Ok(s) => s,
        Err(e) => panic!("fail to read file: {}", e),
    };
    println!("{}", s);

    let config: Config = toml::from_str(&s).ok().unwrap();

    let mut state = Arc::new(Mutex::new(Service {
        ip: config.development.unwrap().address.to_string(),
        children: vec![(3012, 8080, None), (3013, 8081, None), (3014, 8082, None)],
    }));

    rocket::ignite()
        .mount("/", routes![index, history, room, boot, roominfo])
        .attach(Template::fairing())
        .manage(state)
        .launch();
}
