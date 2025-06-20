// multiple proxies -> first that works wins
const targets=[
  'https://api.allorigins.win/raw?url=https://bitcointreasuries.com',
  'https://corsproxy.io/?https://bitcointreasuries.com',
  'https://proxy.cors.sh/https://bitcointreasuries.com'
];
const tbody=document.getElementById('tbody');
const stamp=document.getElementById('stamp');
document.getElementById('reload').onclick=load;
load(); setInterval(load,3600e3);          // hourly

async function fetchHTML(u){
  const opt=u.includes('cors.sh')?{headers:{'x-cors-api-key':'free'}}:{};
  const r=await fetch(u,opt);
  if(!r.ok) throw Error(r.statusText);
  return r.text();
}
function grabRows(html){
  const doc=new DOMParser().parseFromString(html,'text/html');
  return [...doc.querySelectorAll('tr')].filter(tr=>/new/i.test(tr.textContent));
}
function render(rows){
  tbody.innerHTML='';
  rows.forEach(r=>{
    const tds=[...r.querySelectorAll('td')].map(td=>td.textContent.trim());
    if(!tds.length) return;
    const [sym,co,btc,usd]=tds;
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${sym.replace(/new/i,'').trim()}</td>
                  <td>${co||''}</td><td>${btc||''}</td><td>${usd||''}</td>`;
    tbody.appendChild(tr);
  });
}
async function load(){
  stamp.textContent='updating…';
  for(const u of targets){
    try{
      const html=await fetchHTML(u);
      const rows=grabRows(html);
      if(rows.length){render(rows);stamp.textContent='last update '+new Date().toLocaleString();return;}
    }catch(e){/* try next */ }
  }
  stamp.textContent='fetch failed – retry ↻';
}
