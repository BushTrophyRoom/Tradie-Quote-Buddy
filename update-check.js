(function(){
  'use strict';
  var KEY='dustyboots-build-seen';
  var BUILD='2026-09-10-1';
  try{
    if(localStorage.getItem(KEY)!==BUILD) localStorage.setItem(KEY,BUILD);
  }catch(e){}
  if(!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('./sw.js?v=59',{updateViaCache:'none'}).then(function(reg){
    try{ return reg.update(); }catch(e){}
  }).catch(function(){});
})();
