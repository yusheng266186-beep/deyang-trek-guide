(() => {
  'use strict';
  if(!/MicroMessenger/i.test(navigator.userAgent))return;
  const $=s=>document.querySelector(s),dialog=$('#wechat-map-dialog'),qq=$('#wechat-map-qq'),web=$('#wechat-map-web'),copy=$('#wechat-map-copy'),input=$('#wechat-map-url'),status=$('#wechat-map-status'),shareDialog=$('#wechat-share-dialog');
  let trigger=null,copyUrl='',shareTrigger=null,shareUrl='';
  function mapLink(raw,launch){const url=new URL(raw,location.href),id=url.pathname.match(/^\/place\/([^/]+)/)?.[1];if(id&&url.hostname!=='uri.amap.com')return `https://uri.amap.com/marker?${new URLSearchParams({poiid:id,src:'deyang-travel-guide',callnative:launch?'1':'0'})}`;if(url.hostname==='uri.amap.com')url.searchParams.set('callnative',launch?'1':'0');return url.href;}
  function qqRoute(raw){
    const u=new URL(raw,location.href),p=(window.GUIDE_MAP_POINTS||[]).find(x=>x.link===u.href),parts=s=>{if(!s)return null;const a=s.split(',');return a.length>=2&&Number.isFinite(Number(a[0]))&&Number.isFinite(Number(a[1]))?{lon:a[0],lat:a[1],name:a.slice(2).join(',')}:null;};
    const start=parts(u.searchParams.get('from')),end=parts(u.searchParams.get('to'));
    const target=end?.name||(p&&!p.proxy?p.name:'')||u.searchParams.get('keyword')||(p?p.name:'');if(!target)return '';
    const mode=u.searchParams.get('mode')||u.searchParams.get('type'),q=new URLSearchParams({type:mode==='walk'?'walk':mode==='bus'?'bus':'drive',to:target,referer:'deyang-travel-guide'});
    if(end)q.set('tocoord',`${end.lat},${end.lon}`);else if(p&&!p.proxy)q.set('tocoord',`${p.lat},${p.lon}`);
    if(start){q.set('from',start.name||'起点');q.set('fromcoord',`${start.lat},${start.lon}`);}
    return `https://apis.map.qq.com/uri/v1/routeplan?${q}`;
  }
  function openDialog(d){document.body.classList.add('has-open-wechat');if(typeof d.showModal==='function')d.showModal();else d.setAttribute('open','');}
  function closeDialog(d,opener){if(d.close&&d.open)d.close();else{d.removeAttribute('open');document.body.classList.remove('has-open-wechat');opener?.focus({preventScroll:true});}}
  async function copyText(value,field,message){try{await navigator.clipboard.writeText(value);message.textContent='已复制，可粘贴后使用。';}catch(_){field.hidden=false;field.value=value;field.focus();field.select();let ok=false;try{ok=document.execCommand('copy');}catch(_){}message.textContent=ok?'已复制，可粘贴后使用。':'请长按上方链接复制。';}}
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href]');if(!a||dialog.contains(a)||shareDialog.contains(a)||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    let u;try{u=new URL(a.href,location.href);}catch(_){return;}
    if(!/(^|\.)amap\.com$/i.test(u.hostname)||!/^\/(navigation|search|marker|place(?:\/|$)|ssr\/(?:place|dir))/i.test(u.pathname))return;
    e.preventDefault();trigger=a;copyUrl=mapLink(u.href,true);web.href=mapLink(u.href,false);const route=qqRoute(u.href);qq.hidden=!route;if(route)qq.href=route;input.hidden=true;status.textContent='';openDialog(dialog);requestAnimationFrame(()=>{(route?qq:web).focus({preventScroll:true});});
  },true);
  $('.wechat-close').addEventListener('click',()=>closeDialog(dialog,trigger));dialog.addEventListener('close',()=>{document.body.classList.remove('has-open-wechat');trigger?.focus({preventScroll:true});});
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(dialog,trigger);});
  copy.addEventListener('click',()=>copyText(copyUrl,input,status));
  document.addEventListener('guide:share-in-wechat',e=>{shareTrigger=document.activeElement;shareUrl=e.detail.url;$('#wechat-share-url').hidden=true;$('#wechat-share-status').textContent='';openDialog(shareDialog);requestAnimationFrame(()=>$('#wechat-share-copy').focus({preventScroll:true}));});
  $('.wechat-share-close').addEventListener('click',()=>closeDialog(shareDialog,shareTrigger));shareDialog.addEventListener('close',()=>{document.body.classList.remove('has-open-wechat');shareTrigger?.focus({preventScroll:true});});
  shareDialog.addEventListener('click',e=>{if(e.target!==shareDialog)return;const r=shareDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(shareDialog,shareTrigger);});
  $('#wechat-share-copy').addEventListener('click',()=>copyText(shareUrl,$('#wechat-share-url'),$('#wechat-share-status')));
})();
