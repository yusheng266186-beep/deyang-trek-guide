(() => {
  'use strict';
  if(!/MicroMessenger/i.test(navigator.userAgent))return;
  const dialog=document.querySelector('#wechat-map-dialog'),attempt=document.querySelector('#wechat-map-try'),web=document.querySelector('#wechat-map-web'),copy=document.querySelector('#wechat-map-copy'),input=document.querySelector('#wechat-map-url'),status=document.querySelector('#wechat-map-status');
  let trigger=null,copyUrl='';
  function mapLink(raw,launch){
    const url=new URL(raw,location.href);
    const id=url.pathname.match(/^\/place\/([^/]+)/)?.[1];
    if(id&&url.hostname!=='uri.amap.com')return `https://uri.amap.com/marker?${new URLSearchParams({markers:id,src:'deyang-travel-guide',callnative:launch?'1':'0'})}`;
    if(url.hostname==='uri.amap.com')url.searchParams.set('callnative',launch?'1':'0');
    return url.href;
  }
  function close(){if(dialog.close&&dialog.open)dialog.close();else{dialog.removeAttribute('open');document.body.classList.remove('has-open-wechat');trigger?.focus({preventScroll:true});}}
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href]');if(!a||dialog.contains(a)||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    let url;try{url=new URL(a.href,location.href);}catch(_){return;}
    if(!/(^|\.)amap\.com$/i.test(url.hostname)||!/^\/(navigation|search|marker|place(?:\/|$)|ssr\/(?:place|dir))/i.test(url.pathname))return;
    e.preventDefault();trigger=a;copyUrl=mapLink(url.href,true);attempt.href=copyUrl;web.href=mapLink(url.href,false);input.value=copyUrl;input.hidden=true;status.textContent='';
    document.body.classList.add('has-open-wechat');if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
    requestAnimationFrame(()=>attempt.focus({preventScroll:true}));
  },true);
  document.querySelector('.wechat-close').addEventListener('click',close);
  dialog.addEventListener('close',()=>{document.body.classList.remove('has-open-wechat');trigger?.focus({preventScroll:true});});
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();});
  copy.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(copyUrl);status.textContent='已复制。可粘贴到手机浏览器打开。';}
    catch(_){input.hidden=false;input.focus();input.select();let ok=false;try{ok=document.execCommand('copy');}catch(_){}status.textContent=ok?'已复制。可粘贴到手机浏览器打开。':'请长按上方链接复制，再粘贴到手机浏览器打开。';}
  });
})();
