(function(){
  'use strict';
  var KEY='dustyboots-build-seen';
  var BUILD='2026-09-11-2';
  var previous='';
  try{previous=localStorage.getItem(KEY)||'';localStorage.setItem(KEY,BUILD)}catch(e){}
  function registerFreshWorker(){
    if(!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('./sw.js?v=71',{updateViaCache:'none'}).then(function(reg){
      if(reg.waiting){try{reg.waiting.postMessage({type:'SKIP_WAITING'})}catch(e){}}
      try{reg.update()}catch(e){}
    }).catch(function(){});
  }
  function loadFix(){
    var sc=document.createElement('script');
    sc.src='./invoice-fix.js?v=66';
    sc.defer=true;
    document.head.appendChild(sc);
  }
  function hardResetThenStart(){
    var jobs=[];
    if('serviceWorker' in navigator){
      jobs.push(navigator.serviceWorker.getRegistrations().then(function(regs){return Promise.all(regs.map(function(reg){return reg.unregister()}))}).catch(function(){}));
    }
    if(window.caches){
      jobs.push(caches.keys().then(function(keys){return Promise.all(keys.map(function(key){return caches.delete(key)}))}).catch(function(){}));
    }
    Promise.all(jobs).then(function(){registerFreshWorker();loadFix();try{window.location.reload()}catch(e){}});
  }
  if(previous && previous!==BUILD){hardResetThenStart();return;}
  loadFix();
  registerFreshWorker();
  navigator.serviceWorker&&navigator.serviceWorker.addEventListener('controllerchange',function(){
    try{window.location.reload()}catch(e){}
  });
})();
