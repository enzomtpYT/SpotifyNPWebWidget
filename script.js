let DiscID = document.getElementById("DiscID");
let copy = document.getElementById("copy");
let goto = document.getElementById("goto");
let baseURI = document.baseURI;

copy.addEventListener("click", copyclipboard);
goto.addEventListener("click", gotopage);

function copyclipboard() {
    if (DiscID.value.length > 0) {
        let url = baseURI+"nowplaying/?id="+DiscID.value;
        /* Copy the text inside the text field */
        navigator.clipboard.writeText(url);

        /* Alert the copied text */
        alert("Copied widget url to clipboard");
    } else {
        alert("Please enter a Discord ID");
    }
}

function gotopage() {
    if (DiscID.value.length > 0) {
        window.location.href = baseURI+"nowplaying/?id="+DiscID.value;
    } else {
        alert("Please enter a Discord ID");
    }
}