let host = location.host.split(':')[0];
let uri = "ws://" + host + ":3012/";
let webSocket = null;

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


  open();
}

function open() {
  if (webSocket == null) {
    webSocket = new WebSocket(uri);
    webSocket.onopen = onOpen;
    webSocket.onmessage = onMessage;
    webSocket.onclose = onClose;
    webSocket.onerror = onError;
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
  setTimeout("open()", 3000);
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

