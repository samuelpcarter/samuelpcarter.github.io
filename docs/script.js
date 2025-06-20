async function loadData() {
  const publicUrl = 'https://raw.githubusercontent.com/baxter2/data-btc-treasuries.com/master/public_companies.json';
  const privateUrl = 'https://raw.githubusercontent.com/baxter2/data-btc-treasuries.com/master/private_companies.json';
  let companies = [];
  try {
    const [pubRes, privRes] = await Promise.all([fetch(publicUrl), fetch(privateUrl)]);
    const pubJson = await pubRes.json();
    const privJson = await privRes.json();
    companies = pubJson.concat(privJson);
  } catch (err) {
    console.error('Failed to fetch data', err);
    return;
  }
  const rows = companies.map(comp => {
    const latest = comp.transactions && comp.transactions[comp.transactions.length - 1];
    if (!latest) return null;
    const parts = latest.date.split('/');
    const dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    const ticker = comp.short_ticker || comp.long_ticker || comp.permalink || '';
    return { ticker, name: comp.name, date: dateObj };
  }).filter(Boolean);
  rows.sort((a, b) => b.date - a.date);
  const tbody = document.getElementById('data-body');
  tbody.innerHTML = '';
  rows.forEach(row => {
    const tr = document.createElement('tr');
    const t1 = document.createElement('td');
    t1.textContent = row.ticker;
    const t2 = document.createElement('td');
    t2.textContent = row.name;
    const t3 = document.createElement('td');
    t3.textContent = row.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    tr.appendChild(t1);
    tr.appendChild(t2);
    tr.appendChild(t3);
    tbody.appendChild(tr);
  });
}

document.addEventListener('DOMContentLoaded', loadData);
