(function(){
'use strict';
if(window.__tqbInvoiceSquareSendFixLoaded)return;
window.__tqbInvoiceSquareSendFixLoaded=true;
var STATUS='https://cychngcvhgtfuahavlqq.supabase.co/functions/v1/square-payment-status';
var CREATE='https://cychngcvhgtfuahavlqq.supabase.co/functions/v1/square-create-payment-link';
var OAUTH='https://cychngcvhgtfuahavlqq.supabase.co/functions/v1/square-oauth-start';
var OWNER='tqb_square_owner_key_v1';
var SERVICE='service_wmpq4cq',TEMPLATE='template_9kx2gib',PUBLIC='dyBjG4ATAJjl1LYSQ';
function read(){try{var x=JSON.parse(localStorage.getItem('tqb_invoices_v1')||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function save(inv){var x=read();for(var i=0;i<x.length;i++)if(String(x[i].id)===String(inv.id)){x[i]=Object.assign({},x[i],inv);break}localStorage.setItem('tqb_invoices_v1',JSON.stringify(x))}
function settings(){try{return JSON.parse(localStorage.getItem('tqb_settings_v6')||'{}')}catch(e){return{}}}
function name(){var s=settings(),n=String(s.businessName||s.business_name||'').trim();return n&&n.toLowerCase()!=='tradie quote buddy'?n:'DustyBoots Invoicing'}
function money(v){return new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD'}).format(Number(v)||0)}
function enc(o){var s=JSON.stringify(o),b=btoa(unescape(encodeURIComponent(s)));return b.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function url(inv){var s=settings(),x=Object.assign({},inv,{bankName:inv.bankName||s.bankName||'',bankAccountName:inv.bankAccountName||s.bankAccountName||'',bankBsb:inv.bankBsb||s.bankBsb||'',bankAccountNumber:inv.bankAccountNumber||s.bankAccountNumber||'',bankPayId:inv.bankPayId||s.bankPayId||'',bankReference:inv.bankReference||s.bankReference||'Use invoice number as reference'});return 'https://bushtrophyroom.github.io/Tradie-Quote-Buddy/invoice-view.html?data='+enc(x)}
function cloud(inv){return fetch(STATUS+'?invoice_id='+encodeURIComponent(String(inv.id||''))+'&invoice_number='+encodeURIComponent(String(inv.number||'')),{cache:'no-store'}).then(function(r){return r.json().catch(function(){return{}}).then(function(d){return{ok:r.ok,data:d}})}).then(function(x){if(x.ok&&x.data&&x.data.checkout_url){inv.squareCheckoutUrl=x.data.checkout_url;inv.squarePaymentLinkId=x.data.square_payment_link_id||'';inv.squareOrderId=x.data.square_order_id||'';save(inv)}return inv}).catch(function(){return inv})}
function owner(){return localStorage.getItem(OWNER)||''}
function newOwner(){var a=new Uint8Array(32);crypto.getRandomValues(a);var k=Array.from(a).map(function(b){return b.toString(16).padStart(2,'0')}).join('');localStorage.setItem(OWNER,k);return k}
function reconnect(){var k=owner();if(!/^[a-f0-9]{64}$/i.test(k))k=newOwner();window.location.href=OAUTH+'?owner_key='+encodeURIComponent(k)}
function create(inv){
 if(inv.squareCheckoutUrl)return Promise.resolve({ok:true,invoice:inv});
 var k=owner();
 if(!/^[a-f0-9]{32,128}$/i.test(k))return Promise.resolve({ok:false,reconnect:true,error:'Square is connected, but this browser is not linked to that Square connection.'});
 return fetch(CREATE,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({owner_key:k,invoice_id:String(inv.id||''),invoice_number:String(inv.number||''),amount_cents:Math.round(Number(inv.total||0)*100),currency:'AUD',name:name()+' - '+(inv.number||'Invoice')})}).then(function(r){return r.json().catch(function(){return{}}).then(function(d){if(r.ok&&d.checkout_url){inv.squareCheckoutUrl=d.checkout_url;inv.squarePaymentLinkId=d.payment_link_id||'';inv.squareOrderId=d.order_id||'';save(inv);return{ok:true,invoice:inv}}return{ok:false,error:d.error||'Square could not create the card payment link.'}})}).catch(function(e){return{ok:false,error:e&&e.message?e.message:'Could not contact Square.'}})
}
function send(btn){
 var box=document.getElementById('invoicesData'),meta=box&&box.querySelector('.tqb-business-meta b');
 var number=meta?(meta.textContent||'').trim():'';
 var inv=read().find(function(x){return String(x.number)===number});
 if(!inv){alert('Invoice could not be found.');return}
 if(!inv.customerEmail){alert('This invoice needs the customer email address before it can be sent.');return}
 if(!window.emailjs){alert('Email service is still loading. Please refresh the app and try again.');return}
 var old=btn.textContent;btn.disabled=true;btn.textContent='⏳ Creating card payment…';
 try{emailjs.init({publicKey:PUBLIC})}catch(e){}
 cloud(inv).then(function(x){return x.squareCheckoutUrl?{ok:true,invoice:inv}:create(inv)}).then(function(result){
  if(!result.ok){
   if(result.reconnect){
    if(confirm('Square is connected, but this browser needs to be linked to it before card payments can be created. Reconnect Square now?')){reconnect();return new Promise(function(){})}
   }
   throw new Error(result.error||'Square could not create the card payment link. The invoice was not sent.');
  }
  if(!result.invoice.squareCheckoutUrl)throw new Error('Square did not return a card payment link. The invoice was not sent.');
  inv=result.invoice;
  btn.textContent='⏳ Sending invoice…';
  var p={to_email:inv.customerEmail,customer_email:inv.customerEmail,customer_name:inv.customerName||'Customer',business_name:inv.businessName||name(),from_name:inv.businessName||name(),business_email:inv.businessEmail||'',business_phone:inv.businessPhone||'',business_address:inv.businessAddress||'',invoice_number:inv.number||'',invoice_no:inv.number||'',quote_number:inv.quoteNumber||'',invoice_date:inv.invoiceDate||'',due_date:inv.dueDate||'',payment_terms_days:String(inv.paymentTermsDays||0),invoice_total:money(inv.total),total:money(inv.total),amount_due:money(inv.total),invoice_link:url(inv),response_link:url(inv),invoice_pdf:url(inv),quote_pdf:url(inv),quote_status:String(inv.status||'Unpaid'),email_subject:'Invoice '+(inv.number||'')+' from '+(inv.businessName||name()),bank_name:inv.bankName||'',bank_account_name:inv.bankAccountName||'',bank_bsb:inv.bankBsb||'',bank_account_number:inv.bankAccountNumber||'',bank_payid:inv.bankPayId||'',bank_reference:inv.bankReference||inv.number};
  return emailjs.send(SERVICE,TEMPLATE,p)
 }).then(function(result){if(result===undefined)return;btn.disabled=false;btn.textContent='✓ Invoice Sent';alert('Invoice '+number+' was emailed with the Square Pay by Card option.');setTimeout(function(){btn.textContent=old},2500)}).catch(function(e){btn.disabled=false;btn.textContent=old;alert('Invoice not sent. '+(e&&e.message?e.message:'Square could not create the card payment link.'))})
}
function hook(){var b=document.getElementById('tqbSendInvoice');if(!b||b.__squareSendHook)return;b.__squareSendHook=true;b.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();send(b)},true)}
function start(){hook();new MutationObserver(hook).observe(document.body,{childList:true,subtree:true});setInterval(hook,500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();