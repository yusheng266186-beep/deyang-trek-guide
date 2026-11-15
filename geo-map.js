(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const search = name => `https://uri.amap.com/search?keyword=${encodeURIComponent(name)}&city=${encodeURIComponent('德阳')}&src=deyang-travel-guide`;
  // GCJ-02 coordinates: AMap POIs; hotel coordinates converted from Ctrip's BD-09;
  // the station is converted from the cited WGS-84 position. Proxies are explicitly labelled.
  const points = [
    {id:'wenmiao',name:'德阳文庙',short:'文庙',cat:'sight',lon:104.391594,lat:31.129520,source:'https://www.yyxbj.com/jingdian/city/deyang/B0FFG6OQ91.html',link:search('德阳文庙'),note:'古建筑与红墙；入口以馆方和高德为准。'},
    {id:'stone',name:'石刻公园',short:'石刻公园',cat:'sight',lon:104.396161,lat:31.137411,source:'https://www.yyxbj.com/jingdian/city/deyang/B0346008A4.html',link:'https://ditu.amap.com/place/B0346008A4',note:'园区较长，出发前选合适入口。'},
    {id:'eastlake',name:'东湖山公园',short:'东湖山',cat:'sight',lon:104.427255,lat:31.135484,source:'https://ditu.amap.com/place/B03460059L',link:'https://ditu.amap.com/place/B03460059L',note:'湖边散步；不同园门会影响实际路程。'},
    {id:'bell',name:'钟鼓楼广场',short:'钟鼓楼',cat:'sight',lon:104.418566,lat:31.127025,source:'https://www.yyxbj.com/jingdian/city/deyang/B03460NFYL.html',link:search('德阳钟鼓楼广场'),note:'外景备选；是否顺路要看东湖山实际出口。'},
    {id:'jinghu',name:'旌湖 · 彩虹桥附近',short:'旌湖附近',cat:'sight',lon:104.398773,lat:31.127072,proxy:true,source:'https://hotels.ctrip.com/hotels/1467647.html',link:search('德阳彩虹桥'),note:'位置以彩虹桥附近的旌湖宾馆作区域参照，不是桥头或绿道入口；请在高德重新选点。'},
    {id:'sanxingdui',name:'三星堆博物馆',short:'三星堆',cat:'sight',lon:104.218621,lat:31.001439,region:true,source:'https://ditu.amap.com/place/B034600ZUS',link:'https://ditu.amap.com/place/B034600ZUS',note:'位于广汉，跨城备选；需提前预约。'},
    {id:'xiao',name:'肖记片粉',short:'肖记片粉',cat:'food',lon:104.391006,lat:31.132279,source:'https://www.amap.com/place/B0FFF5OURD',link:'https://www.amap.com/place/B0FFF5OURD',note:'庆云街 6 号；营业与入口以当天为准。'},
    {id:'oldfood',name:'文庙商圈小吃',short:'老城小吃',cat:'food',lon:104.391720,lat:31.127658,proxy:true,source:'https://ditu.amap.com/place/B0346008A2',link:search('德阳城隍庙街'),note:'这里用文庙广场表示小吃商圈，不是王凉粉、油茶或春卷的实际门店位置。'},
    {id:'yongji',name:'勇记干锅居',short:'勇记干锅',cat:'food',lon:104.390144,lat:31.123059,source:'https://ditu.amap.com/place/B0FFFPLX5Q',link:'https://ditu.amap.com/place/B0FFFPLX5Q',note:'龙山街 9 号，营业和小份选择请先确认。'},
    {id:'sanding',name:'三丁一体菜',short:'三丁一体菜',cat:'food',lon:104.390739,lat:31.123281,source:'https://www.amap.com/place/B0FFHEJXZZ',link:'https://www.amap.com/place/B0FFHEJXZZ',note:'绵远街一段 259 号，营业情况请先确认。'},
    {id:'starway',name:'星程酒店 · 文庙店',short:'星程酒店',cat:'stay',lon:104.395641,lat:31.126832,source:'https://hotels.ctrip.com/hotels/1901992.html',link:search('星程酒店 德阳文庙店'),note:'住宿候选；携程坐标换算后仅供参考，房价与房态未确认。'},
    {id:'hanrui',name:'汉瑞至友酒店',short:'汉瑞至友',cat:'stay',lon:104.394732,lat:31.128325,source:'https://hotels.ctrip.com/hotels/125222116.html',link:search('汉瑞至友酒店 德阳文庙广场高铁站店'),note:'住宿候选；携程坐标换算后仅供参考。'},
    {id:'ji',name:'全季酒店 · 文庙广场店',short:'全季酒店',cat:'stay',lon:104.386822,lat:31.127892,source:'https://hotels.ctrip.com/hotels/131325526.html',link:search('全季酒店 德阳文庙广场店'),note:'住宿候选；携程坐标换算后仅供参考。'},
    {id:'station',name:'德阳站',short:'德阳站',cat:'transport',lon:104.389161,lat:31.165928,source:'https://zh.wikipedia.org/wiki/德阳站',link:search('德阳站'),note:'火车站位置由公开坐标换算，进站口以高德和车站指示为准。'}
  ].map((p,i)=>({...p,num:String(i+1).padStart(2,'0')}));
  const byId = id => points.find(p => p.id === id);
  const catNames={all:'全部',sight:'景点',food:'美食',stay:'住宿',transport:'车站'};
  let scope='city', category='all', from='wenmiao', to='stone', groups=[], selected='';
  const isInScope=p=>scope==='region'||(scope==='city'&&!p.region)||(scope==='oldtown'&&!p.region&&!['eastlake','bell','station'].includes(p.id));
  function showPoint(p){if(!isInScope(p))scope=p.region?'region':'city';}
  const canvas=$('#geo-canvas'), pins=$('#geo-pins'), lines=$('#geo-lines');
  const deg=n=>n*Math.PI/180;
  function distance(a,b){const dlat=deg(b.lat-a.lat),dlon=deg(b.lon-a.lon),v=Math.sin(dlat/2)**2+Math.cos(deg(a.lat))*Math.cos(deg(b.lat))*Math.sin(dlon/2)**2;return 6371*2*Math.asin(Math.min(1,Math.sqrt(v)));}
  function bearing(a,b){const y=Math.sin(deg(b.lon-a.lon))*Math.cos(deg(b.lat));const x=Math.cos(deg(a.lat))*Math.sin(deg(b.lat))-Math.sin(deg(a.lat))*Math.cos(deg(b.lat))*Math.cos(deg(b.lon-a.lon));return (Math.atan2(y,x)*180/Math.PI+360)%360;}
  function direction(a,b){return ['北','东北','东','东南','南','西南','西','西北'][Math.round(bearing(a,b)/45)%8];}
  function fmt(km){return km<0.975?`${Math.round(km*1000/50)*50} 米`:`${km.toFixed(km<10?1:0)} 公里`;}
  function selectedOptions(){return points.map(p=>`<option value="${p.id}">${esc(p.name)}${p.proxy?'（范围）':''}</option>`).join('');}
  $('#geo-from').innerHTML=selectedOptions();$('#geo-to').innerHTML=selectedOptions();$('#geo-from').value=from;$('#geo-to').value=to;
  $('#geo-filters').innerHTML=Object.entries(catNames).map(([id,label])=>`<button type="button" data-geo-filter="${id}" aria-pressed="${id==='all'}">${label}</button>`).join('');
  const noLocation=window.GUIDE.foodGroups.flatMap(g=>g.items).filter(f=>!['肖记片粉','勇记糯香干锅','三丁一体菜'].includes(f.name));
  $('#geo-unlocated-list').innerHTML=noLocation.map(f=>`<a href="${esc(search(f.map))}" target="_blank" rel="noopener noreferrer">${esc(f.name)} ↗</a>`).join('')+`<a href="${esc(search('德阳旌湖彩虹桥'))}" target="_blank" rel="noopener noreferrer">旌湖实际入口 ↗</a>`;
  function compare(){
    const a=byId(from),b=byId(to),same=a.id===b.id,km=distance(a,b),proxy=a.proxy||b.proxy;
    $('#geo-distance-text').innerHTML=same?'已选同一地点':`<strong>${esc(fmt(km))}</strong> 直线 · ${esc(b.short)}在${esc(a.short)}的${esc(direction(a,b))}方${proxy?'（含区域参考点）':''}`;
    const link=$('#geo-navigate');
    if(same){link.hidden=true;return;}link.hidden=false;
    if(proxy){const target=b.proxy?b:a;link.href=target.link;link.textContent='高德搜索实际入口 ↗';}
    else {const pair=p=>`${p.lon},${p.lat},${p.name}`;const q=new URLSearchParams({from:pair(a),to:pair(b),mode:'car',src:'deyang-travel-guide',callnative:'1'});link.href=`https://uri.amap.com/navigation?${q}`;link.textContent='打开高德导航 ↗';}
  }
  function renderList(){
    const origin=byId(from);const shown=points.filter(p=>category==='all'||p.cat===category);
    const area=points.filter(isInScope),visible=area.filter(p=>category==='all'||p.cat===category);$('#geo-count').textContent=`${{oldtown:'老城',city:'市区',region:'含广汉'}[scope]} ${visible.length} / ${area.length} 处`;
    $('#geo-list').innerHTML=shown.map(p=>{const same=p.id===from;const info=same?'当前起点':`${fmt(distance(origin,p))} · ${direction(origin,p)}方`;return `<button type="button" class="geo-list-item" data-geo-pick="${p.id}" aria-pressed="${selected===p.id}"><span class="geo-list-num cat-${p.cat}">${p.num}</span><span><strong>${esc(p.short)}${p.proxy?' · 范围':''}</strong><small>${!isInScope(p)?'图外 · ':''}${p.region?'广汉 · ':''}${esc(info)}</small></span><span class="geo-list-arr">↗</span></button>`;}).join('');
  }
  function renderPins(){
    const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;
    const candidates=points.filter(p=>isInScope(p)&&(category==='all'||p.cat===category));
    // Use all places in the chosen area as fixed bounds so filters do not distort geographic scale.
    const bounds=points.filter(isInScope);const ox=104.39,oy=31.13,kx=111.32*Math.cos(deg(31.13)),ky=111.32;
    const metric=p=>({x:(p.lon-ox)*kx,y:(p.lat-oy)*ky});
    const coords=bounds.map(metric),xmin=Math.min(...coords.map(p=>p.x)),xmax=Math.max(...coords.map(p=>p.x)),ymin=Math.min(...coords.map(p=>p.y)),ymax=Math.max(...coords.map(p=>p.y));
    const pad=40,scale=Math.min((w-2*pad)/Math.max(xmax-xmin,0.1),(h-2*pad)/Math.max(ymax-ymin,0.1));
    const x0=(w-(xmax-xmin)*scale)/2,y0=(h-(ymax-ymin)*scale)/2;
    const project=p=>{const m=metric(p);return {x:x0+(m.x-xmin)*scale,y:h-y0-(m.y-ymin)*scale};};
    const places=candidates.map(p=>({...p,...project(p)}));groups=[];
    // Merge connected nearby points: neighboring pins cannot split into misleading clusters.
    const parent=places.map((_,i)=>i),root=i=>{while(parent[i]!==i){parent[i]=parent[parent[i]];i=parent[i];}return i;};
    for(let i=0;i<places.length;i++)for(let j=i+1;j<places.length;j++)if(Math.hypot(places[i].x-places[j].x,places[i].y-places[j].y)<32)parent[root(i)]=root(j);
    const components=new Map();places.forEach((p,i)=>{const key=root(i);if(!components.has(key))components.set(key,[]);components.get(key).push(p);});
    groups=[...components.values()].map(items=>({items,x:items.reduce((s,p)=>s+p.x,0)/items.length,y:items.reduce((s,p)=>s+p.y,0)/items.length}));
    const a=byId(from),b=byId(to),aVis=isInScope(a)&&(category==='all'||a.cat===category),bVis=isInScope(b)&&(category==='all'||b.cat===category);
    let line='';if(aVis&&bVis&&a.id!==b.id){const pa=project(a),pb=project(b);line=`<line x1="${pa.x/w*1000}" y1="${pa.y/h*1000}" x2="${pb.x/w*1000}" y2="${pb.y/h*1000}" stroke="#be8c65" stroke-width="3" stroke-dasharray="10 8" vector-effect="non-scaling-stroke"/>`;}
    lines.innerHTML=line+places.map(p=>`<circle cx="${p.x/w*1000}" cy="${p.y/h*1000}" r="3.5" fill="#315844" vector-effect="non-scaling-stroke"/>`).join('');
    const used=[];
    pins.innerHTML=groups.map((g,i)=>{
      const label=g.items.length===1?g.items[0].num:`${g.items.length}点`,names=g.items.map(p=>p.name).join('、'),chosen=g.items.some(p=>p.id===selected||p.id===to);
      const title=g.items.length===1?g.items[0].short:`${g.items[0].short}等${g.items.length}处`,tw=Math.min(110,title.length*10+10),th=20;
      const candidates=[[g.x+19,g.y-10],[g.x-19-tw,g.y-10],[g.x-tw/2,g.y+18],[g.x-tw/2,g.y-18-th]];
      const labelBox=candidates.map(([x,y])=>({x,y,w:tw,h:th})).find(r=>r.x>=8&&r.y>=8&&r.x+r.w<=w-8&&r.y+r.h<=h-8&&!used.some(q=>r.x<q.x+q.w+3&&r.x+r.w+3>q.x&&r.y<q.y+q.h+3&&r.y+r.h+3>q.y)&&!groups.some(other=>other!==g&&other.x>r.x-12&&other.x<r.x+r.w+12&&other.y>r.y-12&&other.y<r.y+r.h+12));
      if(labelBox)used.push(labelBox);
      const text=labelBox?`<span class="geo-pin-name" style="left:${labelBox.x/w*100}%;top:${labelBox.y/h*100}%">${esc(title)}</span>`:'';
      return `${text}<button type="button" class="geo-pin ${g.items.length>1?'is-cluster':`cat-${g.items[0].cat}`} ${chosen?'is-selected':''}" data-geo-cluster="${i}" style="left:${g.x/w*100}%;top:${g.y/h*100}%" aria-label="${esc(names)}${g.items.length>1?'，点击展开':''}">${esc(label)}</button>`;
    }).join('');
    const km=scope==='region'?5:scope==='oldtown'?.5:1;$('#geo-scale-bar').style.width=`${Math.max(10,km*scale)}px`;$('#geo-scale-text').textContent=`约 ${km} 公里`;
  }
  function render(){
    $$('[data-geo-scope]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.geoScope===scope)));
    $$('[data-geo-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.geoFilter===category)));
    compare();renderList();renderPins();
  }
  function detail(id){const p=byId(id);selected=id;to=id;$('#geo-to').value=id;showPoint(p);$('#geo-cluster').innerHTML=`<div class="geo-detail"><div><strong>${p.num} · ${esc(p.name)}</strong><p>${esc(p.note)}</p><a href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">坐标资料 ↗</a></div><a href="${esc(p.link)}" target="_blank" rel="noopener noreferrer">高德查看 ↗</a></div>`;render();}
  $('#geo-pins').addEventListener('click',e=>{const b=e.target.closest('[data-geo-cluster]');if(!b)return;const g=groups[Number(b.dataset.geoCluster)];if(!g)return;if(g.items.length===1){detail(g.items[0].id);return;}$('#geo-cluster').innerHTML=`<strong>这几处位置靠近，请选一个：</strong><div class="geo-cluster-buttons">${g.items.map(p=>`<button type="button" data-geo-pick="${p.id}">${p.num} ${esc(p.short)}</button>`).join('')}</div>`;});
  $('#geo-cluster').addEventListener('click',e=>{const b=e.target.closest('[data-geo-pick]');if(b)detail(b.dataset.geoPick);});
  $('#geo-list').addEventListener('click',e=>{const b=e.target.closest('[data-geo-pick]');if(b){detail(b.dataset.geoPick);requestAnimationFrame(()=>$('#geo-cluster').scrollIntoView({behavior:document.body.classList.contains('reduce-motion')?'auto':'smooth',block:'center'}));}});
  $$('[data-geo-scope]').forEach(b=>b.addEventListener('click',()=>{scope=b.dataset.geoScope;render();}));
  $('#geo-filters').addEventListener('click',e=>{const b=e.target.closest('[data-geo-filter]');if(b){category=b.dataset.geoFilter;render();}});
  $('#geo-from').addEventListener('change',e=>{from=e.target.value;showPoint(byId(from));render();});
  $('#geo-to').addEventListener('change',e=>detail(e.target.value));
  $('#geo-show-map').addEventListener('click',()=>document.querySelector('.map-toolbar').scrollIntoView({behavior:document.body.classList.contains('reduce-motion')?'auto':'smooth',block:'start'}));
  $('#geo-swap').addEventListener('click',()=>{[from,to]=[to,from];$('#geo-from').value=from;$('#geo-to').value=to;showPoint(byId(from));detail(to);});
  if('ResizeObserver' in window)new ResizeObserver(()=>renderPins()).observe(canvas);
  window.addEventListener('resize',renderPins);
  $$('[data-nav="map"],[data-open-page="map"],[data-page-link="map"]').forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(renderPins)));
  render();requestAnimationFrame(renderPins);
})();
