# Miniplayer Replacement Extension

This is a Spicetify extension that replaces the miniplayer with a full-screen dashboard featuring Now Playing, Search, and Library.

**Note:** The Lyrics feature is currently a placeholder ("Coming Soon") as accessing lyrics requires complex internal API handling.

## Installation

1.  Copy the `miniplayer-replacement` folder to your Spicetify Extensions directory.
    -   Typical location: `~/.config/spicetify/Extensions/` (Linux/macOS) or `%appdata%\spicetify\Extensions\` (Windows).
2.  Open your terminal and run:
    ```bash
    spicetify config extensions miniplayer-replacement/main.js
    spicetify apply
    ```
    Note: You may need to specify the path to `main.js` correctly depending on your Spicetify config. If you copied the folder, try:
    ```bash
    spicetify config extensions miniplayer-replacement/main.js
    ```
    Or copy `main.js` directly to `Extensions/` and run:
    ```bash
    spicetify config extensions main.js
    ```

3.  Restart Spotify if needed.

## Usage

Click the "Miniplayer" button in the bottom right corner of the Spotify playbar to toggle the dashboard.
