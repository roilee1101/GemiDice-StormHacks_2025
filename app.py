from flask import Flask, render_template, request, jsonify, session
import os
from dotenv import load_dotenv
import google.generativeai as genai
import random
import re

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

IMPORTANT: After your narration, you MUST update the player's state using a special format on a new line.
- To change HP: `[STATE_UPDATE: HP=-2]` or `[STATE_UPDATE: HP=+1]`
- To add an item: `[STATE_UPDATE: INVENTORY_ADD=Gold Key]`
- To remove an item: `[STATE_UPDATE: INVENTORY_REMOVE=Torch]`
- You can combine them: `[STATE_UPDATE: HP=-5, INVENTORY_ADD=Goblin Ear]`

Example response:
You narrowly dodge the goblin's rusty dagger, but its claws scratch your arm. (DC 14). You roll a 10! Failure! You take 3 damage.
[STATE_UPDATE: HP=-3]

Always respect the player's current HP, inventory, and past actions.
If the players HP reaches 0, declare the game over.
Start the game with a welcoming message and a description of the starting scene.
The player starts with 10 HP and a short sword in their inventory.
"""

INTRO_SCENARIOS = [
    "Welcome to your adventure! You find yourself in a dimly lit tavern, the smell of stale ale and sawdust filling the air. A cloaked figure sits in the corner, beckoning you over. What do you do?",
    "You awaken at the mouth of a dark cave, a chilling wind whispering secrets from its depths. Your head throbs, and you have no memory of how you arrived here. A faint, pulsating light emanates from deep within. Do you venture into the darkness or try to find your way back through the dense, surrounding forest?",
    "You find yourself in the crowded marketplace of a sprawling desert city. The air is thick with the scent of exotic spices and the sounds of merchants haggling. A wanted poster bearing a striking resemblance to you is plastered on a nearby wall. Suddenly, a guard's gaze meets yours. What do you do?",
    "You stand before the crumbling ruins of an ancient, forgotten temple. Ivy clings to weathered stone, and a sense of immense power hangs in the air. A weathered stone altar sits in the center of the ruins, a single, gleaming artifact resting upon it. As you approach, the ground begins to tremble. What is your next move?"
]

def get_initial_state():
    """Returns the initial state for a new game."""
    return {"hp": 10, "inventory": ["Short Sword"]}

def parse_and_update_state(dm_response, player_state):
    """Parses state changes from the DM's response and updates the player state."""
    narration = dm_response.split("[STATE_UPDATE:")[0].strip()
    match = re.search(r'\[STATE_UPDATE:\s*(.*?)\]', dm_response)
    
    if not match:
        return narration, player_state

    update_str = match.group(1)
    updates = [u.strip() for u in update_str.split(',')]

    for update in updates:
        try:
            key, value = update.split('=', 1)
            if key == 'HP':
                player_state['hp'] += int(value)
            elif key == 'INVENTORY_ADD':
                if value not in player_state['inventory']:
                    player_state['inventory'].append(value)
            elif key == 'INVENTORY_REMOVE':
                if value in player_state['inventory']:
                    player_state['inventory'].remove(value)
        except ValueError:
            continue # Ignore malformed updates
            
    return narration, player_state

@app.route("/")
def index():
    """Render the main game page."""
    return render_template("index.html")

@app.route("/start", methods=["GET"])
def start_game():
    """Provides a random starting scenario and initial player state."""
    scenario = random.choice(INTRO_SCENARIOS)
    session["start_scenario"] = scenario
    session["player_state"] = get_initial_state()
    session["history"] = [
        {"role": "user", "parts": [{"text": SYSTEM_PROMPT}]},
        {"role": "model", "parts": [{"text": scenario}]}
    ]
    return jsonify({"response": scenario, "player_state": session["player_state"]})

@app.route("/chat", methods=["POST"])
def chat():
    """Handle the player's chat input."""
    player_input = request.json.get("message")

    if "history" not in session:
        # This should ideally not happen if the frontend calls /start first,
        # but as a fallback, initialize a new game.
        scenario = random.choice(INTRO_SCENARIOS)
        session["start_scenario"] = scenario
        session["player_state"] = get_initial_state()
        session["history"] = [
            {"role": "user", "parts": [{"text": SYSTEM_PROMPT}]},
            {"role": "model", "parts": [{"text": scenario}]}
        ]

    session["history"].append({"role": "user", "parts": [{"text": player_input}]})

    try:
        model = genai.GenerativeModel('gemini-pro-latest')
        chat_session = model.start_chat(history=session["history"])
        response = chat_session.send_message(player_input)
        dm_response_text = response.text

        narration, updated_state = parse_and_update_state(dm_response_text, session["player_state"].copy())
        session["player_state"] = updated_state
        
        session["history"].append({"role": "model", "parts": [{"text": dm_response_text}]})
        session.modified = True

        return jsonify({"response": narration, "player_state": session["player_state"]})
    except Exception as e:
        return jsonify({"response": f"An error occurred: {e}"}), 500

@app.route("/reset", methods=["POST"])
def reset():
    """Reset the game state and provide a new scenario."""
    session.clear()
    scenario = random.choice(INTRO_SCENARIOS)
    session["start_scenario"] = scenario
    session["player_state"] = get_initial_state()
    session["history"] = [
        {"role": "user", "parts": [{"text": SYSTEM_PROMPT}]},
        {"role": "model", "parts": [{"text": scenario}]}
    ]
    return jsonify({"response": scenario, "player_state": session["player_state"]})

if __name__ == "__main__":
    app.run(debug=True)
