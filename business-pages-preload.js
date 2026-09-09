(function(){
'use strict';
function load(src){var s=document.createElement('script');s.src=src;s.defer=true;s.onerror=function(){console.error('DustyBoots failed to load',src)};document.head.appendChild(s)}
function ready(){
  if(!document.getElementById('tqb-invoice-nav-bridge')){
    load('./invoice-nav-bridge.js?v=4');
  }
  if(!document.getElementById('tqb-invoice-click-fix')){
    var f=document.createElement('script');f.id='tqb-invoice-click-fix';f.src='./invoice-click-fix.js?v=1';document.head.appendChild(f)
  }
  if(!window.tqbOpenBusiness){setTimeout(ready,20);return}
  if(!document.getElementById('dustyboots-mobile-form-fix')){
    var s=document.createElement('style');s.id='dustyboots-mobile-form-fix';
    s.textContent='@media(max-width:700px){#customersData label{display:block!important}#customersData input,#customersData textarea{width:100%!important;min-height:48px!important;font-size:16px!important;box-sizing:border-box!important}#customersData button{min-height:48px!important;font-size:16px!important;touch-action:manipulation!important}}';
    document.head.appendChild(s)
  }
  if(!document.getElementById('dustyboots-customer-save-fix')){
    var f=document.createElement('script');f.id='dustyboots-customer-save-fix';f.src='./customer-save-fix.js?v=2';document.head.appendChild(f)
  }
  var current=document.querySelector('.screen.active');
  ['itemsServices','payments','reports'].forEach(function(id){
    try{window.tqbOpenBusiness(id)}catch(e){console.error('DustyBoots business preload',id,e)}
  });
  if(current&&current.id==='customers'){
    setTimeout(function(){try{window.tqbOpenBusiness('customers')}catch(e){}},0)
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();