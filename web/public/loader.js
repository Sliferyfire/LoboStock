// function pageLoaded() {
//   let loaderSection = document.querySelector('.loader-section');
//   loaderSection.classList.add('loaded');
// }

// document.onload = pageLoaded();

// loader.js
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const content = document.getElementById('content');

  loader.style.display = 'none'; // Ocultar el loader
  content.style.display = 'block'; // Mostrar el contenido
});