// Toggle mobile navigation
const hamburger = document.querySelector('.hamburger');
const navigation = document.querySelector('.navigation');

hamburger.addEventListener('click', () => {
  navigation.classList.toggle('show');
});