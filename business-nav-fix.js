(function(){
'use strict';
function q(s){return document.querySelector(s)}
function qa(s){return Array.prototype.slice.call(document.querySelectorAll(s))}
function read(k,f){try{var v=JSON.parse(localStorage.getItem(k)||'');return v==null?f:v}catch(e){return f}}
function money(v){return new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD'}).format(Number(v)||0)}
function esc(v){return String(v==null?'':v).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]})}
function ensureScreen(id,title,sub){var s=document.getElementById(id);if(!s){s=document.createElement('section');s.id=id;s.className='screen biz-screen';s.innerHTML='<div class="biz-wrap"><div class="biz-head"><div><p class="eyebrow">DUSTYBOOTS</p><h1>'+title+'</h1><p>'+sub+'</p></div></div><div class="biz-card" id="'+id+'Content"></div></div>';q('main').appendChild(s)}return s}
function openBusiness(id){var info={itemsServices:['Items & Services','Save your common materials, services and labour rates for faster quoting.'],payments:['Payments','Keep track of what has been paid and what still needs chasing.'],reports:['Reports','A clear view of your quoting, invoicing and cash position.']}[id];if(!info)return;var s=ensureScreen(id,info[0],info[1]);qa('.screen').forEach(function(x){x.classList.toggle('active',x===s)});qa('.nav').forEach(function(x){x.classList.toggle('active',x.getAttribute('data-screen')===id)});window.scrollTo(0,0);if(id==='itemsServices'&&window.tqbOpenBusiness)window.tqbOpenBusiness(id);else if(id==='payments'&&window.tqbOpenBusiness)window.tqbOpenBusiness(id);else if(id==='reports'&&window.tqbOpenBusiness)window.tqbOpenBusiness(id)}
function wire(){if(window.__dustyBusinessFixed)return;window.__dustyBusinessFixed=true;document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.nav[data-screen]');if(!b)return;var id=b.getAttribute('data-screen');if(id!=='itemsServices'&&id!=='payments'&&id!=='reports')return;e.preventDefault();e.stopImmediatePropagation();if(window.tqbOpenBusiness)window.tqbOpenBusiness(id);else openBusiness(id)},true);var s=document.createElement('script');s.src='./nav-final-fix.js?v=2';s.defer=true;document.head.appendChild(s)}
function init(){wire()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();