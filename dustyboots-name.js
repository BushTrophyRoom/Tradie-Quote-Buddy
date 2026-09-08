(function(){
'use strict';
function apply(){
  document.title='DustyBoots Invoicing';
  var m=document.querySelector('meta[name="apple-mobile-web-app-title"]');
  if(m)m.setAttribute('content','DustyBoots Invoicing');

  var brand=document.querySelector('.topbar .brand strong');
  if(brand){
    brand.innerHTML='<span class="db-brand-main">DustyBoots</span><span class="db-brand-sub">INVOICING</span>';
    brand.style.display='flex';
    brand.style.flexDirection='column';
    brand.style.alignItems='center';
    brand.style.gap='1px';
    brand.style.fontFamily='Arial,Helvetica,sans-serif';
    brand.style.fontWeight='900';
    brand.style.lineHeight='1';
    brand.style.letterSpacing='-0.5px';
  }
  var main=document.querySelector('.topbar .brand .db-brand-main');
  if(main){
    main.style.fontSize='21px';
    main.style.color='#fff';
  }
  var sub=document.querySelector('.topbar .brand .db-brand-sub');
  if(sub){
    sub.style.fontSize='10px';
    sub.style.letterSpacing='3px';
    sub.style.color='#ffb000';
    sub.style.fontWeight='800';
    sub.style.marginLeft='3px';
  }

  var tagline=document.querySelector('.topbar .brand span:not(.db-brand-main):not(.db-brand-sub)');
  if(tagline){
    tagline.textContent='Quotes • Invoices • Payments';
    tagline.style.display='block';
    tagline.style.marginTop='8px';
    tagline.style.fontSize='10px';
    tagline.style.letterSpacing='.2px';
    tagline.style.color='#aeb4bd';
    tagline.style.fontWeight='500';
  }

  document.querySelectorAll('.topbar .logo').forEach(function(box){
    box.style.width='76px';
    box.style.height='76px';
  });
  document.querySelectorAll('img[src*="icon.svg"]').forEach(function(img){
    img.src='./icon.svg?v=6';
    img.alt='DustyBoots Invoicing logo';
  });
  document.querySelectorAll('link[rel="icon"]').forEach(function(link){
    link.href='./icon.svg?v=6';
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
