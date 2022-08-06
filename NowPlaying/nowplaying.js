let userid = location.search.split("id=")[1]

if (userid == '') 
{
    document.location.href = document.location.href.split("/NowPlaying/")[0]
}

let widget = document.getElementById("widget");
let back = document.getElementById("back");
let avd = document.getElementById("avd");
let songtitle = document.getElementById("songtitle");
let artist = document.getElementById("artist");
let albumarts = document.getElementById("albumart");
let time = document.getElementById("time");
let upprog = null
console.log(userid)

let datasend = {
    op: 2,
    d: {
      subscribe_to_id: userid
    }
  }

function formatnum(word) {
    word = word.toString();
    if (word.length == 1) {
        return "0"+word;
    } else {
        return word;
    }
}

function update(datas) {
    if (datas.d.listening_to_spotify == true) {
        clearInterval(upprog);
        widget.hidden = false;
        albumart = datas.d.spotify.album_art_url;
        albumarts.src = albumart;
        if (datas.d.spotify.song.length > 16) {
            songtitle.innerHTML = datas.d.spotify.song;
            songtitle.classList.add("scrollingtit");
        } else {
            songtitle.innerHTML = datas.d.spotify.song;
            songtitle.classList.remove("scrollingtit");
        }
        if (datas.d.spotify.artist.length > 18) {
            artist.innerHTML = datas.d.spotify.artist;
            artist.classList.add("scrollingart");
        } else {
            artist.innerHTML = datas.d.spotify.artist;
            artist.classList.remove("scrollingart");
        }
        // songtitle.innerHTML = datas.d.spotify.song;
        // artist.innerHTML = datas.d.spotify.artist;
        back.style["background-image"] = "url("+albumart+")";
    
        upprog = setInterval(() => {
            time.innerHTML = parseInt((Date.now() - datas.d.spotify.timestamps.start)/1000/60)+"m"+formatnum(parseInt((Date.now() - datas.d.spotify.timestamps.start)/1000%60))+"s"+" / "+parseInt((datas.d.spotify.timestamps.end - datas.d.spotify.timestamps.start)/1000/60)+"m"+formatnum(parseInt((datas.d.spotify.timestamps.end - datas.d.spotify.timestamps.start)/1000%60))+"s";
            now = new Date().getTime();
            duration = datas.d.spotify.timestamps.end - datas.d.spotify.timestamps.start;
            wherenow = now - datas.d.spotify.timestamps.start;
            prcnt = (wherenow/duration) * 100;
            progressbarfill.style.width = prcnt+"%";
        }, 100);
    } else {
        widget.hidden = true;
        if (upprog !== null) {
            clearInterval(upprog);
            upprog = null;
        }
    }
}

let lanyard = new WebSocket("wss://api.lanyard.rest/socket");

lanyard.onmessage = function(event) {
    jsonData = JSON.parse(event.data);
    if (jsonData.op == 1) {
        lanyard.send(JSON.stringify(datasend));
        ITer = setInterval(() => {
            lanyard.send(JSON.stringify({op: 3}));
        }, jsonData.d.heartbeat_interval);
    }
    if (jsonData.op == 0) {
        update(jsonData);
    }
  };

lanyard.onerror = function(error) {
    console.log(`[error] ${error.message}`);
  };

lanyard.onclose = function(event) {
  if (event.wasClean) {
    console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    console.log('[close] Connection died');
  }
  clearInterval(upprog);
};