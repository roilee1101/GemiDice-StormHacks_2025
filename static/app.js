document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const playerInput = document.getElementById("player-input");
    const sendBtn = document.getElementById("send-btn");
    const resetBtn = document.getElementById("reset-btn");

    const addMessage = (message, sender) => {
        const messageElement = document.createElement("div");
        messageElement.classList.add(sender === "player" ? "player-message" : "dm-message");
        messageElement.innerHTML = `<span class="icon">${sender === "player" ? "🧝‍♂️" : "🧙"}</span> ${message}`;
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

    // Initial game start
    fetchStartScenario();
});
