(function(){
'use strict';
var CREATE='https://cychngcvhgtfuahavlqq.supabase.co/functions/v1/square-create-payment-link';
var OWNER_KEY='tqb_square_owner_key_v1';
var INVOICES_KEY='tqb_invoices_v1';
var sending=false;
function owner(){return localStorage.getItem(OWNER_KEY)||''}
function read(){try{var x=JSON.parse(localStorage.getItem(INVOICES_KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function save(x){localStorage.setItem(INVOICES_KEY,JSON.stringify(x))}
function currentInvoice(){var view=document.getElementById('invoiceView');if(!view)return null;var b=view.querySelector('.invoice-meta b'),n=b?(b.textContent||'').trim():'';if(!n){var m=(view.textContent||'').match(/INV-\d+/);n=m?m[0]:''}if(!n)return null;var list=read();for(var i=0;i<list.length;i++)if(String(list[i].number||'')===n)return list[i];return null}
function storeLink(inv,data){var list=read();for(var i=0;i<list.length;i++){if(String(list[i].id)===String(inv.id)){list[i].squareCheckoutUrl=data.checkout_url;list[i].squarePaymentLinkId=data.payment_link_id||'';list[i].squareOrderId=data.order_id||'';list[i].squarePaymentLinkCreatedAt=Date.now();inv.squareCheckoutUrl=data.checkout_url;inv.squarePaymentLinkId=data.payment_link_id||'';inv.squareOrderId=data.order_id||'';break}}save(list)}
function createLink(inv){var key=owner();if(!key)throw new Error('Square connection could not be identified on this device. Please reconnect Square in Settings.');return fetch(CREATE,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({owner_key:key,invoice_id:String(inv.id||''),invoice_number:String(inv.number||''),amount_cents:Math.round(Number(inv.total||0)*100),currency:'AUD',name:(inv.businessName||'Tradie Quote Buddy')+' - '+(inv.number||'Invoice')})}).then(function(r){return r.json().then(function(d){return{ok:r.ok,data:d}})}).then(function(x){if(!x.ok||!x.data.checkout_url)throw new Error(x.data&&x.data.error||'Square could not create the card payment link.');storeLink(inv,x.data);return inv})}
function hideManualButtons(){var nodes=document.querySelectorAll('.tqb-square-pay,.tqb-copy-square');for(var i=0;i<nodes.length;i++)nodes[i].style.display='none'}
function intercept(e){var b=e.target.closest&&e.target.closest('#sendInvoiceBtn');if(!b||sending)return;if(b.dataset.squareBypass==='1'){delete b.dataset.squareBypass;return}var inv=currentInvoice();if(!inv)return;e.preventDefault();e.stopImmediatePropagation();sending=true;b.disabled=true;b.textContent=inv.squareCheckoutUrl?'⏳ Sending Invoice…':'⏳ Preparing Card Payment…';var task=inv.squareCheckoutUrl?Promise.resolve(inv):createLink(inv);task.then(function(){b.dataset.squareBypass='1';b.disabled=false;b.textContent='📧 Send Invoice';b.click()}).catch(function(err){console.error(err);b.disabled=false;b.textContent='📧 Send Invoice';alert('We could not prepare the card payment for this invoice, so it was not emailed.\n\n'+(err&&err.message?err.message:err));}).finally(function(){sending=false})}
function start(){hideManualButtons();document.addEventListener('click',intercept,true);if(window.MutationObserver){var o=new MutationObserver(hideManualButtons);o.observe(document.body,{childList:true,subtree:true})}setInterval(hideManualButtons,1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
