document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const playerInput = document.getElementById("player-input");
    const sendBtn = document.getElementById("send-btn");
    const resetBtn = document.getElementById("reset-btn");
    const saveBtn = document.getElementById("save-btn");
    const loadBtn = document.getElementById("load-btn");

    const addMessage = (message, sender) => {
        const messageElement = document.createElement("div");
        messageElement.classList.add(sender === "player" ? "player-message" : "dm-message");

        const contentWrapper = document.createElement("div");
        contentWrapper.classList.add("message-content");

        const textElement = document.createElement("span")
        textElement.innerHTML = `<span class="icon">${sender === "player" ? "🧝‍♂️" : "🧙"}</span> ${message}`;
        contentWrapper.appendChild(textElement);

        if(sender === "dm"){
            const ttsButton = document.createElement("button");
            ttsButton.classList.add("tts-button");
            ttsButton.textContent = "🔊"; // Speaker emoji
            ttsButton.dataset.text = message;
            contentWrapper.appendChild(ttsButton);
        }

        messageElement.appendChild(contentWrapper);
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
        
    };

    const updateStats = (playerState) => {
        const hpValue = document.getElementById("hp-value");
        const inventoryList = document.getElementById("inventory-list");

        hpValue.textContent = playerState.hp;
        inventoryList.innerHTML = ""; // Clear old inventory

        if (playerState.inventory.length === 0) {
            const li = document.createElement("li");
            li.textContent = "(empty)";
            inventoryList.appendChild(li);
        } else {
            playerState.inventory.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item;
                inventoryList.appendChild(li);
            });
        }
    };

    const sendMessage = async () => {
        const message = playerInput.value.trim();
        if (message) {
            addMessage(message, "player");
            playerInput.value = "";
            const response = await fetch("/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            });
            const data = await response.json();
            addMessage(data.response, "dm");
            updateStats(data.player_state);
        }
    };

    const resetGame = async () => {
        const response = await fetch("/reset", { method: "POST" });
        const data = await response.json();
        chatBox.innerHTML = "";
        addMessage(data.response, "dm");
        updateStats(data.player_state);
    };

    sendBtn.addEventListener("click", sendMessage);
    playerInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
    resetBtn.addEventListener("click", resetGame);

    const fetchStartScenario = async () => {
        const response = await fetch("/start");
        const data = await response.json();
        addMessage(data.response, "dm");
        updateStats(data.player_state);
    };

    const saveGame = async () => {
        const response = await fetch("/save", { "method": "POST" });
        const data = await response.json();
        alert(data.message);
    };

    const loadGame = async () => {
        const response = await fetch("/load", { "method": "POST" });
        const data = await response.json();

        if (data.status == "success") {
            chatBox.innerHTML = "";

            data.history.slice(1).forEach(message => {
                const sender = message.role === "user" ? "player" : "dm";
                const text = message.parts[0].text.split("[STATE_UPDATE:")[0].trim();
                addMessage(text, sender);
            });

            updateStats(data.player_state);
            alert(data.message);
        } else {
            alert(data.message);
        }
    };

    saveBtn.addEventListener("click", saveGame);
    loadBtn.addEventListener("click", loadGame);

    const playAudio = async (text) => {
        try {
            const response = await fetch("/synthesize", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({text: text}),
            });

            if(!response.ok){
                throw new Error("Failed to convert text to speech.");
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();

            audio.onended = () => {
                URL.revokeObjectURL(audioUrl);
            };
        } catch (error){
            console.error("audio playback error");
        }
    };

    chatBox.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("tts-button")) {
            const textToSpeak = e.target.dataset.text;
            if (textToSpeak) {
                playAudio(textToSpeak);
            }
        }
    });

    // Initial game start
    fetchStartScenario();
});
