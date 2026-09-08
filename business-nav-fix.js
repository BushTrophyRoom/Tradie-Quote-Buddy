(function(){
'use strict';
function load(){
 if(window.__dustyBusinessFixedLoader)return;
 window.__dustyBusinessFixedLoader=true;
 var s=document.createElement('script');
 s.src='./business-sections-fixed.js?v=2';
 s.defer=true;
 document.head.appendChild(s);
 var r=document.createElement('script');
 r.src='./reports-enhanced.js?v=1';
 r.defer=true;
 document.head.appendChild(r);
 var c=document.createElement('script');
 c.src='./customer-click-fix.js?v=1';
 c.defer=true;
 document.head.appendChild(c);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load);else load();
})();
