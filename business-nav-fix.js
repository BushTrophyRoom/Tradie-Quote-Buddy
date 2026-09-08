(function(){
'use strict';
if(window.__dustyBusinessNavFixLoaded)return;
window.__dustyBusinessNavFixLoaded=true;
function load(src){var s=document.createElement('script');s.src=src;s.defer=true;document.head.appendChild(s)}
function init(){load('./business-pages-preload.js?v=3');load('./nav-final-fix.js?v=5')}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();