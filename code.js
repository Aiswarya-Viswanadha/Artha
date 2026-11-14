/* ===== storage.js ===== */
/* Storage layer + shared helpers. Data is table-shaped so a backend can replace Store later. */
const $=s=>document.querySelector(s),R={};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,9),ld=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'),today=()=>ld(new Date());
const sum=(a,k='amount')=>a.reduce((s,x)=>s+(+x[k]||0),0);
const fmt=n=>{const s=Store.db?.settings.cur||'₹',v=Math.abs(+n||0);return(n<0?'-':'')+s+v.toLocaleString(s=='₹'?'en-IN':'en-US',{maximumFractionDigits:0})};
const addM=(d,n)=>{const x=new Date(d);x.setMonth(x.getMonth()+n);return x.toISOString().slice(0,10)};
const addD=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x.toISOString().slice(0,10)};
const months=n=>Array.from({length:n},(_,i)=>addM(today().slice(0,8)+'01',i-n+1).slice(0,7));
const COL=['#245A43','#D9EF9E','#4F836B','#B2CF78','#7BA791','#EAF6C8','#173B2C','#8FB36A'];
const GI={'Emergency fund':'🛡️','Higher education':'🎓','Buying a house':'🏠','Buying a vehicle':'🚗',Retirement:'🌅',Vacation:'🧳','Starting a business':'💼',Concerts:'🎵',Shopping:'🛍️',Birthdays:'🎂',Anniversaries:'💐','Family outings':'👨‍👩‍👧','Adventure activities':'🧗',Picnic:'🧺','Weekend party':'🎉',Other:'✨'};
/* Themed hero card used at the top of every tab */
const hero=(l,b,s,x,y)=>`<div class="card hero"><span class="hl">${l}</span><div class="hb">${b}</div><p>${s}</p><div class="hbtn">${x}${y}</div></div>`;
const hb=(a,l,k)=>`<button class="btn ${k}" ${a}>${l}</button>`;
const pct=(a,b)=>b>0?Math.min(Math.round(a/b*100),100):0;
const pg=(p,c='')=>`<div class="pg ${c}" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><i style="width:${p}%"></i></div>`;
const bars=a=>a.length?`<div class="bars">${a.map(x=>`<div class="br"><span>${esc(x.l)}</span><div class="tr"><i style="width:${x.v/Math.max(...a.map(y=>y.v),1)*100}%;background:${x.c||'var(--teal)'}"></i></div><em>${fmt(x.v)}</em></div>`).join('')}</div>`:'<p class="empty">No data yet.</p>';
const CI={Food:'🍽️',Transportation:'🚗',Shopping:'🛍️',Rent:'🏠',Bills:'🧾',Entertainment:'🎬',Healthcare:'💊',Travel:'✈️',Education:'🎓',Other:'📦',Salary:'💼',Business:'🏢',Freelancing:'💻',Investments:'📈','Other income':'💰'};
const av=c=>`<span class="av" aria-hidden="true">${CI[c]||'💳'}</span>`;
const donut=(a,ctr='')=>{const t=sum(a,'v');if(!t)return'<p class="empty">No data yet.</p>';return`${ctr?`<div class="mute">Total</div><b style="font-size:1.3rem;color:var(--p-d)">${esc(ctr)}</b>`:''}<div class="split" role="img" aria-label="Breakdown chart">${a.map((x,i)=>`<i style="width:${x.v/t*100}%;background:${COL[i%8]}"></i>`).join('')}</div><div class="lg">${a.map((x,i)=>`<div><i style="background:${COL[i%8]}"></i>${esc(x.l)} ${Math.round(x.v/t*100)}%</div>`).join('')}</div>`};
const Store={db:null,
 init(){try{this.db=JSON.parse(localStorage.getItem('lifepath.v1'))}catch(e){}if(!this.db)this.db=demoData();const D=this.db;D.plans=D.plans||{};D.land=D.land||[];this.save()},
 save(){try{localStorage.setItem('lifepath.v1',JSON.stringify(this.db))}catch(e){toast('Could not save – storage unavailable')}},
 reset(){localStorage.removeItem('lifepath.v1');location.reload()}};
/* DEMO DATA – every record carries demo:1 so the UI can label it */
function demoData(){const t=(type,cat,amount,date,note='')=>({id:uid(),type,cat,amount,date,note,method:'UPI',demo:1}),tx=[];
 months(3).forEach((m,i)=>tx.push(t('income','Salary',85000,m+'-01','Monthly salary'),t('income','Freelancing',12000+i*3000,m+'-12'),t('expense','Rent',22000,m+'-03'),t('expense','Food',9000+i*800,m+'-10'),t('expense','Shopping',6000+i*1500,m+'-15'),t('expense','Entertainment',4000,m+'-18'),t('expense','Bills',5500,m+'-20')));
 const ts=addM(today(),2);
 return{settings:{name:'Demo User',cur:'₹'},tx,budgets:{Food:10000,Shopping:6000,Entertainment:5000,Bills:6000},read:[],
 schemes:[{id:uid(),demo:1,name:'Digital Gold SIP',provider:'Demo Jeweller',type:'Digital gold',amount:5000,months:12,freq:'Monthly',start:addM(today(),-3),expected:'Illustrative only – check scheme terms',value:0,paid:[1,2,3].map(i=>({date:addM(today(),-i),amount:5000}))}],
 watch:['TCS','INFY'],holdings:[{id:uid(),demo:1,sym:'TCS',qty:5,avg:3800,cur:4000}],
 trips:[{id:uid(),demo:1,dest:'Goa',start:ts,end:addD(ts,4),people:2,type:'Leisure',budget:{Transportation:8000,Accommodation:15000,Food:6000,Activities:4000,Shopping:2000,Miscellaneous:1000},notes:'Beach break',items:[],exps:[],done:false}],
 goals:[{id:uid(),demo:1,title:'Emergency fund',cat:'Emergency fund',target:300000,saved:120000,date:addM(today(),14),freq:'Monthly'}],
 exp:[{id:uid(),demo:1,name:'Friends get-together',kind:'Weekend party',target:8000,saved:3000,date:addM(today(),3),notes:'',done:false}],
 miles:[{id:uid(),demo:1,year:+today().slice(0,4)+1,title:'Emergency fund completed',done:false}]}}
function toast(m){const t=$('#toast');t.textContent=m;t.className='on';clearTimeout(toast.h);toast.h=setTimeout(()=>t.className='',2600)}
function openMsg(t,h,ok){const d=$('#dlg');d.innerHTML=`<div class="f"><h3>${esc(t)}</h3>${h}<div class="row"><button class="btn ghost" data-x>${ok?'Cancel':'Close'}</button>${ok?'<button class="btn danger" data-ok>Confirm</button>':''}</div></div>`;
 d.onclick=e=>{if(e.target.closest('[data-x]')||e.target==d)d.close();if(e.target.closest('[data-ok]')){d.close();ok()}};d.showModal()}
const confirmDel=(m,cb)=>openMsg('Delete this?',`<p>${esc(m)} This can't be undone.</p>`,cb);
/* Generic validated form dialog. fields: [{n,l,t,o,r}] r=required */
function openForm(title,fs,v,cb){const d=$('#dlg');
 d.innerHTML=`<form class="f" novalidate><h3>${esc(title)}</h3>${fs.map(f=>`<label>${f.l}${f.o?`<select name="${f.n}">${f.o.map(o=>`<option${o==v[f.n]?' selected':''}>${esc(o)}</option>`).join('')}</select>`:`<input name="${f.n}" type="${f.t||'text'}" value="${esc(v[f.n])}"${f.t=='number'?' min="0" step="any"':''}>`}</label>`).join('')}<p class="err" role="alert"></p><div class="row"><button type="button" class="btn ghost" data-x>Cancel</button><button class="btn">Save</button></div></form>`;
 const fm=d.querySelector('form');d.onclick=e=>{if(e.target.closest('[data-x]')||e.target==d)d.close()};
 fm.onsubmit=e=>{e.preventDefault();const o=Object.fromEntries(new FormData(fm)),er=fm.querySelector('.err');
  for(const f of fs){const s=(o[f.n]||'').trim();o[f.n]=s;if(f.r&&!s)return er.textContent=f.l+' is required.';
   if(f.t=='number'){if(s&&!(+s>=0))return er.textContent=f.l+' must be a valid number.';if(f.r&&!(+s>0))return er.textContent=f.l+' must be greater than 0.';o[f.n]=+s||0}}
  d.close();cb(o)};d.showModal()}

/* ===== navigation.js ===== */
/* View switching without page reloads. Each module registers R[viewId]. */
let cur='home';
function show(id){cur=id;document.body.dataset.view=id;document.querySelectorAll('main>section').forEach(s=>s.hidden=s.id!='v-'+id);
 document.querySelectorAll('[data-go]').forEach(b=>b.dataset.go==id?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current'));R[id]();scrollTo(0,0)}
const refresh=()=>{R[cur]();R.bell&&R.bell()};
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b)show(b.dataset.go)});

/* ===== notifications.js ===== */
/* Notifications are derived from data; read-state is stored in db.read */
function buildNotes(){const d=Store.db,n=[],t=today(),m=t.slice(0,7);
 d.schemes.forEach(s=>{const st=s.freq=='Quarterly'?3:1,c=Math.ceil(s.months/st);if(s.paid.length>=c){n.push({id:'ach'+s.id,i:'🏆',m:`Congratulations! "${s.name}" is complete. You stayed consistent.`});return}
  const nx=addM(s.start,s.paid.length*st);if(nx<t)n.push({id:'miss'+s.id+nx,i:'⏰',m:`A contribution to "${s.name}" was due ${nx}. Record it when you can – no stress!`});else if(nx<=addD(t,7))n.push({id:'up'+s.id+nx,i:'📅',m:`Contribution for "${s.name}" is due ${nx}.`})});
 Object.entries(d.budgets).forEach(([c,l])=>{const sp=sum(d.tx.filter(x=>x.type=='expense'&&x.cat==c&&x.date.startsWith(m)));if(l&&sp>=l*.8)n.push({id:'bud'+c+m+(sp>l),i:'💡',m:sp>l?`${c} is over budget by ${fmt(sp-l)} this month. A small adjustment could balance it out.`:`${c} has used ${pct(sp,l)}% of its budget.`})});
 d.trips.filter(v=>v.start>=t&&v.start<=addD(t,30)).forEach(v=>n.push({id:'trip'+v.id,i:'🌴',m:`${v.dest} starts ${v.start}. Almost time to enjoy!`}));
 d.goals.filter(g=>g.saved>=g.target*.5).forEach(g=>n.push({id:'goal'+g.id+(g.saved>=g.target),i:'🎯',m:g.saved>=g.target?`Goal achieved: ${g.title}! 🎉`:`"${g.title}" is over halfway – ${pct(g.saved,g.target)}% done.`}));
 const mt=d.tx.filter(x=>x.date.startsWith(m));n.push({id:'sum'+m,i:'📊',m:`${m} summary: income ${fmt(sum(mt.filter(x=>x.type=='income')))}, spent ${fmt(sum(mt.filter(x=>x.type=='expense')))}.`});return n}
R.bell=()=>{const u=buildNotes().filter(x=>!Store.db.read.includes(x.id)).length,b=$('#bell');b.hidden=!u;b.textContent=u};
R.notes=()=>{const ns=buildNotes(),r=Store.db.read;$('#v-notes').innerHTML=`<div class="row sb"><h2>Notifications</h2><button class="btn ghost sm" data-a="all">Mark all read</button></div><div class="card">${ns.map(x=>`<div class="li ${r.includes(x.id)?'':'unread'}"><div>${x.i} ${esc(x.m)}</div>${r.includes(x.id)?'':`<button class="btn ghost sm" data-a="read" data-id="${x.id}">Mark read</button>`}</div>`).join('')||'<p class="empty">You\'re all caught up!</p>'}</div>`};
$('#v-notes').onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const r=Store.db.read;if(b.dataset.a=='all')buildNotes().forEach(x=>r.includes(x.id)||r.push(x.id));else r.push(b.dataset.id);Store.save();refresh()};

/* ===== dashboard.js ===== */
/* Home: greeting, balance card, day calendar, quick actions, recent transactions, plan & goals */
let selD=today(),calY=+today().slice(0,4),calM=+today().slice(5,7),hideBal=false;
const QA=[['exp','💸','Expense'],['inc','💰','Income'],['gold','🪙','Gold'],['goal','🎯','Goal'],['trip','🌴','Trip']];
const qaBtns=()=>`<div class="qa">${QA.map(([k,i,l])=>`<button data-q="${k}"><span>${i}</span>${l}</button>`).join('')}</div>`;
const NEEDS=['Rent','Bills','Food','Transportation','Healthcare','Education'];
const dn=(s,o)=>new Date(+s.slice(0,4),+s.slice(5,7)-1,+s.slice(8,10)).toLocaleDateString('en-IN',o);
const rel=s=>s==today()?'Today':s==addD(today(),-1)?'Yesterday':dn(s,{day:'numeric',month:'short',year:'numeric'});
/* Date + day + year, custom calendar, and income / expenses / balance for the selected day */
const dayHTML=()=>{const tx=Store.db.tx,L=tx.filter(x=>x.date==selD),i=sum(L.filter(x=>x.type=='income')),e=sum(L.filter(x=>x.type=='expense')),t=today(),
 first=new Date(calY,calM-1,1).getDay(),dim=new Date(calY,calM,0).getDate(),pre=calY+'-'+String(calM).padStart(2,'0')+'-',has=new Set(tx.filter(x=>x.date.startsWith(pre)).map(x=>x.date));
 let cells='<span></span>'.repeat(first);
 for(let n=1;n<=dim;n++){const ds=pre+String(n).padStart(2,'0');cells+=`<button data-d="${ds}" class="${ds==selD?'sel':''} ${ds==t?'t':''} ${has.has(ds)?'h':''}" aria-label="${dn(ds,{day:'numeric',month:'long',year:'numeric'})}" aria-pressed="${ds==selD}">${n}</button>`}
 return`<div class="card"><div class="row sb"><div><div class="mute">${dn(selD,{weekday:'long'})}</div><h3 style="font-size:1.4rem;margin:0">${dn(selD,{day:'numeric',month:'long',year:'numeric'})}</h3></div>${selD!=t?'<button class="btn ghost sm" data-cal="today">Today</button>':''}</div>
 <div class="dst"><div><small>Income</small><b class="pos">+${fmt(i)}</b></div><div><small>Expenses</small><b>-${fmt(e)}</b></div><div><small>Balance</small><b>${fmt(i-e)}</b></div></div>
 ${L.length?L.map(x=>`<div class="li"><div class="row" style="flex-wrap:nowrap"><span class="gt ${x.type=='income'?'in':''}">${CI[x.cat]||'💳'}</span><div><b>${esc(x.cat)}</b>${x.note?`<div class="mute">${esc(x.note)}</div>`:''}</div></div><b class="${x.type=='income'?'pos':'neg'}">${x.type=='income'?'+':'-'}${fmt(x.amount)}</b></div>`).join(''):'<p class="mute" style="margin:12px 0 0">No income or expenses on this day.</p>'}
 <div class="row sb" style="margin:16px 0 8px"><b>${dn(pre+'01',{month:'long',year:'numeric'})}</b><span class="row"><button class="btn ghost sm" data-cal="-1" aria-label="Previous month">‹</button><button class="btn ghost sm" data-cal="1" aria-label="Next month">›</button></span></div>
 <div class="cal">${'SMTWTFS'.split('').map(x=>`<b>${x}</b>`).join('')}${cells}</div></div>`};
const refreshDay=()=>{const e=$('#daybox');if(e)e.innerHTML=dayHTML()};
R.home=()=>{const d=Store.db,tx=d.tx,m=today().slice(0,7),lm=months(2)[0],ex=k=>tx.filter(t=>t.type=='expense'&&t.date.startsWith(k)),
 mi=sum(tx.filter(t=>t.type=='income'&&t.date.startsWith(m))),me=sum(ex(m)),lme=sum(ex(lm)),nd=sum(ex(m).filter(t=>NEEDS.includes(t.cat))),wt=me-nd,
 bal=sum(tx.filter(t=>t.type=='income'))-sum(tx.filter(t=>t.type=='expense')),net=mi-me,cats={};ex(m).forEach(t=>cats[t.cat]=(cats[t.cat]||0)+ +t.amount);
 const hasDemo=[tx,d.schemes,d.trips,d.goals].some(a=>a.some(x=>x.demo)),t=today(),inv=investedTotal(),h=new Date().getHours(),hid=v=>hideBal?'••••••':v;
 const df=lme?Math.round((lme-me)/lme*100):0,tip=!lme?'Add a few more weeks of entries to see how this month compares.':df>=0?`You spent ${df}% less than last month. Nice – small choices add up.`:`You've spent ${-df}% more than last month. Worth a glance, no pressure – enjoying life is part of the plan.`;
 const gl=[...d.goals.map(g=>({t:g.title,c:g.cat,s:g.saved,g:g.target})),...d.exp.map(g=>({t:g.name,c:g.kind,s:g.saved,g:g.target,p:1}))].filter(x=>x.s<x.g).slice(0,3);
 const next=d.schemes.filter(s=>s.paid.length<count(s)).map(s=>({n:s.name,d:addM(s.start,s.paid.length*step(s)),a:s.amount}));
 $('#v-home').innerHTML=`${hasDemo?'<div class="demo">ℹ️ Showing <b>demo data</b> so you can explore. Clear it any time in Profile.</div>':''}
 <div class="greet"><small>Good ${h<12?'Morning':h<17?'Afternoon':'Evening'},</small><h2>${esc(d.settings.name)} 👋</h2></div>
 <div class="bal"><div><span class="hl">Total Balance</span><div class="hb">${hid(fmt(bal))} <button class="eye" data-eye aria-label="${hideBal?'Show':'Hide'} balance">${hideBal?'🙈':'👁️'}</button></div><div class="up"><i>${net>=0?'▲':'▼'}</i>${hid((net>=0?'+':'-')+fmt(Math.abs(net)))} (${mi?Math.abs(net/mi*100).toFixed(1):0}%) this month</div></div><div class="wal"><b>Artha</b><small>Live Today. Grow Tomorrow.</small></div></div>
 <div id="daybox" style="margin-top:16px">${dayHTML()}</div>
 <div class="qa" style="margin-top:16px"><button data-q="exp"><span>➖</span>Expense</button><button data-q="inc"><span>➕</span>Income</button><button data-go="grow"><span>📈</span>Invest</button><button data-more><span>⋯</span>More</button></div>
 <div class="sh"><h3>Recent Transactions</h3><button class="lnk" data-go="manage">See All →</button></div>
 <div class="card">${[...tx].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5).map(x=>`<div class="li"><div class="row" style="flex-wrap:nowrap"><span class="gt ${x.type=='income'?'in':''}">${CI[x.cat]||'💳'}</span><div><b>${esc(x.cat)}</b><div class="mute">${rel(x.date)}${x.note?' · '+esc(x.note):''}</div></div></div><b class="${x.type=='income'?'pos':'neg'}">${x.type=='income'?'+':'-'} ${fmt(x.amount)}</b></div>`).join('')||'<p class="empty">No transactions yet.</p>'}</div>
 <div class="sh"><h3>Your spending plan</h3><span class="mute">${m}</span></div>
 <div class="card"><div class="row sb"><span><b style="font-size:1.5rem;color:var(--navy)">${fmt(me)}</b> <span class="mute">of ${fmt(mi)} income spent</span></span><b class="pc">${pct(me,mi)}%</b></div><div class="split" role="img" aria-label="Needs and wants split"><i style="width:${pct(nd,mi)}%"></i><i class="w" style="width:${pct(wt,mi)}%"></i></div><div class="dots"><span><i style="background:var(--p)"></i>Needs ${fmt(nd)}</span><span><i style="background:var(--s-d)"></i>Wants ${fmt(wt)}</span></div></div>
 <div class="tipc"><span>💡</span><div><b>Small choices, bigger savings</b><p class="mute">${tip}</p></div></div>
 <div class="sh"><h3>Growing your future</h3><button class="lnk" data-go="plan">View all</button></div>
 <div class="grid">${gl.map(x=>`<div class="card"><div class="row" style="flex-wrap:nowrap"><span class="gt ${x.p?'in':''}">${GI[x.c]||'🎯'}</span><div style="flex:1;min-width:0"><b>${esc(x.t)}</b><div class="mute">${fmt(x.s)} / ${fmt(x.g)}</div></div><b class="pc">${pct(x.s,x.g)}%</b></div><div style="margin-top:12px">${pg(pct(x.s,x.g))}</div></div>`).join('')||'<div class="card empty">No goals yet – start one in Plan. 🌱</div>'}</div>
 <div class="sh"><h3>Where it went</h3><button class="lnk" data-go="manage">Manage</button></div>
 <div class="grid g2"><div class="card">${donut(Object.entries(cats).map(([l,v])=>({l,v})),fmt(me))}</div><div class="card"><h3>Investments</h3><b style="font-size:1.6rem;color:var(--navy)">${fmt(inv)}</b><p class="mute">Recorded value ${fmt(portfolioValue())}</p>${donut([{l:'Gold',v:sum(d.schemes.flatMap(s=>s.paid))},{l:'Stocks',v:d.holdings.reduce((a,h)=>a+h.qty*h.avg,0)},{l:'Land',v:sum(d.land,'cost')}])}</div>
 <div class="card"><h3>Upcoming</h3>${next.map(x=>`<div class="li"><span>🪙 ${esc(x.n)}</span><span class="mute">${x.d} · ${fmt(x.a)}</span></div>`).join('')}${d.trips.filter(v=>v.end>=t).map(v=>`<div class="li"><span>🌴 ${esc(v.dest)}</span><span class="mute">${v.start}</span></div>`).join('')||(next.length?'':'<p class="empty">Nothing upcoming – dream a little!</p>')}</div></div>`};
$('#v-home').onclick=e=>{const b=e.target.closest('[data-d]');if(b){selD=b.dataset.d;return refreshDay()}
 const c=e.target.closest('[data-cal]');if(c){const v=c.dataset.cal;if(v=='today'){selD=today();calY=+selD.slice(0,4);calM=+selD.slice(5,7)}else{calM+=+v;if(calM<1){calM=12;calY--}if(calM>12){calM=1;calY++}}return refreshDay()}
 if(e.target.closest('[data-eye]')){hideBal=!hideBal;R.home()}};

/* ===== transactions.js ===== */
/* Manage: income, expenses, budgets, analytics */
const INC=['Salary','Business','Freelancing','Investments','Other income'],EXP=['Food','Transportation','Shopping','Rent','Bills','Entertainment','Healthcare','Travel','Education','Other'];
let mf={q:'',t:'all'};
const txFields=type=>[{n:'cat',l:'Category',o:type=='income'?INC:EXP},{n:'amount',l:'Amount',t:'number',r:1},...(type=='expense'?[{n:'method',l:'Payment method',o:['UPI','Card','Cash','Bank transfer']}]:[]),{n:'date',l:'Date',t:'date',r:1},{n:'note',l:'Notes'}];
function txForm(type,rec){openForm((rec?'Edit ':'Add ')+type,txFields(type),rec||{date:today()},o=>{if(rec)Object.assign(rec,o,{demo:0});else Store.db.tx.push({id:uid(),type,...o});Store.save();toast('Saved ✓');refresh()})}
/* Manage: choose day / month / year -> enter income -> suggested split (editable) + budgets + history */
let mper='';const PL={day:['Day','☀️','today'],month:['Month','🗓️','this month'],year:['Year','🌱','this year']};
const pKey=p=>{const t=today();return p=='day'?t:p=='month'?t.slice(0,7):t.slice(0,4)};
const BUCK=[['n','Needs','Essentials you can\'t skip',[['Rent',45],['Food',25],['Bills',15],['Transportation',10],['Healthcare',5]]],['w','Wants','Things that make life fun',[['Shopping',40],['Entertainment',35],['Travel',25]]],['s','Savings','Your future self says thanks',[['Emergency fund',40],['Investments',40],['Goals',20]]]];
const BI={'Emergency fund':'🛡️',Goals:'🎯'};
R.manage=()=>{const d=Store.db,m=today().slice(0,7),sp={},mx=d.tx.filter(t=>t.type=='expense'&&t.date.startsWith(m));mx.forEach(t=>sp[t.cat]=(sp[t.cat]||0)+ +t.amount);
 const tot=sum(mx),inc=sum(d.tx.filter(t=>t.type=='income'&&t.date.startsWith(m))),q=mf.q.toLowerCase();let top='';
 if(!mper)top=`<div class="greet"><small>Manage</small><h2>Plan your money</h2></div><div class="card"><h3>Is this plan for a day, a month or a year?</h3><p class="mute">Pick one, tell us your income, and we'll show how to split it.</p><div class="opts o3">${Object.entries(PL).map(([k,v])=>`<button class="opt" data-p="${k}"><span>${v[1]}</span><b>${v[0]}</b></button>`).join('')}</div></div>`;
 else{const pk=pKey(mper),pl=d.plans[mper+':'+pk],L=PL[mper],tabs=`<div class="tabs">${Object.entries(PL).map(([k,v])=>`<button class="${k==mper?'on':''}" data-p="${k}">${v[0]}</button>`).join('')}</div>`;
  if(!pl){const act=sum(d.tx.filter(x=>x.type=='income'&&x.date.startsWith(pk)));top=`${tabs}<div class="card"><h3>How much income do you have ${L[2]}?</h3>${act?`<p class="mute">Recorded so far: ${fmt(act)}</p>`:''}<label>Income<input id="mi" type="number" min="0" inputmode="decimal" placeholder="Enter amount" value="${act||''}"></label><button class="btn" data-a="mkplan">Show how to manage it</button></div>`}
  else{const px=d.tx.filter(x=>x.type=='expense'&&x.date.startsWith(pk)),spent=sum(px),nd=sum(px.filter(x=>NEEDS.includes(x.cat))),amt={n:pl.income*pl.n/100,w:pl.income*pl.w/100,s:pl.income*pl.s/100},act={n:nd,w:spent-nd,s:Math.max(pl.income-spent,0)};
   top=`${tabs}${hero('Income '+L[2],fmt(pl.income),'Spent '+fmt(spent)+' · left '+fmt(pl.income-spent),hb('data-a="editplan"','✏️ Edit plan','lime'),hb('data-p=""','Change period','glass'))}
   <div class="grid g3" style="margin-top:16px">${BUCK.map(([k,n,s,items])=>`<div class="card"><div class="row sb"><h3>${n}</h3><b class="pc">${pl[k]}%</b></div><b style="font-size:1.4rem;color:var(--navy)">${fmt(amt[k])}</b><p class="mute">${s}</p>${pg(pct(act[k],amt[k]),k!='s'&&act[k]>amt[k]?'bad':'')}<p class="mute">${k=='s'?'Left after spending':'Spent so far'}: ${fmt(act[k])}</p>${items.map(([c,w])=>`<div class="li"><span>${CI[c]||BI[c]||'📈'} ${c}</span><b>${fmt(amt[k]*w/100)}</b></div>`).join('')}</div>`).join('')}</div>`}}
 const list=[...d.tx].filter(t=>(mf.t=='all'||t.type==mf.t)&&(t.cat+t.note).toLowerCase().includes(q)).sort((a,b)=>b.date.localeCompare(a.date)),
 bl=Object.entries(d.budgets),al=bl.filter(([c,l])=>(sp[c]||0)>=l*.8).map(([c,l])=>`<div class="alert ${sp[c]>l?'':'w'}">${sp[c]>l?`${c} is ${fmt(sp[c]-l)} over budget this month.`:`${c} has used ${pct(sp[c],l)}% of its budget.`}</div>`).join(''),
 tp=Object.entries(sp).sort((a,b)=>b[1]-a[1])[0],sg=tp&&tot&&tp[1]/tot>.4?`${tp[0]} is ${Math.round(tp[1]/tot*100)}% of this month's spending. If that's what matters to you, great – otherwise a small cap could free up room for savings.`:'Your spending looks nicely spread out this month.';
 $('#v-manage').innerHTML=`${top}
 <div class="grid g2" style="margin-top:16px"><div class="card"><div class="row sb"><h3>Budgets (this month)</h3><button class="btn ghost sm" data-a="bud">Set budget</button></div>${al}${bl.map(([c,l])=>`<div style="margin-bottom:8px"><div class="row sb"><span>${esc(c)}</span><span class="mute">${fmt(sp[c]||0)} / ${fmt(l)} · left ${fmt(Math.max(l-(sp[c]||0),0))}</span></div>${pg(pct(sp[c]||0,l),(sp[c]||0)>l?'bad':(sp[c]||0)>=l*.8?'warn':'')}</div>`).join('')||'<p class="empty">No budgets yet – set one to track spending.</p>'}</div>
 <div class="card"><h3>Spending analytics</h3><p class="mute">Savings this month: ${inc?Math.round((inc-tot)/inc*100):0}% of income</p>${donut(Object.entries(sp).map(([l,v])=>({l,v})),fmt(tot))}<div class="tip" style="margin-top:8px">💡 ${sg}</div></div></div>
 <div class="card" style="margin-top:16px"><h3>History</h3><div class="row" style="margin-bottom:8px"><input id="q" placeholder="Search…" aria-label="Search transactions" value="${esc(mf.q)}" style="flex:1;min-width:140px"><select id="ft" aria-label="Filter type" style="width:auto"><option value="all">All</option><option value="income"${mf.t=='income'?' selected':''}>Income</option><option value="expense"${mf.t=='expense'?' selected':''}>Expenses</option></select></div>
 ${list.map(x=>`<div class="li"><div>${av(x.cat)}<b>${esc(x.cat)}</b> ${x.demo?'<span class="tag2">demo</span>':''}<div class="mute">${x.date}${x.method&&x.type=='expense'?' · '+esc(x.method):''}${x.note?' · '+esc(x.note):''}</div></div><div class="row"><b class="${x.type=='income'?'pos':'neg'}">${fmt(x.amount)}</b><button class="btn ghost sm" data-a="edit" data-id="${x.id}" aria-label="Edit">✏️</button><button class="btn ghost sm" data-a="del" data-id="${x.id}" aria-label="Delete">🗑️</button></div></div>`).join('')||'<p class="empty">No transactions found. Add one with the + button!</p>'}</div>`;
 $('#q').oninput=e=>{mf.q=e.target.value;const p=e.target.selectionStart;R.manage();const n=$('#q');n.focus();n.setSelectionRange(p,p)};$('#ft').onchange=e=>{mf.t=e.target.value;R.manage()}};
$('#v-manage').onclick=e=>{const p=e.target.closest('[data-p]');if(p){mper=p.dataset.p;return R.manage()}
 const b=e.target.closest('[data-a]');if(!b)return;const d=Store.db,x=d.tx.find(t=>t.id==b.dataset.id),a=b.dataset.a,key=mper+':'+pKey(mper);
 if(a=='mkplan'){const v=+$('#mi').value;if(!(v>0))return toast('Please enter your income');d.plans[key]={income:v,n:50,w:30,s:20};Store.save();R.manage()}
 if(a=='editplan'){const pl=d.plans[key];openForm('Edit plan',[{n:'income',l:'Income',t:'number',r:1},{n:'n',l:'Needs %',t:'number',r:1},{n:'w',l:'Wants %',t:'number',r:1}],pl,o=>{if(o.n+o.w>100)return toast('Needs + Wants cannot be more than 100%');Object.assign(pl,o,{s:100-o.n-o.w});Store.save();toast('Plan updated ✓');refresh()})}
 if(a=='edit')txForm(x.type,x);
 if(a=='del')confirmDel('Delete this transaction?',()=>{d.tx=d.tx.filter(t=>t!=x);Store.save();toast('Deleted');refresh()});
 if(a=='bud')openForm('Set category budget',[{n:'cat',l:'Category',o:EXP},{n:'amount',l:'Monthly limit',t:'number',r:1}],{},o=>{d.budgets[o.cat]=o.amount;Store.save();toast('Budget saved');refresh()})};


/* ===== investments.js ===== */
/* Grow: tabs + gold schemes + portfolio. Stocks/FD live in their own files. */
let gt='';
const portfolioValue=()=>Store.db.holdings.reduce((a,h)=>a+h.qty*h.cur,0)+sum(Store.db.schemes.map(s=>({v:s.value||sum(s.paid)})),'v')+sum(Store.db.land,'value');
const investedTotal=()=>sum(Store.db.schemes.flatMap(s=>s.paid))+Store.db.holdings.reduce((a,h)=>a+h.qty*h.avg,0)+sum(Store.db.land,'cost');
const step=s=>s.freq=='Quarterly'?3:1,count=s=>Math.ceil(s.months/step(s));
/* Invest: ask what to invest in (Scheme / Shares / Land / FD), then open that tool */
const IO=[['gold','🪙','Scheme','Gold & savings schemes'],['stocks','📈','Shares','Stocks, watchlist & holdings'],['land','🏞️','Land','Plots & property you own'],['fd','🏦','FD','Fixed deposit calculator']];
R.grow=()=>{$('#v-grow').innerHTML=gt?`<button class="btn ghost" data-t="">← Choose another</button><div id="gb" style="margin-top:16px"></div>`:`<div class="greet"><small>Invest</small><h2>What do you want to invest in?</h2></div>${hero('Total invested',fmt(investedTotal()),'Recorded value '+fmt(portfolioValue())+' · values you enter yourself.','','')}<div class="opts" style="margin-top:16px">${IO.map(([k,i,n,s])=>`<button class="opt" data-t="${k}"><span>${i}</span><b>${n}</b><small class="mute">${s}</small></button>`).join('')}</div>`;if(gt)R[gt]($('#gb'))};
/* Land tracker */
const LF=[{n:'name',l:'Plot / property name',r:1},{n:'loc',l:'Location'},{n:'area',l:'Area (sq ft)',t:'number'},{n:'cost',l:'Purchase price',t:'number',r:1},{n:'date',l:'Purchase date',t:'date',r:1},{n:'value',l:'Current value (your estimate)',t:'number'}];
R.land=el=>{const L=Store.db.land,c=sum(L,'cost'),cv=L.reduce((a,x)=>a+(+x.value||+x.cost),0);
 el.innerHTML=`<div class="row sb"><h3>🏞️ Land investments</h3><button class="btn" data-a="lnew">+ Add land</button></div><p class="mute">Record plots you own. Values are your own estimates, not verified.</p>
 <div class="grid g3" style="margin:16px 0"><div class="card stat"><span class="mute">Invested</span><b>${fmt(c)}</b></div><div class="card stat"><span class="mute">Estimated value</span><b>${fmt(cv)}</b></div><div class="card stat"><span class="mute">Gain</span><b class="${cv>=c?'pos':'neg'}">${fmt(cv-c)}</b></div></div>
 ${L.map(x=>`<div class="card" style="margin-top:8px"><div class="row sb"><div><b>${esc(x.name)}</b><div class="mute">${esc(x.loc)}${x.area?' · '+x.area+' sq ft':''} · bought ${x.date}</div></div><b>${fmt(x.value||x.cost)}</b></div><p class="mute">Paid ${fmt(x.cost)}</p><div class="row"><button class="btn ghost sm" data-a="ledit" data-id="${x.id}">Edit</button><button class="btn ghost sm" data-a="ldel" data-id="${x.id}">Delete</button></div></div>`).join('')||'<div class="card empty">No land recorded yet. Tap “Add land” to start.</div>'}`};
$('#v-grow').addEventListener('click',e=>{if(gt!='land')return;const b=e.target.closest('[data-a]');if(!b)return;const d=Store.db,x=d.land.find(l=>l.id==b.dataset.id),a=b.dataset.a,done=()=>{Store.save();R.land($('#gb'))};
 if(a=='lnew')openForm('Add land',LF,{date:today()},o=>{d.land.push({id:uid(),...o});done()});
 if(a=='ledit')openForm('Edit land',LF,x,o=>{Object.assign(x,o);done()});
 if(a=='ldel')confirmDel('Delete this land record?',()=>{d.land=d.land.filter(l=>l!=x);done()})});
R.gold=el=>{const s=Store.db.schemes;el.innerHTML=`<div class="row sb"><h3>Gold investment schemes</h3><button class="btn" data-a="new">+ New scheme</button></div><p class="mute">You're recording your own contributions here. No real payments are processed.</p>${s.map(x=>{const n=x.paid.length,c=count(x),done=n>=c,tot=sum(x.paid);return`<div class="card" style="margin-top:16px"><div class="row sb"><h3>${esc(x.name)} ${x.demo?'<span class="tag2">demo</span>':''}</h3><span class="tag2">${esc(x.type)}</span></div><p class="mute">${esc(x.provider)} · ${x.freq} ${fmt(x.amount)} · ${x.months} months · matures ${addM(x.start,x.months)}</p>${pg(pct(n,c))}<p class="mute">${n}/${c} contributions · invested ${fmt(tot)} · remaining ${c-n} (${fmt((c-n)*x.amount)})${done?'':' · next due '+addM(x.start,n*step(x))}</p><p class="mute">Expected benefits: ${esc(x.expected||'as per scheme terms – not guaranteed')}</p><div class="row">${done?`<button class="btn" data-a="ach" data-id="${x.id}">🏆 View achievement</button>`:`<button class="btn" data-a="pay" data-id="${x.id}">Record contribution</button>`}<button class="btn ghost" data-a="edit" data-id="${x.id}">Edit</button><button class="btn ghost" data-a="del" data-id="${x.id}">Delete</button></div></div>`}).join('')||'<div class="card empty">No schemes yet. Start one to build your gold habit. ✨</div>'}`};
const gf=[{n:'name',l:'Scheme name',r:1},{n:'provider',l:'Provider / jeweller',r:1},{n:'type',l:'Investment type',o:['Digital gold','Gold savings scheme','Gold accumulation plan','Jewellery purchase scheme','Other']},{n:'amount',l:'Contribution amount',t:'number',r:1},{n:'freq',l:'Frequency',o:['Monthly','Quarterly']},{n:'months',l:'Duration (months)',t:'number',r:1},{n:'start',l:'Starting date',t:'date',r:1},{n:'expected',l:'Expected returns / benefits (as per terms)'},{n:'value',l:'Final recorded value (optional)',t:'number'}];
function portTab(el){const d=Store.db,g=sum(d.schemes.flatMap(s=>s.paid)),inv=d.holdings.reduce((a,h)=>a+h.qty*h.avg,0),cv=portfolioValue(),all=g+inv;
 el.innerHTML=`<div class="grid g3"><div class="card stat"><span class="mute">Invested</span><b>${fmt(all)}</b></div><div class="card stat"><span class="mute">Recorded value</span><b>${fmt(cv)}</b></div><div class="card stat"><span class="mute">Returns</span><b class="${cv>=all?'pos':'neg'}">${fmt(cv-all)}</b></div></div><p class="mute">Values are <b>user-entered</b>, not externally verified.</p><div class="grid g2"><div class="card"><h3>Allocation</h3>${donut([{l:'Gold',v:g},{l:'Stocks',v:inv}])}</div><div class="card"><h3>History</h3>${d.schemes.flatMap(s=>s.paid.map(p=>({...p,n:s.name}))).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,8).map(p=>`<div class="li"><span>${esc(p.n)} <span class="mute">${p.date}</span></span><b>${fmt(p.amount)}</b></div>`).join('')||'<p class="empty">No history yet.</p>'}</div></div>`}
R.port=portTab;
$('#v-grow').onclick=e=>{const t=e.target.closest('[data-t]');if(t){gt=t.dataset.t;return R.grow()}const b=e.target.closest('[data-a]');if(!b)return;if(b.closest('#gb')&&gt!='gold'&&gt!='port')return;
 const d=Store.db,x=d.schemes.find(s=>s.id==b.dataset.id),a=b.dataset.a;
 if(a=='new'||a=='edit')openForm(x?'Edit scheme':'New gold scheme',gf,x||{start:today()},o=>{if(o.months<1)return toast('Duration must be at least 1 month');if(x)Object.assign(x,o,{demo:0});else d.schemes.push({id:uid(),...o,paid:[]});Store.save();refresh()});
 if(a=='del')confirmDel('Delete this scheme?',()=>{d.schemes=d.schemes.filter(s=>s!=x);Store.save();refresh()});
 if(a=='pay'){x.paid.push({date:today(),amount:x.amount});Store.save();const fin=x.paid.length>=count(x);openMsg(fin?'🎉 Scheme complete!':'Contribution recorded!',`<p>${fin?'You completed every contribution. Wonderful consistency!':'Every small step brings you closer to your financial goals.'}</p><p class="mute">Demo note: this only records your entry – no payment was made.</p>`);refresh()}
 if(a=='ach')openMsg('🏆 Achievement unlocked',`<p>Total contributed: <b>${fmt(sum(x.paid))}</b></p><p>Final recorded value: <b>${x.value?fmt(x.value):'not entered – use Edit'}</b></p><p>Duration: ${x.months} months</p><p>Completed: ${x.paid[x.paid.length-1].date}</p><p>Benefits: ${esc(x.expected||'per scheme terms')}</p>`)};

/* ===== stocks.js ===== */
/* Stocks – DEMO DATA ONLY. Replace fetchQuotes() with a real market-data API call. */
const DEMO_STOCKS=[['RELIANCE','Reliance Industries',2900,0.8],['TCS','Tata Consultancy',4000,-0.4],['INFY','Infosys',1650,1.2],['HDFCBANK','HDFC Bank',1700,-1.1],['ICICIBANK','ICICI Bank',1250,0.5],['ITC','ITC Ltd',460,-0.2],['SBIN','State Bank of India',820,2.1],['WIPRO','Wipro',540,-1.8]].map(([s,n,p,c])=>({s,n,p,c}));
const DEMO_INDEX=[{n:'NIFTY 50',p:24500,c:0.4},{n:'SENSEX',p:80500,c:0.3}];
async function fetchQuotes(){return new Promise(r=>setTimeout(()=>r({source:'demo',stocks:DEMO_STOCKS,index:DEMO_INDEX}),300))}
let sq='',sel=null;
R.stocks=async el=>{el.innerHTML='<p class="empty">Loading market data…</p>';let q;try{q=await fetchQuotes()}catch(e){el.innerHTML='<div class="alert">Could not load market data. Please try again.</div>';return}
 const d=Store.db,L=(x)=>`<div class="li"><div><b>${x.s}</b> <span class="mute">${esc(x.n)}</span></div><div class="row"><span>${fmt(x.p)} <b class="${x.c>=0?'pos':'neg'}">${x.c>=0?'+':''}${x.c}%</b></span><button class="btn ghost sm" data-a="view" data-id="${x.s}">Details</button><button class="btn ghost sm" data-a="wl" data-id="${x.s}" aria-label="Toggle watchlist">${d.watch.includes(x.s)?'★':'☆'}</button></div></div>`;
 const srt=[...q.stocks].sort((a,b)=>b.c-a.c),s=sel&&q.stocks.find(x=>x.s==sel),f=q.stocks.filter(x=>(x.s+x.n).toLowerCase().includes(sq.toLowerCase()));
 el.innerHTML=`<div class="demo">📌 <b>Demo data</b> – not live or delayed market prices. Connect a market-data API in <code>fetchQuotes()</code>.</div><div class="grid g2">${q.index.map(i=>`<div class="card stat"><span class="mute">${i.n} <span class="tag2">demo</span></span><b>${i.p.toLocaleString('en-IN')}</b><span class="${i.c>=0?'pos':'neg'}">${i.c>=0?'▲':'▼'} ${i.c}%</span></div>`).join('')}</div>
 ${s?`<div class="card" style="margin-top:16px"><h3>${s.s} – ${esc(s.n)}</h3><svg class="spark" viewBox="0 0 100 40" preserveAspectRatio="none" role="img" aria-label="Demo price chart"><polyline points="${Array.from({length:20},(_,i)=>`${i*5.2},${20-Math.sin(i*.7+s.p)*8-i*s.c*.1}`).join(' ')}"/></svg><p class="mute">Illustrative chart (demo).</p><button class="btn" data-a="hold" data-id="${s.s}">Record my holding</button></div>`:''}
 <div class="grid g2" style="margin-top:16px"><div class="card"><h3>Top gainers</h3>${srt.slice(0,3).map(L).join('')}</div><div class="card"><h3>Top losers</h3>${srt.slice(-3).reverse().map(L).join('')}</div></div>
 <div class="card" style="margin-top:16px"><h3>Search</h3><input id="sq" aria-label="Search stocks" placeholder="Search symbol or name" value="${esc(sq)}">${sq?f.map(L).join('')||'<p class="empty">No matches.</p>':''}</div>
 <div class="grid g2" style="margin-top:16px"><div class="card"><h3>Watchlist</h3>${q.stocks.filter(x=>d.watch.includes(x.s)).map(L).join('')||'<p class="empty">Star a stock to watch it.</p>'}</div>
 <div class="card"><h3>My holdings <span class="tag2">user-entered</span></h3>${d.holdings.map(h=>`<div class="li"><div><b>${h.sym}</b> ×${h.qty}<div class="mute">avg ${fmt(h.avg)} · now ${fmt(h.cur)}</div></div><div class="row"><b class="${h.cur>=h.avg?'pos':'neg'}">${fmt((h.cur-h.avg)*h.qty)}</b><button class="btn ghost sm" data-a="hdel" data-id="${h.id}" aria-label="Remove">🗑️</button></div></div>`).join('')||'<p class="empty">No holdings recorded.</p>'}</div></div>`;
 $('#sq').oninput=e=>{sq=e.target.value;const p=e.target.selectionStart;R.stocks(el).then(()=>{const n=$('#sq');n.focus();n.setSelectionRange(p,p)})};el._q=q};
$('#v-grow').addEventListener('click',e=>{if(gt!='stocks')return;const b=e.target.closest('[data-a]');if(!b)return;const d=Store.db,a=b.dataset.a,id=b.dataset.id;
 if(a=='view'){sel=id;R.stocks($('#gb'))}
 if(a=='wl'){d.watch=d.watch.includes(id)?d.watch.filter(w=>w!=id):[...d.watch,id];Store.save();R.stocks($('#gb'))}
 if(a=='hold'){const s=DEMO_STOCKS.find(x=>x.s==id);openForm('Record holding – '+id,[{n:'qty',l:'Quantity',t:'number',r:1},{n:'avg',l:'Average buy price',t:'number',r:1},{n:'cur',l:'Current price (your entry)',t:'number',r:1}],{cur:s.p},o=>{d.holdings.push({id:uid(),sym:id,...o});Store.save();toast('Holding recorded');R.stocks($('#gb'))})}
 if(a=='hdel')confirmDel('Remove this holding?',()=>{d.holdings=d.holdings.filter(h=>h.id!=id);Store.save();R.stocks($('#gb'))})});

/* ===== fd-calculator.js ===== */
/* FD calculator. Bank rates are ILLUSTRATIVE, not current offers. */
const FD_AS_OF='illustrative sample – verify with the bank',BANKS={'Bank A (sample)':7.0,'Bank B (sample)':6.75,'Bank C (sample)':7.25,'Custom':7.0};
function fdCalc(P,r,yrs,n,payout){const i=r/100;if(payout=='Cumulative'){const A=P*Math.pow(1+i/n,n*yrs);return{A,I:A-P}}const per=payout=='Monthly payout'?12:4,pI=P*i/per;return{A:P,I:pI*per*yrs,pI,per}}
R.fd=el=>{el.innerHTML=`<div class="grid g2"><div class="card"><h3>FD calculator</h3><label>Amount<input id="fp" type="number" min="1" value="100000"></label><label>Bank<select id="fb">${Object.keys(BANKS).map(b=>`<option>${b}</option>`).join('')}</select></label><label>Interest rate (% p.a.)<input id="fr" type="number" min="0.1" step="0.05" value="7"></label><label>Duration (years)<input id="fy" type="number" min="0.1" step="0.25" value="3"></label><label>Compounding<select id="fc"><option value="4">Quarterly</option><option value="12">Monthly</option><option value="2">Half-yearly</option><option value="1">Yearly</option></select></label><label>Payout<select id="fo"><option>Cumulative</option><option>Monthly payout</option><option>Quarterly payout</option></select></label></div>
 <div class="card" id="fres"></div></div><div class="card" style="margin-top:16px"><h3>Bank comparison <span class="tag2">${FD_AS_OF}</span></h3><div id="fcmp"></div></div>`;
 const run=()=>{const P=+$('#fp').value,r=+$('#fr').value,y=+$('#fy').value,n=+$('#fc').value,o=$('#fo').value;
  if(!(P>0&&r>0&&y>0)){$('#fres').innerHTML='<div class="alert">Enter an amount, rate and duration greater than 0.</div>';return}
  const c=fdCalc(P,r,y,n,o);$('#fres').innerHTML=`<h3>Estimate</h3><div class="li"><span>Principal</span><b>${fmt(P)}</b></div><div class="li"><span>Estimated interest</span><b class="pos">${fmt(c.I)}</b></div><div class="li"><span>Maturity amount</span><b>${fmt(c.A+(c.pI?c.I:0))}</b></div><div class="li"><span>Duration</span><span>${y} yr</span></div>${c.pI?`<div class="li"><span>${o}</span><b>${fmt(c.pI)}</b></div>`:''}${bars([{l:'Principal',v:P,c:'var(--navy)'},{l:'Interest',v:c.I,c:'var(--gold)'}])}<p class="mute">Estimates only; actual returns depend on the bank's terms and tax.</p>`;
  $('#fcmp').innerHTML=bars(Object.entries(BANKS).filter(b=>b[0]!='Custom').map(([b,rt])=>({l:b.split(' (')[0],v:fdCalc(P,rt,y,n,'Cumulative').A})))+`<p class="mute">Rates: ${Object.values(BANKS).slice(0,3).join('%, ')}% (sample)</p>`};
 el.querySelectorAll('input,select').forEach(i=>i.oninput=()=>{if(i.id=='fb')$('#fr').value=BANKS[i.value];run()});run()};

/* ===== vacation.js ===== */
/* Enjoy: vacation planner (list + detail with budget, itinerary, expenses, completion) */
const VC=['Transportation','Accommodation','Food','Activities','Shopping','Miscellaneous'];let vid=null;
const tripPlanned=v=>sum(Object.entries(v.budget).map(([,a])=>({a})),'a');
R.vac=el=>{const d=Store.db,v=d.trips.find(x=>x.id==vid);
 if(!v){el.innerHTML=`<div class="row sb"><h3>🌴 Vacations</h3><button class="btn" data-a="new">+ Plan a trip</button></div>${d.trips.map(x=>`<div class="card" style="margin-top:8px"><div class="row sb"><div><b>${esc(x.dest)}</b> ${x.demo?'<span class="tag2">demo</span>':''}<div class="mute">${x.start} → ${x.end} · ${x.people} traveller(s)${x.done?' · completed':''}</div></div><button class="btn ghost" data-a="open" data-id="${x.id}">Open</button></div></div>`).join('')||'<div class="card empty">No trips yet – where would you love to go?</div>'}`;return}
 const pl=tripPlanned(v),ac=sum(v.exps),ended=v.done||v.end<today();
 const days=[...new Set(v.items.map(i=>i.day))].sort();
 el.innerHTML=`<button class="btn ghost" data-a="back">← All trips</button><div class="card" style="margin-top:8px"><div class="row sb"><h3>${esc(v.dest)} · ${v.type}</h3><div class="row"><button class="btn ghost sm" data-a="edit">Edit</button><button class="btn ghost sm" data-a="del">Delete</button></div></div><p class="mute">${v.start} → ${v.end} · ${v.people} traveller(s) ${esc(v.notes)}</p>
 <div class="grid g3"><div class="stat"><span class="mute">Planned</span><b>${fmt(pl)}</b></div><div class="stat"><span class="mute">Actual</span><b>${fmt(ac)}</b></div><div class="stat"><span class="mute">Remaining</span><b class="${pl-ac<0?'neg':'pos'}">${fmt(pl-ac)}</b></div></div></div>
 <div class="card" style="margin-top:16px"><div class="row sb"><h3>Budget: planned vs actual</h3><button class="btn ghost sm" data-a="bud">Set budgets</button></div>${VC.map(c=>{const a=sum(v.exps.filter(e=>e.cat==c)),p=v.budget[c]||0;return`<div style="margin-bottom:8px"><div class="row sb"><span>${c}</span><span class="mute">${fmt(a)} / ${fmt(p)}</span></div>${pg(pct(a,p),a>p?'bad':'')}</div>`}).join('')}<button class="btn" data-a="exp">+ Record expense</button>${v.exps.map(e=>`<div class="li"><span>${esc(e.cat)} <span class="mute">${e.date} ${esc(e.note)}</span></span><span>${fmt(e.amount)} <button class="btn ghost sm" data-a="xdel" data-id="${e.id}" aria-label="Delete expense">🗑️</button></span></div>`).join('')}</div>
 <div class="card" style="margin-top:16px"><div class="row sb"><h3>Itinerary</h3><button class="btn" data-a="act">+ Activity</button></div>${days.map(k=>`<h3 class="mute">${k}</h3>`+v.items.filter(i=>i.day==k).sort((a,b)=>a.time.localeCompare(b.time)).map(i=>`<div class="li"><div><b>${esc(i.time)} ${esc(i.title)}</b><div class="mute">${esc(i.place)} ${esc(i.note)}</div></div><div class="row"><button class="btn ghost sm" data-a="aedit" data-id="${i.id}" aria-label="Edit">✏️</button><button class="btn ghost sm" data-a="adel" data-id="${i.id}" aria-label="Delete">🗑️</button></div></div>`).join('')).join('')||'<p class="empty">No activities yet.</p>'}</div>
 ${ended?`<div class="card hero" style="margin-top:16px"><h2>🎉 Trip complete: ${esc(v.dest)}</h2><p>${v.start} → ${v.end} · Planned ${fmt(pl)} · Spent ${fmt(ac)} · ${pl-ac>=0?'Left over':'Over by'} ${fmt(Math.abs(pl-ac))} · ${v.items.length} activities planned</p><p>Memories: ${esc(v.mem||'None yet')}</p><button class="btn" data-a="mem">Add memory note</button></div>`:`<button class="btn ghost" style="margin-top:16px" data-a="finish">Mark trip as completed</button>`}`};
const tripF=[{n:'dest',l:'Destination',r:1},{n:'start',l:'Start date',t:'date',r:1},{n:'end',l:'End date',t:'date',r:1},{n:'people',l:'Travellers',t:'number',r:1},{n:'type',l:'Trip type',o:['Leisure','Adventure','Family','Romantic','Business','Other']},{n:'notes',l:'Notes'}];
document.addEventListener('click',e=>{const el=$('#vac');if(!el||!el.contains(e.target))return;const b=e.target.closest('[data-a]');if(!b)return;const d=Store.db,v=d.trips.find(x=>x.id==vid),a=b.dataset.a,id=b.dataset.id,done=()=>{Store.save();refresh()};
 if(a=='new')openForm('Plan a trip',tripF,{start:today(),end:today(),people:1},o=>{if(o.end<o.start)return toast('End date must be after start');d.trips.push({id:uid(),...o,budget:{},items:[],exps:[],done:false});done()});
 if(a=='open'){vid=id;refresh()}if(a=='back'){vid=null;refresh()}
 if(a=='edit')openForm('Edit trip',tripF,v,o=>{Object.assign(v,o,{demo:0});done()});
 if(a=='del')confirmDel('Delete this trip?',()=>{d.trips=d.trips.filter(t=>t!=v);vid=null;done()});
 if(a=='bud')openForm('Category budgets',VC.map(c=>({n:c,l:c,t:'number'})),v.budget,o=>{v.budget=o;done()});
 if(a=='exp')openForm('Record expense',[{n:'cat',l:'Category',o:VC},{n:'amount',l:'Amount',t:'number',r:1},{n:'date',l:'Date',t:'date',r:1},{n:'note',l:'Note'}],{date:today()},o=>{v.exps.push({id:uid(),...o});done()});
 if(a=='xdel'){v.exps=v.exps.filter(x=>x.id!=id);done()}
 const af=[{n:'day',l:'Date',t:'date',r:1},{n:'time',l:'Time',t:'time'},{n:'title',l:'Activity',r:1},{n:'place',l:'Destination / place'},{n:'note',l:'Notes'}];
 if(a=='act')openForm('Add activity',af,{day:v.start},o=>{v.items.push({id:uid(),...o});done()});
 if(a=='aedit'){const i=v.items.find(x=>x.id==id);openForm('Edit activity',af,i,o=>{Object.assign(i,o);done()})}
 if(a=='adel')confirmDel('Delete this activity?',()=>{v.items=v.items.filter(x=>x.id!=id);done()});
 if(a=='finish'){v.done=true;done()}if(a=='mem')openForm('Memory note',[{n:'mem',l:'Favourite moments'}],v,o=>{v.mem=o.mem;done()})});

/* ===== goals.js ===== */
/* Plan (goals + life timeline), Enjoy (wrapper + experience goals), Profile */
const GC=['Emergency fund','Higher education','Buying a house','Buying a vehicle','Retirement','Vacation','Starting a business','Personal milestone'],XK=['Picnic','Weekend party','Other'];
const periods=(date,f)=>{const m=Math.max((new Date(date)-new Date())/2629800000,0);return Math.max(Math.ceil(f=='Weekly'?m*4.35:f=='Yearly'?m/12:m),1)};
const card=(g,t,k)=>{const nm=g.title||g.name,p=pct(g.saved,g.target),rem=Math.max(g.target-g.saved,0);return`<div class="card" style="margin-top:8px"><div class="row" style="flex-wrap:nowrap"><span class="gt ${k=='exp'?'p':''}">${GI[g.cat||g.kind]||'🎯'}</span><div style="flex:1;min-width:0"><b>${esc(nm)}</b> ${g.demo?'<span class="tag2">demo</span>':''}${p>=100||g.done?' ✅':''}<div class="mute">${esc(g.cat||g.kind)}</div></div><b class="pc">${p}%</b></div><div style="margin:12px 0 8px">${pg(p)}</div><p class="mute">${fmt(g.saved)} of ${fmt(g.target)} (${p}%) · remaining ${fmt(rem)} · by ${g.date}${g.freq&&rem?` · ~${fmt(rem/periods(g.date,g.freq))} ${g.freq.toLowerCase()}`:''}</p>${g.notes?`<p class="mute">${esc(g.notes)}</p>`:''}<div class="row"><button class="btn" data-k="${k}" data-a="add" data-id="${g.id}">+ Add savings</button>${k=='exp'?`<button class="btn ghost" data-k="exp" data-a="done" data-id="${g.id}">${g.done?'Reopen':'Mark complete'}</button>`:''}<button class="btn ghost" data-k="${k}" data-a="edit" data-id="${g.id}">Edit</button><button class="btn ghost" data-k="${k}" data-a="del" data-id="${g.id}">Delete</button></div></div>`};
const gF=[{n:'title',l:'Goal title',r:1},{n:'cat',l:'Category',o:GC},{n:'target',l:'Target amount',t:'number',r:1},{n:'saved',l:'Current saved',t:'number'},{n:'date',l:'Target date',t:'date',r:1},{n:'freq',l:'Contribution frequency',o:['Monthly','Weekly','Yearly']}],xF=[{n:'name',l:'Goal name',r:1},{n:'kind',l:'Type',o:XK},{n:'target',l:'Target amount',t:'number',r:1},{n:'saved',l:'Current savings',t:'number'},{n:'date',l:'Target date',t:'date',r:1},{n:'notes',l:'Notes'}];
R.plan=()=>{const d=Store.db;$('#v-plan').innerHTML=`${hero('Goals progress',pct(sum(d.goals,'saved'),sum(d.goals,'target'))+'%',fmt(sum(d.goals,'saved'))+' saved of '+fmt(sum(d.goals,'target')),hb('data-k="goals" data-a="new"','＋ New goal','lime'),hb('data-k="miles" data-a="new"','＋ Milestone','glass'))}${d.goals.map(g=>card(g,0,'goals')).join('')||'<div class="card empty">No goals yet. Even a small one is a great start. 🌱</div>'}
 <div class="card" style="margin-top:16px"><div class="row sb"><h3>Life timeline</h3><button class="btn ghost" data-k="miles" data-a="new">+ Milestone</button></div>${[...d.miles].sort((a,b)=>a.year-b.year).map(m=>`<div class="li"><div>${m.done?'✅':'⭕'} <b>${m.year}</b> – ${esc(m.title)}</div><div class="row"><button class="btn ghost sm" data-k="miles" data-a="done" data-id="${m.id}" aria-label="Toggle done">${m.done?'Undo':'Done'}</button><button class="btn ghost sm" data-k="miles" data-a="edit" data-id="${m.id}" aria-label="Edit">✏️</button><button class="btn ghost sm" data-k="miles" data-a="del" data-id="${m.id}" aria-label="Delete">🗑️</button></div></div>`).join('')||'<p class="empty">Add the milestones you are working toward.</p>'}</div>`};
/* Fun: ask what to do (Picnic / Weekend party / Trips / Something else) */
let fk='';
const FO=[['picnic','🧺','Picnic','Plan & save for a day out'],['party','🎉','Weekend party','Get-togethers & celebrations'],['trips','🌴','Trips','Plan a vacation with a budget'],['other','✨','Something else','Concerts, outings & more']],fkind={picnic:'Picnic',party:'Weekend party',other:'Other'};
R.enjoy=()=>{const d=Store.db;let h;
 if(!fk){const v=d.trips.filter(x=>x.end>=today()).sort((a,b)=>a.start.localeCompare(b.start))[0];
  h=`<div class="greet"><small>Fun</small><h2>What do you want to do?</h2></div>${hero('Next adventure',v?esc(v.dest):'Your next story',v?Math.max(Math.ceil((new Date(v.start)-new Date())/864e5),0)+' days to go – enjoy it guilt-free.':'Money is also meant to create memories.','','')}<div class="opts" style="margin-top:16px">${FO.map(([k,i,n,s])=>`<button class="opt" data-f="${k}"><span>${i}</span><b>${n}</b><small class="mute">${s}</small></button>`).join('')}</div>`}
 else{const o=FO.find(x=>x[0]==fk),L=d.exp.filter(g=>fk=='other'?!['Picnic','Weekend party'].includes(g.kind):g.kind==fkind[fk]);
  h=`<button class="btn ghost" data-f="">← Choose another</button>`+(fk=='trips'?'<div id="vac" style="margin-top:16px"></div>':`<div class="row sb" style="margin:16px 0 8px"><h3>${o[1]} ${o[2]}</h3><button class="btn" data-k="exp" data-a="new">+ Plan ${o[2].toLowerCase()}</button></div>${L.map(g=>card(g,0,'exp')).join('')||'<div class="card empty">Nothing planned yet – tap “Plan” to start saving for it.</div>'}`)}
 $('#v-enjoy').innerHTML=h;if(fk=='trips')R.vac($('#vac'))};
document.addEventListener('click',e=>{const b=e.target.closest('[data-f]');if(!b)return;fk=b.dataset.f;vid=null;R.enjoy()});
/* shared CRUD for goals / exp / miles */
const CFG={goals:{f:gF,def:()=>({date:addM(today(),12),saved:0})},exp:{f:xF,def:()=>({date:addM(today(),3),saved:0,kind:fkind[fk]||'Other'})},miles:{f:[{n:'year',l:'Year',t:'number',r:1},{n:'title',l:'Milestone',r:1}],def:()=>({year:new Date().getFullYear()+1})}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(!b||!b.dataset.a)return;const k=b.dataset.k,a=b.dataset.a,d=Store.db,c=CFG[k],x=d[k].find(i=>i.id==b.dataset.id),done=()=>{Store.save();refresh()};
 if(a=='new')openForm('New',c.f,c.def(),o=>{d[k].push({id:uid(),done:false,...o});done()});
 if(a=='edit')openForm('Edit',c.f,x,o=>{Object.assign(x,o,{demo:0});done()});
 if(a=='del')confirmDel('Delete this item?',()=>{d[k]=d[k].filter(i=>i!=x);done()});
 if(a=='done'){x.done=!x.done;done()}
 if(a=='add')openForm('Add savings',[{n:'amt',l:'Amount',t:'number',r:1}],{},o=>{x.saved=+x.saved+o.amt;done();openMsg(x.saved>=x.target?'🎉 Goal reached!':'Nicely done!',`<p>${x.saved>=x.target?'You did it! Time to celebrate.':'Progress recorded – every step counts.'}</p>`)})});
/* Profile & settings */
R.profile=()=>{const s=Store.db.settings;$('#v-profile').innerHTML=`${hero('Your profile',esc(s.name),'Settings and data live on this device.',hb('data-go="notes"','Notifications','lime'),hb('data-go="home"','Back home','glass'))}<div style="height:16px"></div><div class="card"><label>Name<input id="pn" value="${esc(s.name)}"></label><label>Currency<select id="pc">${['₹','$','€','£'].map(c=>`<option${c==s.cur?' selected':''}>${c}</option>`).join('')}</select></label><button class="btn" id="ps">Save</button></div>
 <div class="card" style="margin-top:16px"><h3>Your data</h3><p class="mute">Data is stored only in this browser. Security/privacy options need a backend and are not included in this prototype.</p><div class="row"><button class="btn ghost" id="pe">Export JSON</button><button class="btn ghost" id="pd">Clear demo data</button><button class="btn danger" id="pr">Reset everything</button></div></div>`;
 $('#ps').onclick=()=>{const n=$('#pn').value.trim();if(!n)return toast('Please enter a name');s.name=n;s.cur=$('#pc').value;Store.save();toast('Saved ✓');R.profile()};
 $('#pe').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(Store.db,null,2)],{type:'application/json'}));a.download='artha-data.json';a.click()};
 $('#pd').onclick=()=>confirmDel('Remove all demo records?',()=>{const d=Store.db;['tx','schemes','holdings','trips','goals','exp','miles'].forEach(k=>d[k]=d[k].filter(x=>!x.demo));Store.save();toast('Demo data cleared');show('home')});
 $('#pr').onclick=()=>confirmDel('Erase ALL data and restore demo data?',()=>Store.reset())};

/* ===== app.js ===== */
/* Entry point + quick-add (FAB / quick action buttons) */
const Q={exp:()=>openAdd('expense'),inc:()=>openAdd('income'),gold:()=>{gt='gold';show('grow');$('#gb [data-a=new]').click()},goal:()=>{show('plan');$('[data-k=goals][data-a=new]').click()},trip:()=>{vid=null;fk='trips';show('enjoy');$('#vac [data-a=new]').click()}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-q]');if(b){const d=$('#dlg');if(d.open)d.close();Q[b.dataset.q]()}if(e.target.closest('[data-add]'))openAdd('expense');if(e.target.closest('[data-more]'))openMsg('Quick add',qaBtns())});
const _bell=R.bell;R.bell=()=>{_bell();$('#av').textContent=(Store.db.settings.name||'U')[0].toUpperCase()};
/* ===== add.js ===== */
/* Centre "+" : Expense / Income tabs -> category icons -> note + number pad (date and tick on the right) */
let AT='expense',AC=null,AV='',AD='',AN='';
const dlab=s=>dn(s,{day:'numeric',month:'short'});
function openAdd(t){AT=t||'expense';AC=null;AV='';AD=today();AN='';addView();const d=$('#add');if(!d.open)d.showModal()}
function addView(){const d=$('#add');
 if(!AC){d.innerHTML=`<div><div class="row sb"><h3>Add transaction</h3><button class="btn ghost sm" data-ax="close" aria-label="Close">✕</button></div><div class="tabs">${['expense','income'].map(k=>`<button class="${AT==k?'on':''}" data-at="${k}">${k=='expense'?'Expense':'Income'}</button>`).join('')}</div><p class="mute">Choose a category</p><div class="icons">${(AT=='income'?INC:EXP).map(c=>`<button data-ac="${esc(c)}"><span>${CI[c]||'💳'}</span>${esc(c)}</button>`).join('')}</div></div>`;return}
 const K=['1','2','3','bk','4','5','6','dt','7','8','9','ok','.','0','00'];
 d.innerHTML=`<div><div class="row sb"><button class="btn ghost sm" data-ax="back">← Back</button><span class="tag2">${AT=='income'?'Income':'Expense'} · ${CI[AC]||''} ${esc(AC)}</span></div>
 <input id="an" placeholder="Add a note (optional)" value="${esc(AN)}" aria-label="Note" maxlength="60" style="margin-top:16px">
 <div class="amt"><span class="mute">${esc(Store.db.settings.cur)}</span> <span id="aa">${AV||'0'}</span></div>
 <div class="pad">${K.map(k=>k=='bk'?'<button data-n="bk" aria-label="Delete last digit">⌫</button>':k=='dt'?`<button class="dt" aria-label="Pick date">📅<small id="ad">${dlab(AD)}</small><input type="date" id="adi" value="${AD}"></button>`:k=='ok'?'<button class="ok" data-n="ok" aria-label="Save">✓</button>':`<button data-n="${k}">${k}</button>`).join('')}</div></div>`}
$('#add').addEventListener('click',e=>{const t=e.target,d=$('#add');if(t===d)return d.close();
 const x=t.closest('[data-ax]');if(x){if(x.dataset.ax=='close')d.close();else{AC=null;addView()}return}
 const a=t.closest('[data-at]');if(a){AT=a.dataset.at;return addView()}
 const c=t.closest('[data-ac]');if(c){AC=c.dataset.ac;return addView()}
 const n=t.closest('[data-n]');if(!n)return;const k=n.dataset.n;
 if(k=='ok'){const v=+AV;if(!(v>0))return toast('Enter an amount first');Store.db.tx.push({id:uid(),type:AT,cat:AC,amount:v,date:AD,note:AN.trim(),method:'UPI'});Store.save();selD=AD;calY=+AD.slice(0,4);calM=+AD.slice(5,7);d.close();toast('Saved ✓');return refresh()}
 if(k=='bk')AV=AV.slice(0,-1);
 else if(k=='.'){if(AV.includes('.'))return;AV=(AV||'0')+'.'}
 else{if(AV.includes('.')&&AV.split('.')[1].length+k.length>2)return;if(AV.length+k.length>10)return;AV=AV==''||AV=='0'?(k=='00'?'0':k):AV+k}
 $('#aa').textContent=AV||'0'});
$('#add').addEventListener('input',e=>{if(e.target.id=='adi'){AD=e.target.value||today();$('#ad').textContent=dlab(AD)}if(e.target.id=='an')AN=e.target.value});

/* Welcome page */
try{if(sessionStorage.getItem('artha.in'))$('#welcome').hidden=true}catch(e){}
$('#welcome').onclick=e=>{if(e.target.closest('[data-start]')){$('#welcome').hidden=true;try{sessionStorage.setItem('artha.in','1')}catch(x){}}};
Store.init();show('home');R.bell();
