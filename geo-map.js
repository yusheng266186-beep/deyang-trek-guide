(() => {
  'use strict';
  const $ = (s,root=document) => root.querySelector(s);
  const $$ = (s,root=document) => [...root.querySelectorAll(s)];
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
  window.GUIDE_MAP_POINTS=points;
  let category='all',from='wenmiao',to='stone',selected='';
  const deg=n=>n*Math.PI/180;
  function distance(a,b){const dlat=deg(b.lat-a.lat),dlon=deg(b.lon-a.lon),v=Math.sin(dlat/2)**2+Math.cos(deg(a.lat))*Math.cos(deg(b.lat))*Math.sin(dlon/2)**2;return 6371*2*Math.asin(Math.min(1,Math.sqrt(v)));}
  function bearing(a,b){const y=Math.sin(deg(b.lon-a.lon))*Math.cos(deg(b.lat));const x=Math.cos(deg(a.lat))*Math.sin(deg(b.lat))-Math.sin(deg(a.lat))*Math.cos(deg(b.lat))*Math.cos(deg(b.lon-a.lon));return (Math.atan2(y,x)*180/Math.PI+360)%360;}
  function direction(a,b){return ['北','东北','东','东南','南','西南','西','西北'][Math.round(bearing(a,b)/45)%8];}
  function fmt(km){return km<0.975?`${Math.round(km*1000/50)*50} 米`:`${km.toFixed(km<10?1:0)} 公里`;}
  function showOnMap(p){document.dispatchEvent(new CustomEvent('guide:locate',{detail:p}));}
  const picker=$('#geo-place-picker'),pickerOptions=$('#place-options');let pickerFor='from',pickerTrigger=null;
  function updatePickers(){for(const [side,id] of [['from',from],['to',to]]){const button=$(`#geo-${side}`),p=byId(id);$('.geo-select-value',button).textContent=p.name+(p.proxy?' · 范围':'');button.setAttribute('aria-label',`${side==='from'?'选择起点':'选择终点'}，当前${p.name}${p.proxy?'，范围参考':''}`);}}
  function openPicker(side){
    pickerFor=side;pickerTrigger=$(`#geo-${side}`);pickerTrigger.setAttribute('aria-expanded','true');const current=side==='from'?from:to;
    $('#place-picker-title').textContent=side==='from'?'从哪里出发？':'想去哪里？';
    pickerOptions.innerHTML=['sight','food','stay','transport'].map(cat=>`<section class="picker-group"><h3>${esc(catNames[cat])}</h3>${points.filter(p=>p.cat===cat).map(p=>`<button type="button" class="place-option" data-place-option="${p.id}" aria-pressed="${p.id===current}"><span class="picker-num cat-${p.cat}">${p.num}</span><span class="picker-name"><strong>${esc(p.name)}</strong><small>${p.proxy?'区域参考，入口需再确认':p.region?'广汉 · 跨城备选':esc(catNames[p.cat]+' · 德阳市区')}</small></span><span class="picker-check" aria-hidden="true">${p.id===current?'✓':''}</span></button>`).join('')}</section>`).join('');
    document.body.classList.add('has-open-picker');if(typeof picker.showModal==='function')picker.showModal();else picker.setAttribute('open','');
    const active=$('[aria-pressed="true"]',pickerOptions);requestAnimationFrame(()=>{active?.focus({preventScroll:true});active?.scrollIntoView({block:'nearest'});});
  }
  function closePicker(){if(typeof picker.close==='function'&&picker.open)picker.close();else{picker.removeAttribute('open');document.body.classList.remove('has-open-picker');pickerTrigger?.setAttribute('aria-expanded','false');pickerTrigger?.focus({preventScroll:true});}}
  $('#geo-from').addEventListener('click',()=>openPicker('from'));$('#geo-to').addEventListener('click',()=>openPicker('to'));
  $('.picker-close').addEventListener('click',closePicker);
  picker.addEventListener('close',()=>{document.body.classList.remove('has-open-picker');pickerTrigger?.setAttribute('aria-expanded','false');pickerTrigger?.focus({preventScroll:true});});
  picker.addEventListener('click',e=>{const r=picker.getBoundingClientRect();if(e.target===picker&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))closePicker();});
  pickerOptions.addEventListener('click',e=>{const b=e.target.closest('[data-place-option]');if(!b)return;const p=byId(b.dataset.placeOption);if(pickerFor==='from'){from=p.id;if(category!=='all'&&category!==p.cat)category='all';showOnMap(p);render();}else detail(p.id);closePicker();});
  pickerOptions.addEventListener('keydown',e=>{if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;const opts=$$('[data-place-option]',pickerOptions),i=opts.indexOf(document.activeElement);if(i<0)return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?opts.length-1:e.key==='ArrowDown'?Math.min(i+1,opts.length-1):Math.max(i-1,0);opts[next].focus();});
  $('#geo-filters').innerHTML=Object.entries(catNames).map(([id,label])=>`<button type="button" data-geo-filter="${id}" aria-pressed="${id==='all'}">${label}</button>`).join('');
  $('#native-filters').innerHTML=Object.entries(catNames).map(([id,label])=>`<button type="button" data-native-filter="${id}" class="filter-${id}" aria-pressed="${id==='all'}">${id==='all'?'':'<span aria-hidden="true"></span>'}${label}</button>`).join('');
  const noLocation=window.GUIDE.foodGroups.flatMap(g=>g.items).filter(f=>!['肖记片粉','勇记糯香干锅','三丁一体菜'].includes(f.name));
  $('#geo-unlocated-list').innerHTML=noLocation.map(f=>`<a href="${esc(search(f.map))}" target="_blank" rel="noopener noreferrer">${esc(f.name)} ↗</a>`).join('')+`<a href="${esc(search('德阳旌湖彩虹桥'))}" target="_blank" rel="noopener noreferrer">旌湖实际入口 ↗</a>`;
  function compare(){
    const a=byId(from),b=byId(to),same=a.id===b.id,km=distance(a,b),proxy=a.proxy||b.proxy;
    $('#geo-distance-text').innerHTML=same?'已选同一地点':`<strong>${esc(fmt(km))}</strong> 直线 · ${esc(b.short)}在${esc(a.short)}的${esc(direction(a,b))}方${proxy?'（含区域参考点）':''}`;
    const link=$('#geo-navigate'),view=$('#geo-show-route');link.hidden=same;view.hidden=same||proxy;
    if(same)return;
    if(proxy){const target=b.proxy?b:a;link.href=target.link;link.textContent='高德搜索实际入口 ↗';}
    else{const pair=p=>`${p.lon},${p.lat},${p.name}`;const q=new URLSearchParams({from:pair(a),to:pair(b),mode:'car',src:'deyang-travel-guide',callnative:'1'});link.href=`https://uri.amap.com/navigation?${q}`;link.textContent='打开高德导航 ↗';}
  }
  function render(){
    $$('[data-geo-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.geoFilter===category)));$$('[data-native-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.nativeFilter===category)));updatePickers();compare();
    const origin=byId(from),shown=points.filter(p=>category==='all'||p.cat===category);$('#geo-count').textContent=`${shown.length} 处参考`;
    $('#native-places').innerHTML=shown.map(p=>`<button type="button" class="native-place" data-native-place="${p.id}" aria-pressed="${selected===p.id}"><span class="geo-list-num cat-${p.cat}">${p.num}</span><span>${esc(p.short)}${p.proxy?' · 范围':''}</span></button>`).join('');
    $('#geo-list').innerHTML=shown.map(p=>{const same=p.id===from,info=same?'当前起点':`${fmt(distance(origin,p))} · ${direction(origin,p)}方`;return `<button type="button" class="geo-list-item" data-geo-pick="${p.id}" aria-pressed="${selected===p.id}"><span class="geo-list-num cat-${p.cat}">${p.num}</span><span><strong>${esc(p.short)}${p.proxy?' · 范围':''}</strong><small>${p.region?'广汉 · ':''}${esc(info)}</small></span><span class="geo-list-arr">↗</span></button>`;}).join('');
  }
  function detail(id){const p=byId(id);selected=id;to=id;if(category!=='all'&&category!==p.cat)category='all';$('#geo-cluster').innerHTML=`<div class="geo-detail"><div><strong>${p.num} · ${esc(p.name)}</strong><p>${esc(p.note)}</p><a href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">位置资料 ↗</a></div><a href="${esc(p.link)}" target="_blank" rel="noopener noreferrer">高德查看 ↗</a></div>`;showOnMap(p);render();}
  $('#geo-list').addEventListener('click',e=>{const b=e.target.closest('[data-geo-pick]');if(!b)return;detail(b.dataset.geoPick);requestAnimationFrame(()=>$('#native-map-panel').scrollIntoView({behavior:document.body.classList.contains('reduce-motion')?'auto':'smooth',block:'start'}));});
  $('#geo-filters').addEventListener('click',e=>{const b=e.target.closest('[data-geo-filter]');if(!b)return;category=b.dataset.geoFilter;document.dispatchEvent(new CustomEvent('guide:filter',{detail:{category}}));render();});
  $('#native-filters').addEventListener('click',e=>{const b=e.target.closest('[data-native-filter]');if(!b)return;category=b.dataset.nativeFilter;selected='';document.dispatchEvent(new CustomEvent('guide:filter',{detail:{category}}));render();});
  $('#native-places').addEventListener('click',e=>{const b=e.target.closest('[data-native-place]');if(b)detail(b.dataset.nativePlace);});
  $('#geo-swap').addEventListener('click',()=>{[from,to]=[to,from];detail(to);});
  $('#geo-show-route').addEventListener('click',()=>{const a=byId(from),b=byId(to);if(a.proxy||b.proxy||a.id===b.id)return;document.dispatchEvent(new CustomEvent('guide:route',{detail:{from:a,to:b}}));requestAnimationFrame(()=>$('#native-map-panel').scrollIntoView({behavior:document.body.classList.contains('reduce-motion')?'auto':'smooth',block:'start'}));});
  render();
})();
