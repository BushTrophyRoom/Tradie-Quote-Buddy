(function(){
'use strict';
var KEY='tqb_invoices_v1';
var STATUS='https://cychngcvhgtfuahavlqq.supabase.co/functions/v1/square-payment-status';
var CREATE='https://cychngcvhgtfuahavlqq.supabase.co/functions/v1/square-create-payment-link';
var OWNER_KEY='tqb_square_owner_key_v1';
function read(){try{var x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function save(x){try{localStorage.setItem(KEY,JSON.stringify(x));return true}catch(e){return false}}
function invoiceNumber(){var v=document.getElementById('invoiceView');if(!v)return '';var m=(v.textContent||'').match(/INV-\d+/);return m?m[0]:''}
function current(){var n=invoiceNumber();if(!n)return null;return read().find(function(x){return String(x.number)===n})||null}
function isPaid(x){return String(x&&x.status||'').toLowerCase()==='paid'}
function manual(x){return isPaid(x)&&String(x.paidSource||'').toLowerCase()!=='square'}
function updateView(inv){var v=document.getElementById('invoiceView');if(!v)return;v.querySelectorAll('.invoice-status').forEach(function(s){s.textContent=inv.status;s.setAttribute('aria-label',inv.status);if(isPaid(inv)){s.style.background='#ecfdf3';s.style.color='#166534'}});var b=v.querySelector('#markPaidBtn');if(b){b.type='button';b.disabled=false;b.style.pointerEvents='auto';b.style.cursor='pointer';b.style.opacity='1';b.textContent=isPaid(inv)?(manual(inv)?'↩ Mark as Unpaid':'✓ Paid'):'💰 Mark as Paid'}}
function refresh(){if(typeof window.refreshTQBDashboard==='function')window.refreshTQBDashboard();if(typeof window.renderList==='function')window.renderList()}
function markPaid(){var inv=current();if(!inv)return;var list=read(),live=list.find(function(x){return String(x.number)===String(inv.number)});if(!live)return;if(isPaid(live)){if(!manual(live))return;live.status='Unpaid';delete live.paidAt;delete live.paidSource;delete live.paidMethod}else{live.status='Paid';live.paidAt=Date.now();live.paidSource='manual';live.paidMethod='Manual payment'}save(list);updateView(live);refresh()}
function bind(){var v=document.getElementById('invoiceView');if(!v)return;var b=v.querySelector('#markPaidBtn');if(!b)return;b.type='button';b.onclick=function(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();markPaid()};b.onpointerup=function(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();markPaid()};b.ontouchend=function(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();markPaid()};b.disabled=false;b.style.pointerEvents='auto'}
function squareOwner(){var k=localStorage.getItem(OWNER_KEY)||'';if(!/^[a-f0-9]{64}$/i.test(k)){var a=new Uint8Array(32);crypto.getRandomValues(a);k=Array.from(a).map(function(b){return b.toString(16).padStart(2,'0')}).join('');localStorage.setItem(OWNER_KEY,k)}return k}
function squareInvoice(){var inv=current();return inv}
function prepareSquare(inv){if(!inv||inv.squareCheckoutUrl)return Promise.resolve(inv);return fetch(CREATE,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({owner_key:squareOwner(),invoice_id:String(inv.id||''),invoice_number:String(inv.number||''),amount_cents:Math.round(Number(inv.total||0)*100),currency:'AUD',name:(inv.businessName||'Tradie Quote Buddy')+' - '+(inv.number||'Invoice')})}).then(function(r){return r.json().then(function(d){return{ok:r.ok,data:d}})}).then(function(x){if(!x.ok||!x.data.checkout_url)throw new Error(x.data&&x.data.error||'Square could not create the payment link.');var list=read(),found=list.find(function(v){return String(v.id)===String(inv.id)});if(found){found.squareCheckoutUrl=x.data.checkout_url;found.squarePaymentLinkId=x.data.payment_link_id||'';found.squareOrderId=x.data.order_id||'';found.squarePaymentLinkCreatedAt=Date.now();save(list);Object.assign(inv,found)}return inv})}
var squareBusy=false;
function squareSend(e){if(squareBusy)return;var b=e.target&&e.target.closest?e.target.closest('#sendInvoiceBtn'):null;if(!b)return;var inv=squareInvoice();if(!inv||inv.squareCheckoutUrl)return;squareBusy=true;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();var old=b.textContent;b.disabled=true;b.textContent='⏳ Preparing Card Payment…';prepareSquare(inv).then(function(){b.disabled=false;b.textContent=old;squareBusy=false;b.click()}).catch(function(err){b.disabled=false;b.textContent=old;squareBusy=false;alert('We could not prepare the card payment for this invoice.\n\n'+(err&&err.message?err.message:err))})}
function start(){bind();setInterval(bind,300);window.addEventListener('click',squareSend,true);new MutationObserver(function(){bind()}).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
