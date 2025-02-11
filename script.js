// URL of your Google Apps Script Web App
const scriptUrl = "https://script.google.com/macros/s/AKfycbzrZ_v6l2Ff18cEcfrPZ29lDqzeufnADUm0ydNNNG2TqyuID3QG3Ey7FhDjbqDt47FiTw/exec";

// Function to fetch and display translations
async function fetchTranslations(lang) {
    try {
        let response = await fetch(scriptUrl);
        let data = await response.json();
        var currentText = document.getElementById("latestParagraph");
        var anchor = document.getElementById('anchor');

        let newText = data[lang].replace(/\n/g, "<br>");

        if (currentText.innerHTML !== newText) {
            if (currentText.innerHTML.trim() !== "") {  // Prevents leading <br>
                document.getElementById("transcript").innerHTML += currentText.innerHTML + "<br>";
            }
            currentText.innerHTML = newText;
            anchor.scrollIntoView({behavior:"smooth"});
        } else {
            console.log("same");
        } 
    } catch (error) {
        console.error("Error fetching translations:", error);
    }
}

// Fetch translations every 3 seconds
var tid = setInterval(fetchTranslations, 3000);
window.onload = fetchTranslations;

function showQR() {
    if (document.getElementById("corner_qr").style.display == "block"){
        document.getElementById("corner_qr").style.display = "none";
        document.getElementById("mobile_icon_right").style.display = "block";
    } else {
        document.getElementById("corner_qr").style.display = "block";
        document.getElementById("mobile_icon_right").style.display = "none";
    }
}
