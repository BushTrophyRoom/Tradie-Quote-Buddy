(function(){
'use strict';
function load(){
 if(window.__dustyBusinessFixedLoader)return;
 window.__dustyBusinessFixedLoader=true;
 var s=document.createElement('script');s.src='./business-sections-fixed.js?v=3';s.defer=true;document.head.appendChild(s);
 var r=document.createElement('script');r.src='./reports-enhanced.js?v=2';r.defer=true;document.head.appendChild(r);
 var v=document.createElement('script');v.src='./customer-open-button.js?v=2';v.defer=true;document.head.appendChild(v);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load);else load();
})();
