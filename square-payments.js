(function(){
'use strict';
var OWNER_KEY='tqb_square_owner_key_v1';
var START='https://cychngcvhgtfuahavlqq.supabase.co/functions/v1/square-oauth-start';
var CREATE='https://cychngcvhgtfuahavlqq.supabase.co/functions/v1/square-create-payment-link';
var replay=false,locks={};
function hex(bytes){var a=new Uint8Array(bytes);crypto.getRandomValues(a);return Array.from(a).map(function(b){return b.toString(16).padStart(2,'0')}).join('')}
function owner(){var k=localStorage.getItem(OWNER_KEY)||'';if(!/^[a-f0-9]{64}$/i.test(k)){k=hex(32);localStorage.setItem(OWNER_KEY,k)}return k}
function businessName(){try{var s=JSON.parse(localStorage.getItem('tqb_settings_v6')||'{}');var n=String(s.businessName||s.business_name||'').trim();if(!n||n.toLowerCase()==='tradie quote buddy')return'DustyBoots Invoicing';return n}catch(e){return'DustyBoots Invoicing'}}
function invoices(){try{var x=JSON.parse(localStorage.getItem('tqb_invoices_v1')||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function save(list){localStorage.setItem('tqb_invoices_v1',JSON.stringify(list))}
function current(){var view=document.getElementById('invoiceView');if(!view)return null;var b=view.querySelector('.invoice-meta b'),n=b?(b.textContent||'').trim():'';if(!n){var m=(view.textContent||'').match(/INV-\d+/);n=m?m[0]:''}if(!n)return null;var list=invoices();for(var i=0;i<list.length;i++)if(String(list[i].number)===n)return list[i];return null}
function setConnectHref(){var a=document.querySelector('#squarePaymentsBlock a[href*="square-oauth-start"]');if(a)a.href=START+'?owner_key='+encodeURIComponent(owner())}
function createLink(inv){
  if(!inv)return Promise.reject(new Error('Invoice not found.'));
  if(inv.squareCheckoutUrl)return Promise.resolve(inv);
  var key=String(inv.id||inv.number||'');
  if(locks[key])return locks[key];
  locks[key]=fetch(CREATE,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({owner_key:owner(),invoice_id:String(inv.id||''),invoice_number:String(inv.number||''),amount_cents:Math.round(Number(inv.total||0)*100),currency:'AUD',name:(inv.businessName||businessName())+' - '+(inv.number||'Invoice')})})
  .then(function(r){return r.json().then(function(d){return{ok:r.ok,data:d}})})
  .then(function(x){
    if(!x.ok||!x.data.checkout_url)throw new Error(x.data&&x.data.error||'Square could not create the payment link.');
    var list=invoices(),found=false;
    for(var i=0;i<list.length;i++)if(String(list[i].id)===String(inv.id)){list[i].squareCheckoutUrl=x.data.checkout_url;list[i].squarePaymentLinkId=x.data.payment_link_id||'';list[i].squareOrderId=x.data.order_id||'';list[i].squarePaymentLinkCreatedAt=Date.now();found=true;break}
    if(found)save(list);
    Object.assign(inv,{squareCheckoutUrl:x.data.checkout_url,squarePaymentLinkId:x.data.payment_link_id||'',squareOrderId:x.data.order_id||'',squarePaymentLinkCreatedAt:Date.now()});
    return inv;
  }).finally(function(){delete locks[key]});
  return locks[key];
}
window.tqbEnsureSquarePaymentLink=function(inv){if(inv&&inv.squareCheckoutUrl)return Promise.resolve(inv);return createLink(inv)};
function addInvoicePayButton(){
  var view=document.getElementById('invoiceView');
  if(!view||document.getElementById('invoiceSquarePayBtn'))return;
  var inv=current();
  if(!inv||String(inv.status||'').toLowerCase()==='paid')return;
  var actions=view.querySelector('.invoice-actions');
  if(!actions)return;
  var b=document.createElement('button');
  b.type='button';b.className='primary';b.id='invoiceSquarePayBtn';b.textContent=inv.squareCheckoutUrl?'💳 Pay by Square':'💳 Set up Pay by Square';
  b.title=inv.squareCheckoutUrl?'Open the Square payment checkout':'Create a secure Square payment link for this invoice';
  actions.insertBefore(b,actions.firstChild);
  b.onclick=function(){
    var original=b.textContent;b.disabled=true;b.textContent='⏳ Preparing Square Payment…';
    var popup=null;
    try{popup=window.open('about:blank','_blank','noopener,noreferrer')}catch(e){}
    window.tqbEnsureSquarePaymentLink(inv).then(function(x){
      b.disabled=false;b.textContent='💳 Pay by Square';
      if(popup){try{popup.location.href=x.squareCheckoutUrl;popup.focus()}catch(e){window.location.href=x.squareCheckoutUrl}}
      else window.location.href=x.squareCheckoutUrl;
    }).catch(function(err){
      if(popup){try{popup.close()}catch(e){}}
      b.disabled=false;b.textContent=original;
      alert('We could not prepare the Square payment link.\n\n'+(err&&err.message?err.message:err)+'\n\nPlease check the Square connection in Settings.');
    });
  };
}
function prepareVisibleInvoice(){var inv=current();if(!inv||inv.squareCheckoutUrl)return;var btn=document.getElementById('sendInvoiceBtn');if(btn&&btn.dataset.squarePreparing==='1')return;if(btn){btn.dataset.squarePreparing='1';var old=btn.textContent;btn.disabled=true;btn.textContent='⏳ Preparing Card Payment…';createLink(inv).then(function(){btn.dataset.squarePreparing='0';btn.disabled=false;btn.textContent='📧 Send Invoice';addInvoicePayButton()}).catch(function(err){console.error('Square payment link:',err);btn.dataset.squarePreparing='0';btn.disabled=false;btn.textContent='📧 Send Invoice';var note=document.getElementById('squarePrepareError');if(!note){note=document.createElement('div');note.id='squarePrepareError';note.style.cssText='margin:0 auto 12px;max-width:850px;padding:12px 14px;border-radius:10px;background:#fff2cf;color:#8a5a00;font-size:13px;font-weight:700';var actions=btn.parentElement;if(actions&&actions.parentNode)actions.parentNode.insertBefore(note,actions)}note.textContent='💳 Card payment is not ready: '+(err&&err.message?err.message:'Please check the Square connection in Settings.')} )}}
function interceptSend(e){
  if(replay)return;
  var btn=e.target&&e.target.closest?e.target.closest('#sendInvoiceBtn'):null;
  if(!btn)return;
  var inv=current();
  if(!inv||inv.squareCheckoutUrl)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(btn.dataset.squarePreparing==='1')return;
  btn.dataset.squarePreparing='1';var original=btn.textContent;btn.disabled=true;btn.textContent='⏳ Preparing Card Payment…';
  window.tqbEnsureSquarePaymentLink(inv).then(function(){btn.dataset.squarePreparing='0';btn.disabled=false;btn.textContent=original;replay=true;btn.click();setTimeout(function(){replay=false},1000);addInvoicePayButton()}).catch(function(err){console.error(err);btn.dataset.squarePreparing='0';btn.disabled=false;btn.textContent=original;alert('We could not prepare the card payment for this invoice.\n\n'+(err&&err.message?err.message:err)+'\n\nThe invoice was not emailed.')});
}
function hideManualButton(){var buttons=document.querySelectorAll('.tqb-square-pay,.tqb-copy-square');for(var i=0;i<buttons.length;i++)buttons[i].remove()}
function start(){owner();setConnectHref();hideManualButton();document.addEventListener('click',interceptSend,true);if(window.MutationObserver){var o=new MutationObserver(function(){setConnectHref();hideManualButton();prepareVisibleInvoice();addInvoicePayButton()});o.observe(document.body,{childList:true,subtree:true})}setInterval(function(){setConnectHref();hideManualButton();prepareVisibleInvoice();addInvoicePayButton()},1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();