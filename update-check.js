(function(){
  'use strict';
  var KEY='dustyboots-build-seen';
  var BUILD='2026-09-11-11';
  var previous='';
  try{previous=localStorage.getItem(KEY)||'';localStorage.setItem(KEY,BUILD)}catch(e){}
  function loadScript(src){var sc=document.createElement('script');sc.src=src;sc.defer=true;document.head.appendChild(sc)}
  function registerFreshWorker(){
    if(!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('./sw.js?v=76',{updateViaCache:'none'}).then(function(reg){
      if(reg.waiting){try{reg.waiting.postMessage({type:'SKIP_WAITING'})}catch(e){}}
      try{reg.update()}catch(e){}
    }).catch(function(){})
  }
  function hardResetThenStart(){
    var jobs=[];
    if('serviceWorker' in navigator){jobs.push(navigator.serviceWorker.getRegistrations().then(function(regs){return Promise.all(regs.map(function(reg){return reg.unregister()}))}).catch(function(){}))}
    if(window.caches){jobs.push(caches.keys().then(function(keys){return Promise.all(keys.map(function(key){return caches.delete(key)}))}).catch(function(){}))}
    Promise.all(jobs).then(function(){registerFreshWorker();loadScript('./invoice-fix.js?v=66');loadScript('./pwa-install.js?v=1');loadScript('./invoice-created-notice.js?v=1');loadScript('./invoice-state-guard.js?v=3');loadScript('./invoice-edit-launcher.js?v=2');try{window.location.reload()}catch(e){}})
  }
  if(previous&&previous!==BUILD){hardResetThenStart();return}
  loadScript('./invoice-fix.js?v=66');
  loadScript('./pwa-install.js?v=1');
  loadScript('./invoice-created-notice.js?v=1');
  loadScript('./invoice-state-guard.js?v=3');
  loadScript('./invoice-edit-launcher.js?v=2');
  registerFreshWorker();
  if('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('controllerchange',function(){try{window.location.reload()}catch(e){}});
})();
