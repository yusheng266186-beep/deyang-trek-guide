(() => {
  'use strict';
  const data = window.TRIP;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const KEY = 'deyang-travel-guide-v1';
  const defaults = { train:'G3293', saved:[], checks:[], costs:{hotel:300,food:300,local:80,zigong:130,luzhou:170} };
  let state = JSON.parse(JSON.stringify(defaults));
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && typeof saved === 'object') {
      state = {...state,...saved,costs:{...state.costs,...(saved.costs || {})}};
      if (!Array.isArray(state.saved)) state.saved=[];
      if (!Array.isArray(state.checks)) state.checks=[];
    }
  } catch (_) { /* Browsers may disable storage; the guide still works. */ }
  const params = new URLSearchParams(window.location.search);
  if (data.trains[params.get('train')]) state.train=params.get('train');
  if (!data.trains[state.train]) state.train=defaults.train;
  const store = () => { try { localStorage.setItem(KEY,JSON.stringify(state)); } catch (_) {} };
  const escape = str => String(str ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let filter = 'all';
  let toastTimer;
  function toast(message){const el=$('.toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600);}
  function activateDay(day){
    $$('.day-tab').forEach(btn=>{const active=btn.dataset.day===day;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));});
    $$('.day-panel').forEach(panel=>{const active=panel.dataset.panel===day;panel.classList.toggle('active',active);panel.hidden=!active;});
  }
  $$('.day-tab').forEach(btn=>btn.addEventListener('click',()=>activateDay(btn.dataset.day)));
  function setTrain(code){
    if(!data.trains[code]) return;
    state.train=code;store();const t=data.trains[code];
    $$('.train-button').forEach(btn=>{const active=btn.dataset.train===code;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));});
    $('#train-description').textContent=t.description;
    $('#ticket-code').textContent=t.code;$('#ticket-depart').textContent=t.depart;
    $('#ticket-zigong').textContent=t.zigong;$('#ticket-luzhou').textContent=t.luzhou;
    $('#leave-time').textContent=t.leave;$('#train-checked').textContent=data.checkedAt;
    $('#timeline-train-brief').textContent=`${t.code} ${t.depart} 出发 / 建议 ${t.leave} 离开商圈`;
    $('#timeline-train-detail').textContent=`所选 ${t.code}：${t.depart} 德阳出发，${t.zigong} 到自贡，${t.luzhou} 到泸州。建议 ${t.leave} 从文庙商圈出发去德阳站；车票与余票以 12306 为准。`;
  }
  $$('.train-button').forEach(btn=>btn.addEventListener('click',()=>setTrain(btn.dataset.train)));
  setTrain(state.train);
  $('#share-train').addEventListener('click',async()=>{
    const url=new URL(window.location.href);url.searchParams.set('train',state.train);url.hash='departure';
    try { await navigator.clipboard.writeText(url.href);toast('车次方案链接已复制'); }
    catch (_) { window.prompt('复制下面的链接分享车次方案：',url.href); }
  });
  function card(p){
    const saved=state.saved.includes(p.id);const image=p.image?`<img loading="lazy" referrerpolicy="no-referrer" src="${escape(p.image)}" alt="${escape(p.imageAlt)}"><div class="place-fallback" hidden>${escape(p.title)}</div><a class="photo-caption" target="_blank" rel="noopener noreferrer" href="${escape(p.imageSource)}">${escape(p.imageCredit)} ↗</a>`:`<div class="place-fallback">${escape(p.title)}</div>`;
    const phone=p.phone?`<a href="tel:${escape(p.phone.replace(/[^0-9+]/g,''))}">电话 ${escape(p.phone)} ↗</a>`:'';
    return `<article class="place-card" id="place-${escape(p.id)}" data-type="${escape(p.type)}"><div class="place-image">${image}<button class="save-place ${saved?'active':''}" type="button" data-save="${escape(p.id)}" aria-label="${saved?'取消收藏':'收藏'}${escape(p.title)}" aria-pressed="${saved}">${saved?'♥':'♡'}</button></div><div class="place-content"><span class="place-category">${escape(p.category)}</span><h3 class="place-title">${escape(p.title)}</h3><span class="place-en">${escape(p.en)}</span><p class="place-intro">${escape(p.intro)}</p><div class="place-meta"><span>${escape(p.price)}</span><span>${escape(p.stay)}</span></div><details><summary>地址、路线与实用信息</summary><div class="place-detail"><p><b>地址：</b>${escape(p.address)}</p><p><b>开放 / 营业：</b>${escape(p.hours)}</p><p><b>怎么玩：</b>${escape(p.path)}</p><p><b>小提醒：</b>${escape(p.tip)}</p><div class="place-links"><a target="_blank" rel="noopener noreferrer" href="${escape(p.map)}">高德位置 ↗</a><a target="_blank" rel="noopener noreferrer" href="${escape(p.source)}">${escape(p.sourceLabel)} ↗</a>${phone}</div></div></details></div></article>`;
  }
  function setFilter(next){filter=next;$$('.filter').forEach(btn=>{const active=btn.dataset.filter===filter;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));});renderPlaces();}
  function renderPlaces(){
    const list=data.places.filter(p=>filter==='all'||(filter==='saved'?state.saved.includes(p.id):p.type===filter));
    const grid=$('#place-grid');grid.innerHTML=list.length?list.map(card).join(''):'<p class="empty-state">还没有收藏地点，点击卡片右上角的 ♡ 即可保存。</p>';
    $('#saved-count').textContent=state.saved.length;
    $$('.place-image img',grid).forEach(img=>img.addEventListener('error',()=>{img.hidden=true;const fallback=img.nextElementSibling;if(fallback)fallback.hidden=false;}));
  }
  $$('.filter').forEach(btn=>btn.addEventListener('click',()=>setFilter(btn.dataset.filter)));
  $('#place-grid').addEventListener('click',event=>{const button=event.target.closest('[data-save]');if(!button)return;const id=button.dataset.save;state.saved=state.saved.includes(id)?state.saved.filter(x=>x!==id):[...state.saved,id];store();renderPlaces();});
  document.addEventListener('click',event=>{
    const filterLink=event.target.closest('[data-open-filter]');
    if(filterLink){setFilter(filterLink.dataset.openFilter);return;}
    const target=event.target.closest('[data-focus-place]');
    if(target){event.preventDefault();setFilter('all');const place=$('#place-'+target.dataset.focusPlace);if(place){const details=$('details',place);if(details)details.open=true;place.scrollIntoView({behavior:'smooth',block:'start'});}}
  });
  renderPlaces();
  const checks=[
    ['hotel','比较并确认 11/16 双床房、价格与寄存行李'],
    ['tickets','两人分别购买同车次、各自终点的高铁票'],
    ['id','携带身份证件，核对车票信息'],
    ['weather','出发前复查天气，备外套和折叠伞'],
    ['power','手机充电、带充电宝与充电线'],
    ['store','17 日早退房并确认行李取件时间'],
    ['pickup','分别确认自贡、泸州站到目的地的接驳'],
    ['time','按选定车次提前叫车，留安检缓冲']
  ];
  $('#checklist').innerHTML=checks.map(([id,label])=>`<label><input type="checkbox" data-check="${id}" ${state.checks.includes(id)?'checked':''}><span>${escape(label)}</span></label>`).join('');
  function updateChecks(){const n=state.checks.length;$('#check-count').textContent=`${n} / ${checks.length} 已完成`;$('#check-bar').style.width=`${Math.min(100,n/checks.length*100)}%`;}
  $('#checklist').addEventListener('change',event=>{const input=event.target.closest('[data-check]');if(!input)return;const id=input.dataset.check;state.checks=input.checked?[...new Set([...state.checks,id])]:state.checks.filter(x=>x!==id);store();updateChecks();});
  updateChecks();
  function amount(key){const value=Number(state.costs[key]);return Number.isFinite(value)?Math.max(0,Math.min(10000,value)):0;}
  function money(value){return `¥${Number.isInteger(value)?value:value.toFixed(2)}`;}
  function updateBudget(){const common=amount('hotel')+amount('food')+amount('local');const zigong=common/2+amount('zigong');const luzhou=common/2+amount('luzhou');$('#budget-total').textContent=money(zigong+luzhou);$('#budget-zigong').textContent=money(zigong);$('#budget-luzhou').textContent=money(luzhou);}
  $$('[data-cost]').forEach(input=>{input.value=amount(input.dataset.cost);input.addEventListener('input',()=>{state.costs[input.dataset.cost]=input.value;store();updateBudget();});});
  updateBudget();
  function renderMap(){
    if (!window.L) return;
    try {
      const el=$('#actual-map');const map=L.map(el,{scrollWheelZoom:false,zoomControl:true});
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
      const mapped=data.places.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon));
      mapped.forEach((p,index)=>{const icon=L.divIcon({className:'map-marker',html:String(index+1),iconSize:[31,31],iconAnchor:[15,15]});const marker=L.marker([p.lat,p.lon],{icon,title:p.title}).addTo(map);marker.bindPopup(`<b>${escape(p.title)}</b><br>${escape(p.address)}<br><a href="${escape(p.map)}" target="_blank" rel="noopener noreferrer">打开高德位置 ↗</a>`);});
      const route=['wenmiao','stone','eastlake','station'].map(id=>data.places.find(p=>p.id===id)).filter(Boolean);
      L.polyline(route.map(p=>[p.lat,p.lon]),{color:'#9b5945',weight:2,dashArray:'5 8',opacity:.75}).addTo(map);
      map.fitBounds(mapped.map(p=>[p.lat,p.lon]),{padding:[30,30]});
      $('.actual-map-wrap').classList.add('map-ready');
    } catch (_) { /* The text-based route remains available if map loading fails. */ }
  }
  renderMap();
  async function updateWeather(){
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),5000);
    try {
      const url='https://api.open-meteo.com/v1/forecast?latitude=31.13&longitude=104.39&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FShanghai&start_date=2026-11-16&end_date=2026-11-17';
      const response=await fetch(url,{signal:controller.signal});if(!response.ok)throw new Error('weather unavailable');const result=await response.json();const d=result.daily;const index=d.time.indexOf('2026-11-17');if(index<0)throw new Error('date unavailable');
      const code=d.weather_code[index];const desc=code<=1?'晴 / 多云':code<=3?'多云':code<=48?'雾':code<=67?'有雨':code<=77?'有雪':'阵雨';
      $('#weather-summary').textContent=`${Math.round(d.temperature_2m_min[index])}—${Math.round(d.temperature_2m_max[index])}°C`;
      $('#weather-caption').textContent=`17 日 · ${desc} · Open-Meteo`;
    } catch (_) {$('#weather-summary').textContent='早晚偏凉';$('#weather-caption').textContent='出发前查看最新预报';}
    finally {clearTimeout(timeout);}
  }
  updateWeather();
  if('serviceWorker' in navigator && location.protocol!=='file:') navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
