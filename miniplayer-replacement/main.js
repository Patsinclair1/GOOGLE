(function () {
  const css = `
    #miniplayer-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: #121212;
      z-index: 9999;
      display: none;
      flex-direction: column;
      padding: 20px;
      box-sizing: border-box;
      color: white;
      font-family: Circular, sans-serif;
    }
    #miniplayer-overlay.visible {
      display: flex;
    }
    .miniplayer-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 20px;
      flex: 1;
      margin-bottom: 60px; /* Space for controls */
    }
    .miniplayer-card {
      border: 2px solid #1db954;
      border-radius: 16px;
      padding: 20px;
      background-color: #181818;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }
    .miniplayer-card h2 {
      margin-top: 0;
      margin-bottom: 10px;
      font-size: 1.5em;
    }
    /* Now Playing Card */
    #mp-now-playing {
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    #mp-album-art {
      width: 150px;
      height: 150px;
      border-radius: 8px;
      object-fit: cover;
      margin-bottom: 15px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    }
    #mp-track-title {
      font-size: 1.2em;
      font-weight: bold;
      margin-bottom: 5px;
    }
    #mp-track-artist {
      font-size: 1em;
      color: #b3b3b3;
    }
    /* Search Card */
    #mp-search-input {
      width: 100%;
      padding: 10px;
      border-radius: 20px;
      border: none;
      background-color: #333;
      color: white;
      margin-top: 10px;
    }
    #mp-search-results {
      margin-top: 10px;
      overflow-y: auto;
      flex: 1;
    }
    .mp-search-item {
      padding: 5px 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .mp-search-item:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    .mp-search-img {
      width: 40px;
      height: 40px;
      border-radius: 4px;
    }
    /* Library Card */
    #mp-library-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 10px;
      overflow-y: auto;
    }
    .mp-lib-item {
      text-align: center;
      cursor: pointer;
    }
    .mp-lib-img {
      width: 100%;
      border-radius: 4px;
      margin-bottom: 5px;
    }
    /* Lyrics Card */
    #mp-lyrics-content {
      white-space: pre-wrap;
      overflow-y: auto;
      font-size: 1.1em;
      line-height: 1.4;
      color: #e0e0e0;
      height: 100%;
    }
    /* Controls */
    #mp-controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      position: absolute;
      bottom: 20px;
      left: 0;
      width: 100%;
    }
    .mp-control-btn {
      background: none;
      border: 2px solid #1db954;
      color: #1db954;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .mp-control-btn:hover {
      background-color: rgba(29, 185, 84, 0.1);
    }
    /* Close Button */
    #mp-close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      z-index: 10000;
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  console.log("Miniplayer Replacement Extension Loaded");

  // Create Overlay Element
  const overlay = document.createElement("div");
  overlay.id = "miniplayer-overlay";
  overlay.innerHTML = `
    <button id="mp-close-btn">✖</button>
    <div class="miniplayer-grid">
        <div class="miniplayer-card" id="mp-now-playing">
            <h2>Now Playing</h2>
            <img id="mp-album-art" src="" alt="Album Art">
            <div id="mp-track-title">Track Title</div>
            <div id="mp-track-artist">Artist Name</div>
        </div>
        <div class="miniplayer-card" id="mp-search">
            <h2>Search</h2>
            <input type="text" id="mp-search-input" placeholder="Find music, podcasts...">
            <div id="mp-search-results"></div>
        </div>
        <div class="miniplayer-card" id="mp-library">
            <h2>Your Library</h2>
            <div id="mp-library-grid"></div>
        </div>
        <div class="miniplayer-card" id="mp-lyrics">
            <h2>Lyrics</h2>
            <div id="mp-lyrics-content">Lyrics feature coming soon...</div>
        </div>
    </div>
    <div id="mp-controls">
        <button class="mp-control-btn" id="mp-prev-btn">⏮</button>
        <button class="mp-control-btn" id="mp-play-btn">⏯</button>
        <button class="mp-control-btn" id="mp-next-btn">⏭</button>
    </div>
  `;
  document.body.appendChild(overlay);

  // Toggle Function
  function toggleMiniplayer() {
    const isVisible = overlay.classList.contains("visible");
    if (isVisible) {
      overlay.classList.remove("visible");
    } else {
      overlay.classList.add("visible");
      // Trigger updates
      if (typeof updateNowPlaying === "function") updateNowPlaying();
      if (typeof fetchLibrary === "function") fetchLibrary();
    }
  }

  // Close Button Listener
  document.getElementById("mp-close-btn").addEventListener("click", () => {
      overlay.classList.remove("visible");
  });

  // Add Button to Playbar
  function addPlaybarButton() {
      if (Spicetify.Playbar && Spicetify.Playbar.Button) {
          new Spicetify.Playbar.Button(
              "Miniplayer",
              "maximize-2",
              toggleMiniplayer
          );
      } else {
          // Fallback
          const extraControls = document.querySelector(".main-nowPlayingBar-extraControls");
          if (extraControls) {
              const btn = document.createElement("button");
              btn.style.background = "transparent";
              btn.style.border = "none";
              btn.style.color = "#b3b3b3";
              btn.style.cursor = "pointer";
              btn.style.padding = "0 10px";
              btn.innerHTML = '<svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M15 1H1v14h14V1zM0 0h16v16H0V0z"/></svg>';
              btn.onclick = toggleMiniplayer;
              extraControls.prepend(btn);
          } else {
              setTimeout(addPlaybarButton, 1000);
          }
      }
  }

  // Player Logic
  function updateNowPlaying() {
      if (!Spicetify.Player || !Spicetify.Player.data) return;
      const track = Spicetify.Player.data.track;
      if (!track) return;

      const meta = track.metadata;
      const art = meta.image_xlarge_url || meta.image_large_url || meta.image_url;
      const title = meta.title;
      const artist = meta.artist_name;

      document.getElementById("mp-album-art").src = art;
      document.getElementById("mp-track-title").innerText = title;
      document.getElementById("mp-track-artist").innerText = artist;

      updatePlayButton();
  }

  function updatePlayButton() {
      const isPaused = Spicetify.Player.isPlaying === false;
      // Icons
      document.getElementById("mp-play-btn").innerHTML = isPaused
        ? '<svg height="24" width="24" viewBox="0 0 16 16" fill="currentColor"><path d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"/></svg>'
        : '<svg height="24" width="24" viewBox="0 0 16 16" fill="currentColor"><path d="M2.7 1a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7H2.7zm8 0a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-2.6z"/></svg>';
  }

  // Debounce Utility
  function debounce(func, wait) {
      let timeout;
      return function(...args) {
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(this, args), wait);
      };
  }

  // Search Logic
  const searchInput = document.getElementById("mp-search-input");
  const searchResults = document.getElementById("mp-search-results");

  searchInput.addEventListener("input", debounce(async (e) => {
      const query = e.target.value;
      if (!query || query.length < 2) {
          searchResults.innerHTML = "";
          return;
      }

      if (Spicetify.CosmosAsync) {
          try {
              const res = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/search?type=track&limit=10&q=${encodeURIComponent(query)}`);
              searchResults.innerHTML = "";
              res.tracks.items.forEach(track => {
                  const div = document.createElement("div");
                  div.className = "mp-search-item";

                  const img = document.createElement("img");
                  img.className = "mp-search-img";
                  img.src = track.album.images[2]?.url || '';

                  const infoDiv = document.createElement("div");
                  const titleDiv = document.createElement("div");
                  titleDiv.style.fontWeight = "bold";
                  titleDiv.textContent = track.name;

                  const artistDiv = document.createElement("div");
                  artistDiv.style.fontSize = "0.8em";
                  artistDiv.style.color = "#b3b3b3";
                  artistDiv.textContent = track.artists[0].name;

                  infoDiv.appendChild(titleDiv);
                  infoDiv.appendChild(artistDiv);

                  div.appendChild(img);
                  div.appendChild(infoDiv);

                  div.addEventListener("click", () => {
                      Spicetify.Player.playUri(track.uri);
                  });
                  searchResults.appendChild(div);
              });
          } catch (err) {
              console.error("Search error:", err);
          }
      }
  }, 300));

  // Library Logic
  async function fetchLibrary() {
      const libGrid = document.getElementById("mp-library-grid");
      libGrid.textContent = "Loading...";

      if (Spicetify.CosmosAsync) {
          try {
              const res = await Spicetify.CosmosAsync.get('https://api.spotify.com/v1/me/tracks?limit=20');
              libGrid.textContent = "";
              res.items.forEach(item => {
                  const track = item.track;
                  const div = document.createElement("div");
                  div.className = "mp-lib-item";

                  const img = document.createElement("img");
                  img.className = "mp-lib-img";
                  img.src = track.album.images[1]?.url || '';

                  const titleDiv = document.createElement("div");
                  titleDiv.style.fontSize = "0.8em";
                  titleDiv.style.overflow = "hidden";
                  titleDiv.style.textOverflow = "ellipsis";
                  titleDiv.style.whiteSpace = "nowrap";
                  titleDiv.textContent = track.name;

                  div.appendChild(img);
                  div.appendChild(titleDiv);

                  div.addEventListener("click", () => {
                      Spicetify.Player.playUri(track.uri);
                  });
                  libGrid.appendChild(div);
              });
          } catch (err) {
              console.error("Library error:", err);
              libGrid.textContent = "Error loading library.";
          }
      }
  }

  // Event Listeners
  document.getElementById("mp-prev-btn").addEventListener("click", () => Spicetify.Player.back());
  document.getElementById("mp-play-btn").addEventListener("click", () => Spicetify.Player.togglePlay());
  document.getElementById("mp-next-btn").addEventListener("click", () => Spicetify.Player.next());

  // Wait for Spicetify
  function waitForSpicetify() {
      if (typeof Spicetify !== "undefined" && (Spicetify.Playbar || document.querySelector(".main-nowPlayingBar-extraControls")) && Spicetify.Player) {
          addPlaybarButton();

          Spicetify.Player.addEventListener("songchange", updateNowPlaying);
          Spicetify.Player.addEventListener("onplaypause", updatePlayButton);

          // Initial update
          updateNowPlaying();
      } else {
          setTimeout(waitForSpicetify, 1000);
      }
  }
  waitForSpicetify();
})();
