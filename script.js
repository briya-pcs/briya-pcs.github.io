const WS_SERVER = "wss://translation-websocket-k466.onrender.com"; // Your WebSocket server URL

let lastTranslation = ""; // Store last received translation to prevent duplicates

function connectWebSocket() {
    const socket = new WebSocket(WS_SERVER);

    socket.onopen = () => {
        console.log("✅ Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
        console.log("📩 Received new translation:", event.data);

        try {
            const data = JSON.parse(event.data);
            const urlParams = new URLSearchParams(window.location.search);
            const language = urlParams.get("lang") || "Spanish";

            if (data.translations && data.translations[language]) {
                let newText = data.translations[language].trim().replace(/\n/g, "<br>");

                // Get elements
                let currentText = document.getElementById("latestParagraph");
                let transcript = document.getElementById("transcript");
                let anchor = document.getElementById("anchor");

                // 🔹 Check if newText is ACTUALLY different from lastTranslation
                if (newText !== lastTranslation) {
                    if (currentText.innerHTML.trim() !== "") {  
                        // Store previous translation in transcript before updating
                        transcript.innerHTML += currentText.innerHTML + "<br>";
                    }

                    // Update the latest translation
                    currentText.innerHTML = newText;
                    
                    // Update last received translation
                    lastTranslation = newText;

                    // Scroll to bottom of transcript
                    if (anchor) {
                        anchor.scrollIntoView({ behavior: "smooth" });
                    }
                } else {
                    console.log("📌 No new translation, skipping update.");
                }
            }
        } catch (error) {
            console.error("❌ Error processing WebSocket message:", error);
        }
    };

    socket.onerror = (error) => {
        console.error("⚠️ WebSocket error:", error);
    };

    socket.onclose = () => {
        console.warn("⚠️ WebSocket disconnected. Reconnecting in 5 seconds...");
        setTimeout(connectWebSocket, 5000); // Auto-reconnect if disconnected
    };
}

function showQR() {
    let cornerQR = document.getElementById("corner_qr");
    let mobileIconRight = document.getElementById("mobile_icon_right");

    if (cornerQR.style.display === "block") {
        cornerQR.style.display = "none";
        mobileIconRight.style.display = "block";
    } else {
        cornerQR.style.display = "block";
        mobileIconRight.style.display = "none";

        // Set a timeout to revert back after 60 seconds if still visible
        setTimeout(function() {
            if (cornerQR.style.display === "block") {
                cornerQR.style.display = "none";
                mobileIconRight.style.display = "block";
            }
        }, 60000); // 60,000 milliseconds = 60 seconds
    }
}

// Start WebSocket connection
connectWebSocket();
