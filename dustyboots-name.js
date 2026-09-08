(function(){
'use strict';
function apply(){
  document.title='DustyBoots';
  var m=document.querySelector('meta[name="apple-mobile-web-app-title"]');
  if(m)m.setAttribute('content','DustyBoots');
  var brand=document.querySelector('.topbar .brand strong');
  if(brand)brand.textContent='DustyBoots';
  document.querySelectorAll('body *').forEach(function(el){
    if(el.children.length===0 && el.textContent.trim()==='Tradie Quote Buddy')el.textContent='DustyBoots';
    if(el.children.length===0 && el.textContent.trim()==='Tradie Quote Buddy Pro')el.textContent='DustyBoots Pro';
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
setTimeout(apply,300);
})();
