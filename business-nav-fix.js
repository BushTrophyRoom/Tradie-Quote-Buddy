(function(){
'use strict';
if(window.__dustyBusinessNavFixLoaded)return;
window.__dustyBusinessNavFixLoaded=true;
function load(src){var s=document.createElement('script');s.src=src;s.defer=true;s.onerror=function(){console.error('DustyBoots failed to load',src)};document.head.appendChild(s)}
function init(){load('./business-pages-preload.js?v=4');load('./nav-final-fix.js?v=6')}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();