(function(){
'use strict';
function load(src,id){var s=document.createElement('script');if(id)s.id=id;s.src=src;s.defer=true;s.onerror=function(){console.error('DustyBoots failed to load',src)};document.head.appendChild(s)}
function ready(){
  if(!document.getElementById('tqb-invoice-nav-bridge'))load('./invoice-nav-bridge.js?v=6','tqb-invoice-nav-bridge');
  if(!document.getElementById('tqb-invoice-click-fix'))load('./invoice-click-fix.js?v=3','tqb-invoice-click-fix');
  if(!document.getElementById('tqb-invoice-mobile-final'))load('./invoice-mobile-final.js?v=3','tqb-invoice-mobile-final');
  if(!document.getElementById('tqb-square-payments'))load('./square-payments.js?v=4','tqb-square-payments');
  if(!document.getElementById('tqb-invoice-square-send-fix'))load('./invoice-square-send-fix.js?v=3','tqb-invoice-square-send-fix');
  if(!window.tqbOpenBusiness){setTimeout(ready,20);return}
  if(!document.getElementById('dustyboots-mobile-form-fix')){var s=document.createElement('style');s.id='dustyboots-mobile-form-fix';s.textContent='@media(max-width:700px){#customersData label{display:block!important}#customersData input,#customersData textarea{width:100%!important;min-height:48px!important;font-size:16px!important;box-sizing:border-box!important}#customersData button{min-height:48px!important;font-size:16px!important;touch-action:manipulation!important}}';document.head.appendChild(s)}
  if(!document.getElementById('dustyboots-customer-save-fix')){var c=document.createElement('script');c.id='dustyboots-customer-save-fix';c.src='./customer-save-fix.js?v=2';document.head.appendChild(c)}
  var initial=document.querySelector('.screen.active');
  ['itemsServices','payments','reports'].forEach(function(id){try{window.tqbOpenBusiness(id)}catch(e){console.error('DustyBoots business preload',id,e)}});
  if(initial){document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active')});initial.classList.add('active');document.querySelectorAll('.nav').forEach(function(n){n.classList.toggle('active',n.getAttribute('data-screen')===initial.id)})}
  if(initial&&initial.id==='customers')setTimeout(function(){try{window.tqbOpenBusiness('customers')}catch(e){}},0)
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();
