const proxy='https://api.allorigins.win/raw?url=';
const target='https://bitcointreasuries.net/'; // .net is current data source
const body=document.getElementById('data');
const stamp=document.getElementById('stamp');
async function load(){
  try{
    const res=await fetch(proxy+encodeURIComponent(target));
    const html=await res.text();
    const doc=new DOMParser().parseFromString(html,'text/html');
    const rows=[...doc.querySelectorAll('tr')];
    body.innerHTML='';
    rows.forEach(r=>{
      const tds=[...r.querySelectorAll('td')];
      if(tds[0]&&/new/i.test(tds[0].textContent)){
        const [tickerCell,btcCell,usdCell]=tds;
        const tkr=tickerCell.textContent.replace(/new/i,'').trim();
        const org=tds[0].nextElementSibling.textContent.trim();
        const tr=document.createElement('tr');
        tr.innerHTML=`<td>${tkr}</td><td>${org}</td><td>${btcCell.textContent.trim()}</td><td>${usdCell.textContent.trim()}</td>`;
        body.appendChild(tr);
      }
    });
    stamp.textContent='Last update '+new Date().toLocaleString();
  }catch(e){stamp.textContent='Fetch error';console.error(e)}
}
load();
setInterval(load,3600_000);
document.getElementById('refresh').onclick=load;
