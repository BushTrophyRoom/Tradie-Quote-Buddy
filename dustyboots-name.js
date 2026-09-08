(function(){
'use strict';
function apply(){
  document.title='DustyBoots Invoicing';
  var m=document.querySelector('meta[name="apple-mobile-web-app-title"]');
  if(m)m.setAttribute('content','DustyBoots Invoicing');
  var brand=document.querySelector('.topbar .brand strong');
  if(brand)brand.textContent='DustyBoots Invoicing';
  var tagline=document.querySelector('.topbar .brand span');
  if(tagline)tagline.textContent='Invoicing made simple';
  document.querySelectorAll('.topbar .logo').forEach(function(box){
    box.style.width='76px';
    box.style.height='76px';
  });
  document.querySelectorAll('img[src*="icon.svg"]').forEach(function(img){
    img.src='./icon.svg?v=5';
    img.alt='DustyBoots Invoicing logo';
  });
  document.querySelectorAll('link[rel="icon"]').forEach(function(link){
    link.href='./icon.svg?v=5';
  });
  document.querySelectorAll('body *').forEach(function(el){
    if(el.children.length===0 && el.textContent.trim()==='Tradie Quote Buddy')el.textContent='DustyBoots Invoicing';
    if(el.children.length===0 && el.textContent.trim()==='Tradie Quote Buddy Pro')el.textContent='DustyBoots Pro';
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
setTimeout(apply,300);
setTimeout(apply,1500);
})();
