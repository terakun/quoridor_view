#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate rocket;
extern crate rocket_contrib;

use rocket_contrib::Template;
use rocket::response::NamedFile;
use std::collections::HashMap;

use std::path::{Path, PathBuf};
use std::fs::File;
use std::io::Read;

#[get("/")]
fn index() -> String {
    format!("Hello!")
}

#[get("/quoridor/<file..>")]
fn files(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("static/").join(file)).ok()
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

fn main() {
    rocket::ignite()
        .mount("/", routes![index, files, history])
        .attach(Template::fairing())
        .launch();
}
