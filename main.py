import os
from dotenv import load_dotenv
import google.generativeai as genai

def main():
    """
    A simple command-line interface for interacting with the Gemini API.
    """
    load_dotenv()

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not found in .env file.")
        return

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-pro-latest')
    chat = model.start_chat(history=[])

    print("Gemini CLI Chat. Type 'exit' or 'quit' to end.")
    print("-" * 20)

    while True:
        try:
            user_input = input("You: ")
            if user_input.lower() in ["exit", "quit"]:
                print("Exiting chat. Goodbye!")
                break

            response = chat.send_message(user_input)
            print(f"Gemini: {response.text}")

        except KeyboardInterrupt:
            print("\nExiting chat. Goodbye!")
            break
        except Exception as e:
            print(f"An error occurred: {e}")
            break

if __name__ == "__main__":
    main()