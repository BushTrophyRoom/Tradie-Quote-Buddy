(function(){
'use strict';
var KEY='dustyboots-build-seen',BUILD='2026-09-13-01',previous='';
try{previous=localStorage.getItem(KEY)||'';localStorage.setItem(KEY,BUILD)}catch(e){}
function load(src){var s=document.createElement('script');s.src=src;s.defer=true;document.head.appendChild(s)}
function worker(){if(!('serviceWorker'in navigator))return;navigator.serviceWorker.register('./sw.js?v=80',{updateViaCache:'none'}).then(function(r){try{if(r.waiting)r.waiting.postMessage({type:'SKIP_WAITING'});r.update()}catch(e){}}).catch(function(){})}
function reset(){var jobs=[];if('serviceWorker'in navigator)jobs.push(navigator.serviceWorker.getRegistrations().then(function(rs){return Promise.all(rs.map(function(r){return r.unregister()}))}).catch(function(){}));if(window.caches)jobs.push(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){return caches.delete(k)}))}).catch(function(){}));Promise.all(jobs).then(function(){load('./invoice-fix.js?v=66');load('./pwa-install.js?v=1');load('./invoice-created-notice.js?v=1');load('./invoice-state-guard.js?v=3');load('./invoice-action-button.js?v=3');load('./invoice-edit-launcher.js?v=2');worker();setTimeout(function(){location.reload()},250)})}
if(previous&&previous!==BUILD){reset();return}load('./invoice-fix.js?v=66');load('./pwa-install.js?v=1');load('./invoice-created-notice.js?v=1');load('./invoice-state-guard.js?v=3');load('./invoice-action-button.js?v=3');load('./invoice-edit-launcher.js?v=2');worker();
})();
