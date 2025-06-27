const proxies=[u=>`https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
               u=>`https://corsproxy.io/?${u}`,
               u=>`https://proxy.cors.sh/${u}`];
const stamp=document.getElementById('stamp');
const priceEl=document.getElementById('price');
const priceSrc='https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
document.getElementById('reload').onclick=load;
load(); setInterval(load,60e3);

async function fetchPrice(){
  for(const make of proxies){
    try{
      const r=await fetch(make(priceSrc),{headers:{'x-cors-api-key':'free'}});
      if(r.ok){
        const json=await r.json();
        return json.bitcoin.usd;
      }
    }catch(_){}
  }
  throw Error('price fetch failed');
}
async function load(){
  stamp.textContent='updating…';
  try{
    const price=await fetchPrice();
    priceEl.textContent='$'+price.toLocaleString();
    stamp.textContent='last update '+new Date().toLocaleString();
  }catch(e){
    stamp.textContent='fetch failed – retry ↻';
    console.error(e);
  }
}
