# stormhacks2025

## Setup

1.  **Clone the repository:**

2.  **Create a virtual environment:**
    ```bash
    python3 -m venv venv
    ```

3.  **Activate the virtual environment:**
    *   **On macOS and Linux:**
        ```bash
        source venv/bin/activate
        ```
    *   **On Windows:**
        ```bash
        venv\Scripts\activate
        ```

4.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Create a `.env` file:**
    Create a `.env` file in the root of the project and add your Gemini API key:
    ```
    GEMINI_API_KEY="YOUR_API_KEY"
    ```
    Replace "YOUR_API_KEY" with your actual Gemini API key.

## Usage

1.  **Run the application:**
    ```bash
    python main.py
    ```

2.  **Enter a prompt:**
    When prompted, type your message and press Enter.

3.  **Exit the application:**
    Type `exit` or `quit` to end the conversation.
