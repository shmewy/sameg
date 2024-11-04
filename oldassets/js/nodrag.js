document.addEventListener('DOMContentLoaded', function () {
  const images = document.querySelectorAll('img');

  images.forEach((image) => {
    image.setAttribute('draggable', 'false');
  });
});
