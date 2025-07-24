document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.show-output').forEach(btn => {
    btn.addEventListener('click', () => {
      const output = btn.nextElementSibling;
      if (!output) return;
      if (output.style.display === 'block') {
        output.style.display = 'none';
        btn.textContent = 'Show Example';
      } else {
        output.style.display = 'block';
        btn.textContent = 'Hide Example';
      }
    });
  });
});
