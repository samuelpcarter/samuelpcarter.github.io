let newTickers = new Set();

async function loadTreasuries() {
  try {
    const res = await fetch('treasuries.json');
    const data = await res.json();
    const tbody = document.querySelector('#treasury-table tbody');
    tbody.innerHTML = '';
    data.forEach(item => {
      const tr = document.createElement('tr');
      let tickerCell = item.ticker;
      if (item.new) {
        tickerCell += ' <span class="new-label">NEW</span>';
        newTickers.add(item.ticker);
      }
      tr.innerHTML = `<td>${tickerCell}</td><td>${item.company}</td><td>${item.date}</td>`;
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
      .map(p => {
        const label = newTickers.has(p.ticker) ? ' <span class="new-label">NEW</span>' : '';
        return `${p.ticker}${label}: $${p.price} (${p.percentChange}%)`;
      })
      .join(' | ');
  } catch (err) {
    console.error('Error loading prices', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadTreasuries();
  loadPrices();
});
