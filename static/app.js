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
        }
    };

    const resetGame = async () => {
        await fetch("/reset", { method: "POST" });
        chatBox.innerHTML = "";
        addMessage("Welcome to your new adventure! You find yourself in a dimly lit tavern...", "dm");
    };

    sendBtn.addEventListener("click", sendMessage);
    playerInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
    resetBtn.addEventListener("click", resetGame);

    // Initial welcome message
    addMessage("Welcome to your adventure! You find yourself in a dimly lit tavern...", "dm");
});
