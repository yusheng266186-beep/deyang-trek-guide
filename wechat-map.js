(() => {
  'use strict';
  if(!/MicroMessenger/i.test(navigator.userAgent))return;
  const $=s=>document.querySelector(s),dialog=$('#wechat-map-dialog'),qq=$('#wechat-map-qq'),web=$('#wechat-map-web'),native=$('#wechat-map-native'),bridge=$('#wechat-map-bridge'),copy=$('#wechat-map-copy'),input=$('#wechat-map-url'),status=$('#wechat-map-status'),shareDialog=$('#wechat-share-dialog');
  let trigger=null,copyUrl='',destination='',shareTrigger=null,shareUrl='';
  const parts=s=>{if(!s)return null;const a=s.split(','),lon=Number(a[0]),lat=Number(a[1]);return a.length>=2&&Number.isFinite(lon)&&Number.isFinite(lat)&&Math.abs(lon)<=180&&Math.abs(lat)<=90?{lon,lat,name:a.slice(2).join(',')}:null;};
  function mapLink(raw,launch){const url=new URL(raw,location.href),id=url.pathname.match(/^\/place\/([^/]+)/)?.[1];if(id&&url.hostname!=='uri.amap.com')return `https://uri.amap.com/marker?${new URLSearchParams({poiid:id,src:'deyang-travel-guide',callnative:launch?'1':'0'})}`;if(url.hostname==='uri.amap.com')url.searchParams.set('callnative',launch?'1':'0');return url.href;}
  function details(raw){
    const u=new URL(raw,location.href),points=window.GUIDE_MAP_POINTS||[],p=points.find(x=>x.link===u.href),start=parts(u.searchParams.get('from')),end=parts(u.searchParams.get('to'));
    const name=end?.name||(p&&!p.proxy?p.name:'')||u.searchParams.get('keyword')||(p?p.name:'');
    const target=end||(p&&!p.proxy?{lat:p.lat,lon:p.lon,name:p.name}:null),mode=u.searchParams.get('mode')||u.searchParams.get('type');
    return {u,p,start,target,name,mode};
  }
  function qqRoute(d){
    if(!d.name)return '';const q=new URLSearchParams({type:d.mode==='walk'?'walk':d.mode==='bus'?'bus':'drive',to:d.name,referer:'deyang-travel-guide'});
    if(d.target)q.set('tocoord',`${d.target.lat},${d.target.lon}`);if(d.start){q.set('from',d.start.name||'起点');q.set('fromcoord',`${d.start.lat},${d.start.lon}`);}return `https://apis.map.qq.com/uri/v1/routeplan?${q}`;
  }
  function nativeLink(d){
    if(d.target){const q=new URLSearchParams({sourceApplication:'deyang-travel-guide',dlat:String(d.target.lat),dlon:String(d.target.lon),dname:d.name||'目的地',dev:'0',t:d.mode==='walk'?'2':d.mode==='bus'?'1':d.mode==='ride'?'3':'0'});if(d.start){q.set('slat',d.start.lat);q.set('slon',d.start.lon);q.set('sname',d.start.name||'起点');}return `androidamap://route?${q}`;}
    return d.name?`androidamap://poi?${new URLSearchParams({sourceApplication:'deyang-travel-guide',keywords:d.name,dev:'0'})}`:'';
  }
  function openDialog(d){document.body.classList.add('has-open-wechat');if(typeof d.showModal==='function')d.showModal();else d.setAttribute('open','');}
  function closeDialog(d,opener){if(d.close&&d.open)d.close();else{d.removeAttribute('open');document.body.classList.remove('has-open-wechat');opener?.focus({preventScroll:true});}}
  async function copyText(value,field,message){try{await navigator.clipboard.writeText(value);message.textContent='已复制，可粘贴后使用。';}catch(_){field.hidden=false;field.value=value;field.focus();field.select();let ok=false;try{ok=document.execCommand('copy');}catch(_){}message.textContent=ok?'已复制，可粘贴后使用。':'请长按上方内容复制。';}}
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href]');if(!a||dialog.contains(a)||shareDialog.contains(a)||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    let u;try{u=new URL(a.href,location.href);}catch(_){return;}
    if(!/(^|\.)amap\.com$/i.test(u.hostname)||!/^\/(navigation|search|marker|place(?:\/|$)|ssr\/(?:place|dir))/i.test(u.pathname))return;
    e.preventDefault();trigger=a;const d=details(u.href);destination=d.name;copyUrl=mapLink(u.href,true);web.href=mapLink(u.href,false);
    const route=qqRoute(d);qq.hidden=!route;if(route)qq.href=route;
    const direct=nativeLink(d);native.hidden=!/Android/i.test(navigator.userAgent)||!direct;if(!native.hidden)native.href=direct;
    const handoff=new URL('open-map.html',location.href);handoff.searchParams.set('v','11');handoff.searchParams.set('target',copyUrl);if(direct)handoff.searchParams.set('native',direct);if(destination)handoff.searchParams.set('name',destination);bridge.href=handoff.href;
    $('#wechat-map-destination').textContent=destination?`目的地：${destination}`:'选择合适的打开方式';$('#wechat-map-copy-name').hidden=!destination;$('.wechat-more').open=false;input.hidden=true;status.textContent='';openDialog(dialog);requestAnimationFrame(()=>{(native.hidden?bridge:native).focus({preventScroll:true});});
  },true);
  $('.wechat-close').addEventListener('click',()=>closeDialog(dialog,trigger));dialog.addEventListener('close',()=>{document.body.classList.remove('has-open-wechat');trigger?.focus({preventScroll:true});});
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(dialog,trigger);});
  copy.addEventListener('click',()=>copyText(copyUrl,input,status));$('#wechat-map-copy-name').addEventListener('click',()=>copyText(destination,input,status));
  document.addEventListener('guide:share-in-wechat',e=>{shareTrigger=document.activeElement;shareUrl=e.detail.url;$('#wechat-share-url').hidden=true;$('#wechat-share-status').textContent='';openDialog(shareDialog);requestAnimationFrame(()=>$('#wechat-share-copy').focus({preventScroll:true}));});
  $('.wechat-share-close').addEventListener('click',()=>closeDialog(shareDialog,shareTrigger));shareDialog.addEventListener('close',()=>{document.body.classList.remove('has-open-wechat');shareTrigger?.focus({preventScroll:true});});
  shareDialog.addEventListener('click',e=>{if(e.target!==shareDialog)return;const r=shareDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(shareDialog,shareTrigger);});
  $('#wechat-share-copy').addEventListener('click',()=>copyText(shareUrl,$('#wechat-share-url'),$('#wechat-share-status')));
})();
