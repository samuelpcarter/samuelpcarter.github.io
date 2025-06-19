async function loadTreasuries() {
  try {
    const res = await fetch('treasuries.json');
    const data = await res.json();
    const tbody = document.querySelector('#treasury-table tbody');
    data.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${item.ticker}</td><td>${item.company}</td><td>${item.date}</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error loading treasuries', err);
  }
}

async function loadPrices() {
  try {
    const res = await fetch('prices.json');
    const data = await res.json();
    const banner = document.getElementById('ticker-banner');
    banner.innerHTML = data
      .map(p => `${p.ticker}: $${p.price} (${p.percentChange}%)`)
      .join(' | ');
  } catch (err) {
    console.error('Error loading prices', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadTreasuries();
  loadPrices();
});
