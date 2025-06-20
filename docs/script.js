const proxy='https://api.allorigins.win/raw?url=';
const url='https://bitcointreasuries.com/';     // fallback handled in code
const netUrl='https://bitcointreasuries.net/';
const tbody=document.getElementById('tbody');
const stamp=document.getElementById('stamp');

async function grab(src){
  const r=await fetch(proxy+encodeURIComponent(src));
  if(!r.ok) throw Error('bad fetch');
  return r.text();
}

function parse(html){
  const doc=new DOMParser().parseFromString(html,'text/html');
  return [...doc.querySelectorAll('tr')].filter(tr=>/new/i.test(tr.textContent));
}

function build(rows){
  tbody.innerHTML='';
  rows.forEach(tr=>{
    const tds=[...tr.querySelectorAll('td')].map(td=>td.textContent.trim());
    while(tds.length<4) tds.push('');
    const row=document.createElement('tr');
    row.innerHTML=`<td>${tds[0].replace(/new/i,'').trim()}</td>
                   <td>${tds[1]||''}</td>
                   <td>${tds[2]||''}</td>
                   <td>${tds[3]||''}</td>`;
    tbody.appendChild(row);
  });
}

async function load(){
  try{
    let html=await grab(url);
    let rows=parse(html);
    if(!rows.length){html=await grab(netUrl);rows=parse(html);}
    build(rows);
    stamp.textContent='Last update '+new Date().toLocaleString();
  }catch(e){
    stamp.textContent='Fetch error';
    console.error(e);
  }
}

document.getElementById('reload').onclick=load;
load();
setInterval(load,3600_000);
