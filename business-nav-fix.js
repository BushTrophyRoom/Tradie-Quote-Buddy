(function(){
'use strict';
function load(){
 if(window.__dustyBusinessFixedLoader)return;
 window.__dustyBusinessFixedLoader=true;
 var s=document.createElement('script');s.src='./business-sections-fixed.js?v=4';s.defer=true;document.head.appendChild(s);
 var r=document.createElement('script');r.src='./reports-enhanced.js?v=3';r.defer=true;document.head.appendChild(r);
 var d=document.createElement('script');d.src='./reports-direct.js?v=1';d.defer=true;document.head.appendChild(d);
 var v=document.createElement('script');v.src='./customer-open-button.js?v=3';v.defer=true;document.head.appendChild(v);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load);else load();
})();
