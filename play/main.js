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
					(game) => game.name.toLowerCase() === query
				);

				if (matchingGame) {
					gameTitleElement.textContent = matchingGame.name;
					document.getElementById("FullscreenGlitchUrl").href = matchingGame.url;
					document.getElementById("contentBackground").src = matchingGame.imageSrc;

					// Check if showbar is explicitly set to false
					if (matchingGame.showbar === false) {
						// Redirect directly to the game's URL if showbar is false
						window.location.href = matchingGame.url;
					} else {
						// Proceed with iframe loading if showbar is true or undefined
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
							iframeContainer.innerHTML = `
								<iframe class="game-iframe loading-iframe" id="loading-area" src="/loading.html" width="480" height="800" scrolling="none" frameborder="0" allowfullscreen></iframe>
								<iframe class="game-iframe overlay-iframe" id="overlay-area" src="about:blank" width="480" height="800" scrolling="none" frameborder="0" allowfullscreen></iframe>
							`;

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

								document.getElementById("fullscreen-btn").addEventListener("click", () => {
									const gameContainer = document.getElementById("game-player");
									
									if (!document.fullscreenElement) {
										// Enter fullscreen
										if (gameContainer.requestFullscreen) {
											gameContainer.requestFullscreen();
										} else if (gameContainer.webkitRequestFullscreen) {
											gameContainer.webkitRequestFullscreen();
										} else if (gameContainer.msRequestFullscreen) {
											gameContainer.msRequestFullscreen();
										} else if (gameContainer.mozRequestFullScreen) {
											gameContainer.mozRequestFullScreen();
										}
									} else {
										// Exit fullscreen
										if (document.exitFullscreen) {
											document.exitFullscreen();
										} else if (document.webkitExitFullscreen) {
											document.webkitExitFullscreen();
										} else if (document.msExitFullscreen) {
											document.msExitFullscreen();
										} else if (document.mozCancelFullScreen) {
											document.mozCancelFullScreen();
										}
									}
								});
			
								function open_fullscreen() {
									const gameContainer = document.getElementById("game-player");
									
									if (!document.fullscreenElement) {
										// Enter fullscreen
										if (gameContainer.requestFullscreen) {
											gameContainer.requestFullscreen();
										} else if (gameContainer.webkitRequestFullscreen) {
											gameContainer.webkitRequestFullscreen();
										} else if (gameContainer.msRequestFullscreen) {
											gameContainer.msRequestFullscreen();
										} else if (gameContainer.mozRequestFullScreen) {
											gameContainer.mozRequestFullScreen();
										}
									} else {
										// Exit fullscreen
										if (document.exitFullscreen) {
											document.exitFullscreen();
										} else if (document.webkitExitFullscreen) {
											document.webkitExitFullscreen();
										} else if (document.msExitFullscreen) {
											document.msExitFullscreen();
										} else if (document.mozCancelFullScreen) {
											document.mozCancelFullScreen();
										}
									}
								}
							}, 3000);
						};

						const loadGame = async (url) => {
							// Load the game iframe and bottom bar
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
										await loadGame(currentUrl);
										return;
									}
								} catch (error) {
									console.error("Error checking URL:", error);
								}
							}

							// Fallback to the original URL if all URLs fail
							await loadGame(originalUrl);
						};

						// Initialize URL check on button click
						const playButton = document.getElementById("play-now-btn");
						playButton.addEventListener("click", () => {
							tryUrls();
						});
					}
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
