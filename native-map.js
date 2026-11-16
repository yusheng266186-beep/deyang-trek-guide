(() => {
  'use strict';
  const $=s=>document.querySelector(s);
  const panel=$('#native-map-panel'),frame=$('#gaode-frame'),expand=$('#map-expand');
  const out=$('#map-zoom-out'),inside=$('#map-zoom-in'),level=$('#map-zoom-level'),hint=$('#map-zoom-hint');
  let wasNativeFullscreen=false;
  function syncZoom(){
    const url=new URL(frame.src),auto=/\/(search|dir)$/.test(url.pathname),zoom=Number(url.searchParams.get('zoom'))||13;
    level.textContent=auto?'自动':String(zoom);
    out.disabled=auto||zoom<=5;inside.disabled=auto||zoom>=18;
    hint.textContent=auto?'搜索与路线由高德自动取景；可在上方地点总览中自由缩放。':'按钮缩放会回到当前选定位置。';
  }
  function zoomBy(delta){
    const url=new URL(frame.src);if(/\/(search|dir)$/.test(url.pathname))return;
    url.searchParams.set('zoom',String(Math.max(5,Math.min(18,(Number(url.searchParams.get('zoom'))||13)+delta))));frame.src=url.toString();syncZoom();
  }
  out.addEventListener('click',()=>zoomBy(-1));inside.addEventListener('click',()=>zoomBy(1));
  document.addEventListener('guide:framechange',syncZoom);syncZoom();
  panel.addEventListener('click',e=>{const button=e.target.closest('[data-native-scope]');if(button)document.dispatchEvent(new CustomEvent('guide:scope',{detail:{scope:button.dataset.nativeScope}}));});
  function applyFullscreen(on){
    panel.classList.toggle('is-map-fullscreen',on);document.body.classList.toggle('has-map-fullscreen',on);
    expand.setAttribute('aria-expanded',String(on));expand.setAttribute('aria-label',on?'退出地图全屏':'全屏查看地图');expand.textContent=on?'× 退出全屏':'⛶ 全屏';
    if(!on)expand.focus({preventScroll:true});
  }
  expand.addEventListener('click',async()=>{
    if(panel.classList.contains('is-map-fullscreen')){
      applyFullscreen(false);
      if(document.fullscreenElement===panel&&document.exitFullscreen)try{await document.exitFullscreen();}catch(_){}
      wasNativeFullscreen=false;return;
    }
    applyFullscreen(true);
    if(panel.requestFullscreen)try{await panel.requestFullscreen();wasNativeFullscreen=true;}catch(_){/* iOS and restricted browsers retain the viewport-sized view. */}
  });
  document.addEventListener('fullscreenchange',()=>{if(document.fullscreenElement===panel)wasNativeFullscreen=true;else if(wasNativeFullscreen){wasNativeFullscreen=false;applyFullscreen(false);}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('is-map-fullscreen')&&!document.fullscreenElement)applyFullscreen(false);});
})();
