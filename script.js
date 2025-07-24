document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const output = btn.parentElement.querySelector('.prompt-output');
      if (output) {
        output.classList.toggle('show');
        btn.textContent = output.classList.contains('show') ? 'Hide Output' : 'Show Output';
      }
    });
  });
});
