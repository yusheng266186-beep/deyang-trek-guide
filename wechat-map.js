(() => {
  'use strict';
  const ua=navigator.userAgent;
  const isWechat=/MicroMessenger/i.test(ua),isAndroid=/Android/i.test(ua),isIOS=/iPhone|iPad|iPod/i.test(ua);
  const $=s=>document.querySelector(s),dialog=$('#wechat-map-dialog'),qq=$('#wechat-map-qq'),web=$('#wechat-map-web'),native=$('#wechat-map-native'),bridge=$('#wechat-map-bridge'),nav=$('#wechat-map-nav'),input=$('#wechat-map-url'),status=$('#wechat-map-status'),shareDialog=$('#wechat-share-dialog');
  let trigger=null,active=null,copyUrl='',destination='',shareTrigger=null,shareUrl='';
  const isAmap=u=>u.protocol==='https:'&&/(^|\.)amap\.com$/i.test(u.hostname)&&!u.username&&!u.password;
  const parts=s=>{if(!s)return null;const a=s.split(','),lon=Number(a[0]),lat=Number(a[1]);return a.length>=2&&Number.isFinite(lon)&&Number.isFinite(lat)&&Math.abs(lon)<=180&&Math.abs(lat)<=90?{lon,lat,name:a.slice(2).join(',')}:null;};
  const poiId=u=>u.pathname.match(/^\/place\/([^/]+)/i)?.[1]||u.searchParams.get('poiid')||u.searchParams.get('id')||'';
  const clean=s=>String(s||'').replace(/[\s·・()（）]/g,'').toLowerCase();
  function mapLink(raw,launch){
    const url=new URL(raw,location.href),id=url.pathname.match(/^\/place\/([^/]+)/i)?.[1];
    if(id&&url.hostname!=='uri.amap.com')return `https://uri.amap.com/marker?${new URLSearchParams({poiid:id,src:'deyang-travel-guide',callnative:launch?'1':'0'})}`;
    if(url.hostname==='uri.amap.com'&&/^\/(navigation|search|marker)\/?$/i.test(url.pathname))url.searchParams.set('callnative',launch?'1':'0');
    return url.href;
  }
  function details(raw){
    const u=new URL(raw,location.href),points=window.GUIDE_MAP_POINTS||[],id=poiId(u),keyword=u.searchParams.get('keyword')||'',start=parts(u.searchParams.get('from')),end=parts(u.searchParams.get('to'));
    const p=points.find(x=>{const link=new URL(x.link,location.href),source=new URL(x.source,location.href);return (id&&(id===poiId(link)||id===poiId(source)))||(!id&&keyword&&clean(keyword)===clean(link.searchParams.get('keyword')));});
    const name=end?.name||keyword||(p?p.name:'')||u.searchParams.get('name')||'';
    const target=end||(p&&!p.proxy?{lat:p.lat,lon:p.lon,name:p.name}:null),mode=u.searchParams.get('mode')||u.searchParams.get('type');
    const isRoute=/^\/(navigation|ssr\/embed\/dir)\/?$/i.test(u.pathname);
    return {u,p,start,target,name,mode,isRoute};
  }
  function qqRoute(d){
    if(!d.name)return '';const q=new URLSearchParams({type:d.mode==='walk'?'walk':d.mode==='bus'?'bus':'drive',to:d.name,referer:'deyang-travel-guide'});
    if(d.target)q.set('tocoord',`${d.target.lat},${d.target.lon}`);if(d.start){q.set('from',d.start.name||'起点');q.set('fromcoord',`${d.start.lat},${d.start.lon}`);}return `https://apis.map.qq.com/uri/v1/routeplan?${q}`;
  }
  function nativeLink(d,forRoute=d.isRoute){
    if(forRoute&&d.target){
      const q=new URLSearchParams({sourceApplication:'deyang-travel-guide',dlat:String(d.target.lat),dlon:String(d.target.lon),dname:d.name||'目的地',dev:'0',t:d.mode==='walk'?'2':d.mode==='bus'?'1':d.mode==='ride'?'3':'0'});
      if(d.start){q.set('slat',d.start.lat);q.set('slon',d.start.lon);q.set('sname',d.start.name||'起点');}
      return `${isIOS?'iosamap://path':'amapuri://route/plan/'}?${q}`;
    }
    if(!d.name)return '';
    if(!isIOS&&d.target&&poiId(d.u)){const q=new URLSearchParams({poiname:d.p?.name||d.name,lat:String(d.target.lat),lon:String(d.target.lon),poiid:poiId(d.u)});return `amapuri://poi/detail?${q}`;}
    return isIOS?`iosamap://poi?${new URLSearchParams({sourceApplication:'deyang-travel-guide',name:d.name,dev:'0'})}`:`androidamap://poi?${new URLSearchParams({sourceApplication:'deyang-travel-guide',keywords:d.name,dev:'0'})}`;
  }
  function handoffLink(raw,d,forRoute=d.isRoute){const handoff=new URL('open-map.html',location.href),direct=nativeLink(d,forRoute);handoff.searchParams.set('v','15');handoff.searchParams.set('target',mapLink(raw,false));if(direct)handoff.searchParams.set('native',direct);if(d.name)handoff.searchParams.set('name',d.name);return handoff.href;}
  function openDialog(d){document.body.classList.add('has-open-wechat');if(typeof d.showModal==='function')d.showModal();else d.setAttribute('open','');}
  function closeDialog(d,opener){if(d.close&&d.open)d.close();else{d.removeAttribute('open');if(!dialog.open&&!shareDialog.open)document.body.classList.remove('has-open-wechat');opener?.focus({preventScroll:true});}}
  async function copyText(value,field,message){try{await navigator.clipboard.writeText(value);message.textContent='已复制，可粘贴后使用。';}catch(_){field.hidden=false;field.value=value;field.focus();field.select();let ok=false;try{ok=document.execCommand('copy');}catch(_){}message.textContent=ok?'已复制，可粘贴后使用。':'请长按上方内容复制。';}}
  function guideShareLink(d){const u=new URL(location.href);u.searchParams.delete('place');u.searchParams.set('maplink',d.u.href);u.hash='map';return u;}
  function showOptions(a,u){
    trigger=a;const d=details(u.href);active=d;destination=d.name;copyUrl=guideShareLink(d).href;web.href=mapLink(u.href,false);
    web.textContent=isWechat?'在微信内查看高德网页 ↗':'在高德网页查看 ↗';web.target=isWechat?'_self':'_blank';
    const route=qqRoute(d);qq.hidden=!route;if(route)qq.href=route;
    const direct=nativeLink(d),mobile=isAndroid||isIOS;
    const action=d.isRoute?'路线':direct?.includes('://poi/detail')?'地点详情':'地点搜索';
    bridge.hidden=!(isWechat&&mobile&&direct);native.hidden=isWechat||!mobile||!direct;
    if(!bridge.hidden){bridge.href=handoffLink(u.href,d);bridge.textContent=`在浏览器继续 · ${action} ↗`;}
    if(!native.hidden){native.href=handoffLink(u.href,d);native.textContent=`在高德 App 打开${action} ↗`;}
    nav.hidden=!(mobile&&!d.isRoute&&d.target);if(!nav.hidden){nav.href=handoffLink(u.href,d,true);nav.textContent=isWechat?'在浏览器中打开 App 导航 ↗':'在高德 App 中导航 ↗';}
    $('#wechat-map-note').textContent=isWechat&&direct?'微信可能拦截 App 跳转。点击下方按钮后，在微信右上角「···」选择“在浏览器打开”，再打开高德。':isWechat?'当前内容可在微信中查看高德网页或分享。':mobile&&direct?'在浏览器继续后，可选择打开已安装的高德 App。':'可查看高德网页或分享链接。';
    $('#wechat-map-destination').textContent=d.start&&d.name?`${d.start.name||'起点'} → ${d.name}`:destination?`地点：${destination}`:'高德网页链接';
    $('#wechat-map-copy-name').hidden=!destination;$('.wechat-more').open=false;input.hidden=true;status.textContent='';openDialog(dialog);
    requestAnimationFrame(()=>{(!bridge.hidden?bridge:!native.hidden?native:web).focus({preventScroll:true});});
  }
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href]');if(!a||dialog.contains(a)||shareDialog.contains(a)||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    let u;try{u=new URL(a.href,location.href);}catch(_){return;}
    if(!isAmap(u))return;
    e.preventDefault();showOptions(a,u);
  },true);
  $('.wechat-close').addEventListener('click',()=>closeDialog(dialog,trigger));
  dialog.addEventListener('close',()=>{if(!shareDialog.open)document.body.classList.remove('has-open-wechat');trigger?.focus({preventScroll:true});});
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(dialog,trigger);});
  $('#wechat-map-copy').addEventListener('click',()=>copyText(copyUrl,input,status));$('#wechat-map-copy-name').addEventListener('click',()=>copyText(destination,input,status));
  $('#wechat-map-share').addEventListener('click',async()=>{
    if(!active)return;const u=guideShareLink(active);
    const label=active.start&&active.name?`${active.start.name||'起点'} → ${active.name}`:active.name||'高德地图链接';
    if(isWechat){history.replaceState(null,'',u);closeDialog(dialog,trigger);requestAnimationFrame(()=>document.dispatchEvent(new CustomEvent('guide:share-in-wechat',{detail:{url:u.href}})));return;}
    try{if(navigator.share){await navigator.share({title:label+' · 德阳旅行',url:u.href});return;}await copyText(u.href,input,status);}catch(e){if(e.name!=='AbortError')await copyText(u.href,input,status);}
  });
  document.addEventListener('guide:share-in-wechat',e=>{shareTrigger=document.activeElement;shareUrl=e.detail.url;$('#wechat-share-url').hidden=true;$('#wechat-share-status').textContent='';openDialog(shareDialog);requestAnimationFrame(()=>$('#wechat-share-copy').focus({preventScroll:true}));});
  $('.wechat-share-close').addEventListener('click',()=>closeDialog(shareDialog,shareTrigger));shareDialog.addEventListener('close',()=>{if(!dialog.open)document.body.classList.remove('has-open-wechat');shareTrigger?.focus({preventScroll:true});});
  shareDialog.addEventListener('click',e=>{if(e.target!==shareDialog)return;const r=shareDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(shareDialog,shareTrigger);});
  $('#wechat-share-copy').addEventListener('click',()=>copyText(shareUrl,$('#wechat-share-url'),$('#wechat-share-status')));
  const shared=new URL(location.href).searchParams.get('maplink');
  if(shared&&shared.length<4000){try{const u=new URL(shared);if(isAmap(u)){const d=details(u.href);$('#shared-map-label').textContent=d.start&&d.name?`${d.start.name||'起点'} → ${d.name}`:d.name||'高德地图链接';$('#shared-map-link').href=u.href;$('#shared-map-route').hidden=false;}}catch(_){}}
})();
