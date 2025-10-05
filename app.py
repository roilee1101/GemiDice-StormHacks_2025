from flask import Flask, render_template, request, jsonify, session
import os
from dotenv import load_dotenv
import google.generativeai as genai
import random

load_dotenv()

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Configure the Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file.")
genai.configure(api_key=api_key)

# System prompt for the AI Dungeon Master
SYSTEM_PROMPT = """
You are a Dungeon Master in a fantasy adventure. 
You will narrate events vividly but concisely (3-5 sentences). 

When the player attempts an action with a chance of failure (like attacking, persuading, or picking a lock), you must use a dice roll mechanic.
1. First, determine the action's Difficulty Class (DC), a number from 5 (very easy) to 20 (very hard).
2. Simulate a 20-sided die roll (d20).
3. Narrate the action, the DC, and the result of the roll. For example: "You swing your sword at the goblin (DC 12). You roll a 16! Success!"
4. If the roll is greater than or equal to the DC, the action succeeds. Otherwise, it fails. Describe the outcome clearly.

Always respect the player's current HP, inventory, and past actions.
If the player’s HP reaches 0, declare the game over.
Start the game with a welcoming message and a description of the starting scene.
"""

INTRO_SCENARIOS = [
    "Welcome to your adventure! You find yourself in a dimly lit tavern, the smell of stale ale and sawdust filling the air. A cloaked figure sits in the corner, beckoning you over. What do you do?",
    "You awaken at the mouth of a dark cave, a chilling wind whispering secrets from its depths. Your head throbs, and you have no memory of how you arrived here. A faint, pulsating light emanates from deep within. Do you venture into the darkness or try to find your way back through the dense, surrounding forest?",
    "You find yourself in the crowded marketplace of a sprawling desert city. The air is thick with the scent of exotic spices and the sounds of merchants haggling. A wanted poster bearing a striking resemblance to you is plastered on a nearby wall. Suddenly, a guard's gaze meets yours. What do you do?",
    "You stand before the crumbling ruins of an ancient, forgotten temple. Ivy clings to weathered stone, and a sense of immense power hangs in the air. A weathered stone altar sits in the center of the ruins, a single, gleaming artifact resting upon it. As you approach, the ground begins to tremble. What is your next move?"
]

@app.route("/")
def index():
    """Render the main game page."""
    return render_template("index.html")

@app.route("/start", methods=["GET"])
def start_game():
    """Provides a random starting scenario."""
    scenario = random.choice(INTRO_SCENARIOS)
    session["start_scenario"] = scenario
    return jsonify({"response": scenario})

@app.route("/chat", methods=["POST"])
def chat():
    """Handle the player's chat input."""
    player_input = request.json.get("message")

    if "history" not in session:
        session["history"] = []
        session["player_state"] = {"hp": 10, "inventory": []}
        # Prepend the system prompt and the starting scenario to the history
        session["history"].append({"role": "user", "parts": [{"text": SYSTEM_PROMPT}]})
        start_scenario = session.get("start_scenario", "You are in a tavern.") # Fallback
        session["history"].append({"role": "model", "parts": [{"text": start_scenario}]})

    # Add the player's message to the history
    session["history"].append({"role": "user", "parts": [{"text": player_input}]})

    try:
        model = genai.GenerativeModel('gemini-pro-latest')
        chat_session = model.start_chat(history=session["history"])
        response = chat_session.send_message(player_input)
        dm_response = response.text

        # Add the DM's response to the history
        session["history"].append({"role": "model", "parts": [{"text": dm_response}]})
        session.modified = True

        return jsonify({"response": dm_response})
    except Exception as e:
        return jsonify({"response": f"An error occurred: {e}"}), 500

@app.route("/reset", methods=["POST"])
def reset():
    """Reset the game state."""
    session.clear()
    return jsonify({"status": "success"})

if __name__ == "__main__":
    app.run(debug=True)
