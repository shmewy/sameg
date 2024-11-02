let currentIndex = 0;
let gamesData = [];

// Load JSON data and render carousel
fetch('index.json')
  .then(response => response.json())
  .then(data => {
    gamesData = data;
    renderCarousel();
  })
  .catch(error => console.error('Error loading JSON data:', error));

// Function to render the carousel items
function renderCarousel() {
  const carouselContainer = document.getElementById('carousel-container');
  carouselContainer.innerHTML = ''; // Clear existing items

  const game = gamesData[currentIndex];
  const listItem = document.createElement('li');
  listItem.className = 'primeCarouselLi';
  listItem.innerHTML = `
    <a class="css-h13zhk" href="${game.url}">
      <div class="gameThumbTitleContainer">${game.name}</div>
      <img src="${game.imageSrc}" alt="${game.name}" class="GameThumbImage" loading="eager">
    </a>
  `;
  carouselContainer.appendChild(listItem);
}

// Event listeners for navigation buttons
document.getElementById('prev').addEventListener('click', () => {
  currentIndex = (currentIndex > 0) ? currentIndex - 1 : gamesData.length - 1;
  renderCarousel();
});

document.getElementById('next').addEventListener('click', () => {
  currentIndex = (currentIndex < gamesData.length - 1) ? currentIndex + 1 : 0;
  renderCarousel();
});
