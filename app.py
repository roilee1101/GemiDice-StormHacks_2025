from flask import Flask, render_template, request, jsonify, session
import openai
import os

app = Flask(__name__)
app.secret_key = "your-secret-key"

openai.api_key = "YOUR_API_KEY"  # Replace with your OpenAI key

SYSTEM_PROMPT = """
You are a Dungeon Master narrating a fantasy adventure.
Respond vividly but briefly (3–5 sentences).
Take into account the player's HP, inventory, and actions.
End the story if the player dies or wins.
"""

# --- Helper function ---
def get_dm_response(history, player_state):
    prompt = SYSTEM_PROMPT + f"\nPlayer state: {player_state}\n\n"
    for h in history[-5:]:
        prompt += f"{h['role'].capitalize()}: {h['content']}\n"

    completion = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[{"role": "system", "content": prompt}]
    )
    return completion.choices[0].message.content.strip()

# --- Routes ---
@app.route("/")
def index():
    # Initialize session data if first visit
    if "history" not in session:
        session["history"] = []
        session["player"] = {"hp": 10, "inventory": [], "location": "village"}
    return render_template("index.html")

@app.route("/message", methods=["POST"])
def message():
    user_msg = request.json["message"]

    history = session.get("history", [])
    player = session.get("player", {"hp": 10, "inventory": [], "location": "village"})

    history.append({"role": "player", "content": user_msg})
    response = get_dm_response(history, player)

    history.append({"role": "dm", "content": response})

    # Simple HP check (could expand later)
    if "hp" in response.lower():
        try:
            player["hp"] = int(response.lower().split("hp")[0].split()[-1])
        except:
            pass

    session["history"] = history
    session["player"] = player

    return jsonify({"response": response, "hp": player["hp"]})

@app.route("/reset", methods=["POST"])
def reset():
    session.clear()
    return jsonify({"status": "reset"})

if __name__ == "__main__":
    app.run(debug=True)
