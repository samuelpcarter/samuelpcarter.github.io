const sources=['https://bitbo.io/treasuries/new-entities/'];
const proxies=[u=>`https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
               u=>`https://corsproxy.io/?${u}`,
               u=>`https://proxy.cors.sh/${u}`];
const tbody=document.getElementById('tbody');
const stamp=document.getElementById('stamp');
document.getElementById('reload').onclick=load;
load(); setInterval(load,3600e3);

async function fetchHTML(url){
  for(const make of proxies){
    try{
      const r=await fetch(make(url),{headers:{'x-cors-api-key':'free'}});
      if(r.ok) return r.text();
    }catch(_){}
  }
  throw Error('all proxies failed');
}
function parse(html){
  const doc=new DOMParser().parseFromString(html,'text/html');
  return [...doc.querySelectorAll('h3')].map(h=>{
    const [ticker,...nameArr]=h.textContent.split('-');
    const name=nameArr.join('-').trim();
    let el=h.nextElementSibling,btc='',added='';
    while(el && !el.matches('h3')){
      const t=el.textContent;
      if(t.startsWith('Initial Holdings:')) btc=t.replace('Initial Holdings:','').trim();
      if(t.startsWith('Added:')) added=t.replace('Added:','').trim();
      el=el.nextElementSibling;
    }
    return {ticker:ticker.trim(),name,btc,added};
  });
}
function render(rows){
  tbody.innerHTML='';
  rows.forEach(r=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${r.ticker}</td><td>${r.name}</td><td>${r.btc}</td><td>${r.added}</td>`;
    tbody.appendChild(tr);
  });
}
async function load(){
  stamp.textContent='updating…';
  try{
    const html=await fetchHTML(sources[0]);
    render(parse(html));
    stamp.textContent='last update '+new Date().toLocaleString();
  }catch(e){
    stamp.textContent='fetch failed – retry ↻';
    console.error(e);
  }
}
