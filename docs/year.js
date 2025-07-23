document.addEventListener('DOMContentLoaded', () => {
  const year = new Date().getFullYear();
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = year;
  });
});
