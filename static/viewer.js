let host = location.host.split(':')[0];
let id = location.pathname.split("/").slice(-2)[0]
let wsport = 0;
let scport = 0;
let uri = "";
let webSocket = null;

let request = new XMLHttpRequest();
let info_uri = "http://"+location.host+"/roominfo/"+id;
request.open('GET', info_uri);
request.onreadystatechange = function () {
  if (request.readyState != 4) {
    // リクエスト中
  } else if (request.status != 200) {
    // 失敗
    elem_login.innerText = "";
    elem_id.innerText = "";
    elem_name.innerText = "";
    elem_bio.innerText = ""; 
  } else {
    let result = request.responseText;
    const info = JSON.parse(result);
    wsport = info.wsport;
    scport = info.scport;
    let elem_port = document.getElementById("port");
    elem_port.innerHTML = "WebSocket:"+wsport+",Socket:"+scport;
    uri = "ws://" + host + ":"+wsport+"/";
  }
};
// request.responseType = 'json';
request.send(null);

function init() {
  $("[data-name='message']").keypress(press);

  inner_gameboard = document.getElementById("board");
  inner_gameboard.onclick = function( event ) {
    const offsetx = 22, offsety = 22;
    const cellwidth = 28,cellheight = 28;
    const wallwidth = 7;
    let x = event.pageX-offsetx ;
    let y = event.pageY-offsety ;

    if(x%(cellwidth+wallwidth) < cellwidth && y%(cellheight+wallwidth) < cellheight){
      let cx = Math.floor(x/(cellwidth+wallwidth));
      let cy = Math.floor(y/(cellheight+wallwidth));
      console.log("player move");
      webSocket.send(cx+" "+cy);
    }else{
      let cx = Math.floor(x/(cellwidth+wallwidth));
      let cy = Math.floor(y/(cellheight+wallwidth));
      if(x%(cellwidth+wallwidth) >= cellwidth && y%(cellheight+wallwidth) < cellheight){
        webSocket.send(cx+" "+cy+" V");
      }else if(x%(cellwidth+wallwidth) < cellwidth && y%(cellheight+wallwidth) >= cellheight){
        webSocket.send(cx+" "+cy+" H");
      }
    }
  }
}

function open_socket() {
  console.log("open");
  if (webSocket == null) {
    webSocket = new WebSocket(uri);
    webSocket.onopen = onOpen;
    webSocket.onmessage = onMessage;
    webSocket.onclose = onClose;
    webSocket.onerror = onError;
    let btn = document.getElementById("connection");
    btn.disabled = true;
  }
}

function onOpen(event) {
  chat("Connected.");
}

function onMessage(event) {
  if (event && event.data) {
    raw_data = event.data.split(':');
    datatype = raw_data[0];
    text = raw_data.slice(1).join(':');
    if(datatype === 'mesg') {
      chat(text);
    }else if(datatype === 'qfcode') {
      let obj = document.getElementById('board');
      $(obj).data('qfcode',text);
      obj.innerHTML = "";
      createWholeBoard(0,obj);
    }
  }
}

function undo() {
  if (webSocket) {
    console.log("undo");
    webSocket.send("undo");
  }
}


function press(event) {
  if (event && event.which == 13) {
    let message = $("[data-name='message']").val();
    console.log("'"+message+"'");
    if (message && webSocket) {
      webSocket.send(message);
      $("[data-name='message']").val("");
    }
  }
}


function onError(event) {
  console.log("error occured");
}

function onClose(event) {
  // chat("切断しました。3秒後に再接続します。(" + event.code + ")");
  webSocket = null;
  setTimeout("open_socket()", 3000);
}

function chat(message) {
  let chats = $("[data-name='chat']").find("div");
  while (chats.length >= 100) {
    chats = chats.last().remove();
  }
  let msgtag = $("<div>").text(message);
  $("[data-name='chat']").prepend(msgtag);
}

$(init);

