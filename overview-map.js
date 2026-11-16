(() => {
  'use strict';
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const points=window.GUIDE_MAP_POINTS||[],panel=$('#overview-panel'),mapNode=$('#overview-map'),status=$('#overview-status'),detail=$('#overview-detail'),page=$('#map');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const catLabels={all:'全部',sight:'景点',food:'美食',stay:'住宿',transport:'车站'},symbols={sight:'景',food:'食',stay:'住',transport:'站'};
  let map,base,markers,scope='city',category='all',selected='',nativeFullscreen=false,timer,provider='amap',sourceRevision=0;
  const markersById=new Map();
  // Source POIs and AMap tiles use GCJ-02; the OpenStreetMap fallback uses WGS-84.
  const pi=Math.PI,a=6378245,ee=0.00669342162296594323,rad=n=>n*pi/180;
  function offsetLat(x,y){let r=-100+2*x+3*y+.2*y*y+.1*x*y+.2*Math.sqrt(Math.abs(x));r+=(20*Math.sin(6*x*pi)+20*Math.sin(2*x*pi))*2/3;r+=(20*Math.sin(y*pi)+40*Math.sin(y*pi/3))*2/3;r+=(160*Math.sin(y*pi/12)+320*Math.sin(y*pi/30))*2/3;return r;}
  function offsetLng(x,y){let r=300+x+2*y+.1*x*x+.1*x*y+.1*Math.sqrt(Math.abs(x));r+=(20*Math.sin(6*x*pi)+20*Math.sin(2*x*pi))*2/3;r+=(20*Math.sin(x*pi)+40*Math.sin(x*pi/3))*2/3;r+=(150*Math.sin(x*pi/12)+300*Math.sin(x*pi/30))*2/3;return r;}
  function offset(p){const x=p.lon,y=p.lat,s=Math.sin(rad(y)),magic=1-ee*s*s,root=Math.sqrt(magic);return [offsetLat(x-105,y-35)*180/((a*(1-ee))/(magic*root)*pi),offsetLng(x-105,y-35)*180/(a/root*Math.cos(rad(y))*pi)];}
  function toWgs(p){const [dy,dx]=offset(p);return [p.lat-dy,p.lon-dx];}
  function toGcj(p){const [dy,dx]=offset(p);return [p.lat+dy,p.lon+dx];}
  function position(p){return provider==='amap'?[p.lat,p.lon]:toWgs(p);}
  function straight(p){const o=points.find(x=>x.id==='wenmiao'),dl=rad(p.lat-o.lat),dn=rad(p.lon-o.lon),v=Math.sin(dl/2)**2+Math.cos(rad(o.lat))*Math.cos(rad(p.lat))*Math.sin(dn/2)**2,km=6371*2*Math.asin(Math.min(1,Math.sqrt(v)));if(p.id==='wenmiao')return '参考起点';return `${km<.975?`${Math.max(50,Math.round(km*1000/50)*50)} 米`:`${km.toFixed(km<10?1:0)} 公里`} · 直线`;}
  function directions(p){const o=points.find(x=>x.id==='wenmiao'),y=Math.sin(rad(p.lon-o.lon))*Math.cos(rad(p.lat)),x=Math.cos(rad(o.lat))*Math.sin(rad(p.lat))-Math.sin(rad(o.lat))*Math.cos(rad(p.lat))*Math.cos(rad(p.lon-o.lon));return ['北','东北','东','东南','南','西南','西','西北'][Math.round(((Math.atan2(y,x)*180/pi+360)%360)/45)%8];}
  function renderControls(){
    $('#overview-filters').innerHTML=Object.entries(catLabels).map(([id,label])=>`<button type="button" data-overview-cat="${id}" class="ov-filter-${id}" aria-pressed="${id===category}">${id==='all'?'':`<span class="ov-dot"></span>`}${label}</button>`).join('');
    $$('[data-overview-scope]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.overviewScope===scope)));
    const visible=points.filter(p=>category==='all'||p.cat===category);
    $('#overview-list').innerHTML=visible.map(p=>`<button type="button" data-overview-point="${esc(p.id)}" aria-pressed="${selected===p.id}"><span class="ov-list-icon ov-${esc(p.cat)}">${symbols[p.cat]}</span><span><strong>${esc(p.name)}${p.proxy?' · 范围':''}</strong><small>${p.id==='wenmiao'?'参考起点':`${esc(straight(p))} · ${esc(directions(p))}方`}${p.region?' · 广汉':''}</small></span><span class="ov-list-arrow">↗</span></button>`).join('');
    const unlocated=$('#overview-unlocated');unlocated.hidden=category!=='all'&&category!=='food';
    const otherFoods=(window.GUIDE?.foodGroups||[]).flatMap(g=>g.items).filter(f=>!['肖记片粉','勇记糯香干锅','三丁一体菜'].includes(f.name));
    unlocated.innerHTML=`<p><strong>其他美食 · 位置待核</strong><br>部分是菜名或未核实门店坐标，点击搜索；不在地图上冒充准确位置。</p><div>${otherFoods.map(f=>`<a href="https://uri.amap.com/search?${esc(new URLSearchParams({keyword:f.map,city:'德阳',src:'deyang-travel-guide'}).toString())}" target="_blank" rel="noopener noreferrer">${esc(f.name)} ↗</a>`).join('')}</div>`;
  }
  function renderDetail(p){
    selected=p.id;detail.innerHTML=`<span class="ov-list-icon ov-${esc(p.cat)}">${symbols[p.cat]}</span><div><strong>${esc(p.name)}${p.proxy?' · 范围参考':''}</strong><span>${esc(p.note)}</span><div class="overview-detail-actions"><a href="${esc(p.link)}" target="_blank" rel="noopener noreferrer">查看路线 / 导航 ↗</a><button type="button" data-overview-share="${esc(p.id)}">分享地点 ↗</button></div></div>`;renderControls();
  }
  function makeIcon(p){return L.divIcon({className:'overview-pin-shell',html:`<span class="overview-pin ov-${esc(p.cat)}${p.proxy?' is-proxy':''}${p.chosen?' is-chosen':''}"><span>${symbols[p.cat]}</span></span>`,iconSize:[36,42],iconAnchor:[18,39],popupAnchor:[0,-36]});}
  function popup(p){return `<div class="overview-popup"><strong>${esc(p.name)}${p.proxy?' · 范围':''}</strong><p>${esc(p.note)}</p><a href="${esc(p.link)}" target="_blank" rel="noopener noreferrer">查看导航 ↗</a></div>`;}
  function fit(){if(!map)return;const relevant=points.filter(p=>(category==='all'||p.cat===category)&&(scope==='all'||!p.region));if(!relevant.length)return;const bounds=L.latLngBounds(relevant.map(position));map.fitBounds(bounds,{padding:[36,36],maxZoom:15,animate:false});}
  function rebuild(){
    if(!markers)return;markers.clearLayers();markersById.clear();
    points.filter(p=>category==='all'||p.cat===category).forEach(p=>{const m=L.marker(position(p),{icon:makeIcon(p),title:p.name,alt:`${catLabels[p.cat]}：${p.name}`});m.bindPopup(popup(p));m.on('click',()=>renderDetail(p));markers.addLayer(m);markersById.set(p.id,m);});
    renderControls();
  }
  function focusPoint(id){const p=points.find(q=>q.id===id);if(!p||!map)return;if(category!=='all'&&category!==p.cat){category='all';rebuild();}if(p.region){scope='all';renderControls();}renderDetail(p);const marker=markersById.get(id);if(marker)markers.zoomToShowLayer(marker,()=>{marker.openPopup();});}
  function setBasemap(next){
    if(!map)return;const previous=provider,revision=++sourceRevision,center=map.getCenter(),zoom=map.getZoom();clearTimeout(timer);if(base)map.removeLayer(base);
    provider=next;$('#overview-provider').textContent=next==='amap'?'高德道路底图':'OpenStreetMap 备用底图';$('#overview-switch').textContent=next==='amap'?'切换备用底图':'切换高德底图';
    status.hidden=false;status.textContent=next==='amap'?'正在加载高德道路底图…':'正在加载备用道路底图…';
    if(previous!==next){const p={lat:center.lat,lon:center.lng};map.setView(next==='amap'?toGcj(p):toWgs(p),zoom,{animate:false});rebuild();}
    if(next==='osm'&&!window.protomapsL){status.textContent='备用底图组件未加载，请刷新网页。';return;}
    base=next==='amap'?L.tileLayer('https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',{maxZoom:18,keepBuffer:2,attribution:'© <a href="https://www.amap.com/" target="_blank" rel="noopener noreferrer">高德地图</a> · GS(2025)5996号'}):protomapsL.leafletLayer({url:'https://tiles.jasontally.com/basemap.pmtiles',flavor:'light',lang:'zh',attribution:'地图数据 © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> · <a href="https://tiles.jasontally.com/zh-hans/" target="_blank" rel="noopener noreferrer">Protomaps</a>'});
    let loaded=false,errors=0;base.on('tileload',()=>{if(revision!==sourceRevision)return;loaded=true;status.hidden=true;clearTimeout(timer);});base.on('tileerror',()=>{if(revision!==sourceRevision)return;errors++;if(next==='amap'&&!loaded&&errors>=2){setBasemap('osm');return;}status.hidden=false;status.textContent='部分地图加载失败，可切换底图或向下查看高德地图。';});
    base.addTo(map);timer=setTimeout(()=>{if(revision!==sourceRevision||loaded)return;if(next==='amap'){setBasemap('osm');return;}status.textContent='备用底图加载较慢，可切换高德底图或查看下方地图。';},6000);
  }
  function init(){
    if(page.hidden)return;if(map){map.invalidateSize();return;}if(!window.L||!L.markerClusterGroup){status.textContent='地图组件加载失败，请刷新页面或使用下方高德地图。';return;}
    map=L.map(mapNode,{zoomControl:false,attributionControl:false,scrollWheelZoom:false,maxZoom:18,minZoom:8});
    L.control.zoom({position:'topright',zoomInTitle:'放大地图',zoomOutTitle:'缩小地图'}).addTo(map);L.control.scale({position:'bottomleft',imperial:false}).addTo(map);
    L.control.attribution({position:'bottomright',prefix:false}).addTo(map);
    markers=L.markerClusterGroup({maxClusterRadius:38,showCoverageOnHover:false,spiderfyOnMaxZoom:true,disableClusteringAtZoom:17,iconCreateFunction:c=>L.divIcon({className:'overview-cluster-shell',html:`<span class="overview-cluster">${c.getChildCount()}</span>`,iconSize:[38,38]})}).addTo(map);
    rebuild();fit();setBasemap('amap');
    const id=new URL(location.href).searchParams.get('place');if(points.some(p=>p.id===id))setTimeout(()=>focusPoint(id),150);
  }
  $('#overview-filters').addEventListener('click',e=>{const b=e.target.closest('[data-overview-cat]');if(!b)return;category=b.dataset.overviewCat;rebuild();fit();});
  $('.overview-scopes').addEventListener('click',e=>{const b=e.target.closest('[data-overview-scope]');if(!b)return;scope=b.dataset.overviewScope;renderControls();fit();});
  $('#overview-switch').addEventListener('click',()=>setBasemap(provider==='amap'?'osm':'amap'));
  document.addEventListener('guide:overview-focus',e=>{const id=e.detail?.id;if(!points.some(p=>p.id===id))return;requestAnimationFrame(()=>{init();if(map)focusPoint(id);});});
  $('#overview-list').addEventListener('click',e=>{const b=e.target.closest('[data-overview-point]');if(b)focusPoint(b.dataset.overviewPoint);});
  detail.addEventListener('click',async e=>{const b=e.target.closest('[data-overview-share]');if(!b)return;const p=points.find(q=>q.id===b.dataset.overviewShare),u=new URL(location.href);u.searchParams.delete('maplink');u.searchParams.delete('amap_open');u.searchParams.set('place',p.id);u.hash='map';if(/MicroMessenger/i.test(navigator.userAgent)){history.replaceState(null,'',u);document.dispatchEvent(new CustomEvent('guide:share-in-wechat',{detail:{url:u.href}}));return;}try{if(navigator.share){await navigator.share({title:p.name,url:u.href});return;}await navigator.clipboard.writeText(u.href);b.textContent='链接已复制 ✓';}catch(e){if(e?.name!=='AbortError')window.prompt('复制地点链接：',u.href);}});
  const expand=$('#overview-fullscreen');function full(on){panel.classList.toggle('is-overview-fullscreen',on);document.body.classList.toggle('has-overview-fullscreen',on);expand.setAttribute('aria-expanded',String(on));expand.setAttribute('aria-label',on?'退出地点总览全屏':'全屏查看地点总览');expand.textContent=on?'× 退出全屏':'⛶ 全屏';requestAnimationFrame(()=>map?.invalidateSize());if(!on)expand.focus({preventScroll:true});}
  expand.addEventListener('click',async()=>{if(panel.classList.contains('is-overview-fullscreen')){full(false);if(document.fullscreenElement===panel&&document.exitFullscreen)try{await document.exitFullscreen();}catch(_){}nativeFullscreen=false;return;}full(true);if(panel.requestFullscreen)try{await panel.requestFullscreen();nativeFullscreen=true;}catch(_){} });
  document.addEventListener('fullscreenchange',()=>{if(document.fullscreenElement===panel)nativeFullscreen=true;else if(nativeFullscreen){nativeFullscreen=false;full(false);}});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('is-overview-fullscreen')&&!document.fullscreenElement)full(false);});
  new MutationObserver(()=>{if(!page.hidden)requestAnimationFrame(init);}).observe(page,{attributes:true,attributeFilter:['hidden']});if(!page.hidden)requestAnimationFrame(init);
  renderControls();
})();
