(function(){
  'use strict';
  var deferredPrompt=null;
  var BUTTON_ID='dustyboots-install-button';
  function isStandalone(){return window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true}
  function addButton(){
    if(isStandalone()||document.getElementById(BUTTON_ID)) return;
    var b=document.createElement('button');
    b.id=BUTTON_ID;
    b.type='button';
    b.textContent='Install DustyBoots';
    b.style.cssText='position:fixed;right:14px;bottom:76px;z-index:99999;border:0;border-radius:999px;padding:12px 16px;font-weight:700;font-size:14px;background:#111;color:#fff;box-shadow:0 4px 16px rgba(0,0,0,.25);cursor:pointer';
    b.addEventListener('click',function(){
      if(!deferredPrompt){alert('To install DustyBoots, use your browser menu and choose Add to Home screen or Install app.');return}
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function(){deferredPrompt=null;b.remove()}).catch(function(){});
    });
    document.body.appendChild(b);
  }
  window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferredPrompt=e;addButton()});
  window.addEventListener('appinstalled',function(){deferredPrompt=null;var b=document.getElementById(BUTTON_ID);if(b)b.remove()});
  document.addEventListener('DOMContentLoaded',function(){setTimeout(addButton,1200)});
})();
