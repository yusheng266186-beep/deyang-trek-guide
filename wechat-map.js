(() => {
  'use strict';
  const ua=navigator.userAgent;
  const isWechat=/MicroMessenger/i.test(ua),isAndroid=/Android/i.test(ua),isIOS=/iPhone|iPad|iPod/i.test(ua);
  const $=s=>document.querySelector(s),dialog=$('#wechat-map-dialog'),qq=$('#wechat-map-qq'),web=$('#wechat-map-web'),native=$('#wechat-map-native'),copyBrowser=$('#wechat-map-copy-browser'),nav=$('#wechat-map-nav'),alternate=$('#wechat-map-alternate'),input=$('#wechat-map-url'),status=$('#wechat-map-status'),shareDialog=$('#wechat-share-dialog');
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
  function appLink(d,forRoute=d.isRoute){
    const direct=nativeLink(d,forRoute);if(!direct)return '';
    if(!isAndroid)return direct;
    const u=new URL(direct);return `intent://${u.hostname}${u.pathname}${u.search}#Intent;scheme=${u.protocol.slice(0,-1)};package=com.autonavi.minimap;end`;
  }
  function browserLink(d){const u=new URL(location.href);u.searchParams.set('amap_open',d.u.href);return u;}
  function clearPending(){const u=new URL(location.href);if(u.searchParams.has('amap_open')){u.searchParams.delete('amap_open');history.replaceState(null,'',u);}}
  function openDialog(d){document.body.classList.add('has-open-wechat');if(typeof d.showModal==='function')d.showModal();else d.setAttribute('open','');}
  function closeDialog(d,opener){if(d.close&&d.open)d.close();else{d.removeAttribute('open');if(d===dialog)clearPending();if(!dialog.open&&!shareDialog.open)document.body.classList.remove('has-open-wechat');opener?.focus({preventScroll:true});}}
  async function copyText(value,field,message,success='已复制，可粘贴后使用。'){try{await navigator.clipboard.writeText(value);message.textContent=success;}catch(_){field.hidden=false;field.value=value;field.focus();field.select();let ok=false;try{ok=document.execCommand('copy');}catch(_){}message.textContent=ok?success:'请长按上方内容复制。';}}
  function guideShareLink(d){const u=new URL(location.href);u.searchParams.delete('amap_open');u.searchParams.delete('place');u.searchParams.set('maplink',d.u.href);u.hash='map';return u;}
  function showOptions(a,u){
    trigger=a;const d=details(u.href);active=d;destination=d.name;copyUrl=guideShareLink(d).href;web.href=mapLink(u.href,false);
    web.textContent=isWechat?'在微信内查看高德网页 ↗':'在高德网页查看 ↗';web.target=isWechat?'_self':'_blank';
    const route=qqRoute(d);qq.hidden=!route;if(route)qq.href=route;
    const direct=nativeLink(d),mobile=isAndroid||isIOS,app=appLink(d),routeApp=appLink(d,true);
    const action=d.isRoute?'路线':direct?.includes('://poi/detail')?'地点详情':'地点搜索';
    copyBrowser.hidden=!(isWechat&&mobile&&direct);native.hidden=isWechat||!mobile||!app;
    if(!native.hidden){native.href=app;native.textContent=`在高德 App 打开${action} ↗`;}
    alternate.hidden=isWechat||!isAndroid||!direct;if(!alternate.hidden)alternate.href=direct;
    nav.hidden=isWechat||!mobile||d.isRoute||!d.target||!routeApp;if(!nav.hidden){nav.href=routeApp;nav.textContent='在高德 App 中导航 ↗';}
    const showWechatGuide=Boolean(isWechat&&mobile&&direct);
    dialog.classList.toggle('is-wechat-guide',showWechatGuide);$('#wechat-browser-instructions').hidden=!showWechatGuide;$('#wechat-map-title').textContent=showWechatGuide?'在浏览器中打开':'选择地图打开方式';$('#wechat-map-note').hidden=showWechatGuide;
    if(showWechatGuide){history.replaceState(null,'',browserLink(d));}
    $('#wechat-map-note').textContent=isWechat&&mobile&&direct?'点微信右上角「···」→「在浏览器打开」，再在此卡片中打开高德 App。':isWechat?'可在微信中查看高德网页或分享。':mobile&&direct?'请确认已安装高德；如果浏览器询问，请选择允许。':'可查看高德网页或分享链接。';
    $('#wechat-map-destination').textContent=d.start&&d.name?`${d.start.name||'起点'} → ${d.name}`:destination?`地点：${destination}`:'高德网页链接';
    $('#wechat-map-copy-name').hidden=!destination;$('.wechat-more').open=false;input.hidden=true;status.textContent='';openDialog(dialog);
    requestAnimationFrame(()=>{(showWechatGuide?$('#wechat-map-title'):!native.hidden?native:web).focus({preventScroll:true});});
  }
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href]');if(!a||dialog.contains(a)||shareDialog.contains(a)||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    let u;try{u=new URL(a.href,location.href);}catch(_){return;}
    if(!isAmap(u))return;
    e.preventDefault();showOptions(a,u);
  },true);
  $('.wechat-close').addEventListener('click',()=>closeDialog(dialog,trigger));
  dialog.addEventListener('close',()=>{clearPending();if(!shareDialog.open)document.body.classList.remove('has-open-wechat');trigger?.focus({preventScroll:true});});
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(dialog,trigger);});
  copyBrowser.addEventListener('click',()=>{if(active)copyText(browserLink(active).href,input,status,'链接已复制，请粘贴到手机浏览器打开。');});
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
  const pending=new URL(location.href).searchParams.get('amap_open');
  if(pending&&pending.length<4000){try{const u=new URL(pending);if(isAmap(u))requestAnimationFrame(()=>{if(!dialog.open&&!shareDialog.open)showOptions(null,u);});else clearPending();}catch(_){clearPending();}}
  const shared=new URL(location.href).searchParams.get('maplink');
  if(shared&&shared.length<4000){try{const u=new URL(shared);if(isAmap(u)){const d=details(u.href);$('#shared-map-label').textContent=d.start&&d.name?`${d.start.name||'起点'} → ${d.name}`:d.name||'高德地图链接';$('#shared-map-link').href=u.href;$('#shared-map-route').hidden=false;}}catch(_){}}
})();
