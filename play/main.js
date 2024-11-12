function hideBottomBar() {
	const bottomBar = document.getElementById("bottom-bar");
	if (bottomBar.style.display === "none") {
		bottomBar.style.display = "flex"; // Show the bar
	} else {
		bottomBar.setAttribute("style", "display: none !important;"); // Hide the bar with !important
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const queryString = decodeURIComponent(window.location.search.substring(1));
	const gameTitleElement = document.getElementById("game-title");
	const iframeContainer = document.getElementById("game-placeholder");

	if (!queryString) {
		window.location.href = "/library.html";
		gameTitleElement.textContent = "Error";
	} else {
		const query = queryString.toLowerCase().replace(/%20/g, " ");
		fetch("/index.json")
			.then((response) => response.json())
			.then((data) => {
				const matchingGame = data.find(
					(game) => game.name.toLowerCase() === query,
				);
				if (matchingGame) {
					gameTitleElement.textContent = matchingGame.name;
					document.getElementById("FullscreenGlitchUrl").href =
						matchingGame.url;
					document.getElementById("contentBackground").src =
						matchingGame.imageSrc;

					const originalUrl = matchingGame.url;
					const replacedUrl = originalUrl.includes("index.html")
						? originalUrl.replace("index.html", "")
						: originalUrl;

					const urlsToTry = [
						`${replacedUrl}game.html`,
						`${replacedUrl}build/index.html`,
						`${replacedUrl}file/index.html`,
						`${replacedUrl}game/index.html`,
					];

					// Load the loading screen immediately
					const showLoadingScreen = () => {
						// Create loading iframe
						iframeContainer.innerHTML = `<iframe class="game-iframe loading-iframe" id="loading-area" src="/loading.html" width="480" height="800" scrolling="none" frameborder="0" allowfullscreen></iframe>`;

						// Create overlay iframe
						iframeContainer.innerHTML += `<iframe class="game-iframe overlay-iframe" id="overlay-area" src="about:blank" width="480" height="800" scrolling="none" frameborder="0" allowfullscreen></iframe>`;

						// Remove loading iframe after 3 seconds
						setTimeout(() => {
							const loadingIframe = document.getElementById("loading-area");
							const overlayIframe = document.getElementById("overlay-area");
							const fullscreenBtn = document.getElementById("fullscreen-btn");
							if (loadingIframe) {
								fullscreenBtn.onclick = () => open_fullscreen();
								fullscreenBtn.classList.remove("fullscreen-btn-disabled");
								overlayIframe.remove();
								loadingIframe.style.display = "none"; // Hide loading iframe
							}
						}, 20); // 3000 milliseconds = 3 seconds
					};

					const loadGame = async (url) => {
						// Load the game iframe
						iframeContainer.innerHTML += `
        <iframe class="game-iframe calc-height" id="game-area" src="${url}" width="480" height="800" scrolling="none" frameborder="0" allowfullscreen></iframe>
       <div id="bottom-bar" class="d-flex justify-content-between align-items-center p-2 text-white">
    <div class="bottom-bar-left d-flex align-items-center">
	<img src="/app.png" alt="melogo" width="30" height="30" style="margin-right: 5px;" class="game-bar-icon">
        <span class="game-bar-name text-truncate">${gameTitleElement.textContent}</span>
    </div>
    <div class="bottom-bar-center mx-auto text-center">
        <button onclick="document.getElementById('bottom-bar').classList.add('hidden');
document.getElementById('game-area').classList.remove('calc-height');" id="hide-bar-btn" class="btn btn-light btn-sm">
            <i class="fa-solid fa-eye-slash"></i> Hide This Bar
        </button>
    </div>
    <div class="bottom-bar-right">
        <button onclick="document.exitFullscreen();" id="exit-fullscreen-btn" class="btn btn-light btn-sm">
            <i class="fa-solid fa-compress"></i>
        </button>
    </div>
</div>

        `;
					};

					const tryUrls = async () => {
						// Display loading.html immediately
						showLoadingScreen();

						// Check each URL one by one
						for (const currentUrl of urlsToTry) {
							try {
								const response = await fetch(currentUrl, { method: "HEAD" });
								if (response.ok) {
									console.warn(`Changed URL to: ${currentUrl}`);
									await loadGame(currentUrl); // Load the valid game URL
									return; // Exit after loading
								}
							} catch (error) {
								console.error("Error checking URL:", error);
							}
						}

						// If all URLs fail, fallback to the original URL
						console.error("No valid URLs found, falling back to original URL");
						await loadGame(originalUrl);
					};

					const playButton = document.getElementById("play-now-btn");
					playButton.addEventListener("click", () => {
						tryUrls(); // Start the URL checking process
					});
				} else {
					gameTitleElement.textContent = "Game not found";
				}
			})
			.catch((error) => {
				console.error("Error fetching JSON:", error);
				gameTitleElement.textContent = "Error fetching game data";
			});
	}
});
