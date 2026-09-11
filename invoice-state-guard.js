(function(){
'use strict';
var KEY='tqb_invoices_v1',STATUS_HOST='cychngcvhgtfuahavlqq.supabase.co',MANUAL_KEY='dustyboots-manual-payment-intent-v1';
var originalFetch=window.fetch;
function read(){try{var x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function save(x){try{localStorage.setItem(KEY,JSON.stringify(x));return true}catch(e){return false}}
function manualIntentFor(no){try{return sessionStorage.getItem(MANUAL_KEY)===no}catch(e){return false}}
function hasActualSquarePayment(x){return !!(x&&(x.squarePaymentId||x.squareOrderId||x.paymentId||(String(x.paidSource||'').toLowerCase()==='square'&&x.paidConfirmedAt)))}
function hasConfirmedManualPayment(x){return !!(x&&manualIntentFor(String(x.number||''))&&Number(x.paidAt)>0&&(String(x.paidSource||'').toLowerCase()==='manual'||x.paymentMethod||x.paidMethod||x.paymentDate))}
window.addEventListener('pointerdown',function(e){try{var b=e.target&&e.target.closest?e.target.closest('#markPaidBtn,#tqbRecordPayment'):null;if(!b)return;var view=document.getElementById('invoiceView'),n=view&&view.querySelector('.invoice-meta b'),no=n?(n.textContent||'').trim():'';if(no)sessionStorage.setItem(MANUAL_KEY,no)}catch(err){}},true);
window.fetch=function(input,init){
  try{var u=typeof input==='string'?new URL(input,location.href):(input&&input.url?new URL(input.url):null);if(u&&u.hostname===STATUS_HOST&&u.pathname.indexOf('/functions/v1/square-payment-status')>=0&&!u.searchParams.get('payment_link_id'))return Promise.resolve(new Response(JSON.stringify({status:'unpaid',reason:'No Square payment link exists for this invoice.'}),{status:200,headers:{'Content-Type':'application/json'}}))}catch(e){}
  return originalFetch.apply(this,arguments);
};
function guard(){var list=read(),changed=false;list.forEach(function(inv){if(!inv||String(inv.status||'').toLowerCase()!=='paid'||!inv.quoteId)return;var valid=hasActualSquarePayment(inv)||hasConfirmedManualPayment(inv);if(!valid){inv.status='Unpaid';delete inv.paidAt;delete inv.paidSource;delete inv.paidMethod;delete inv.paymentMethod;delete inv.paymentDate;delete inv.paidConfirmedAt;delete inv.squarePaymentId;changed=true}});if(changed){save(list);if(typeof window.renderList==='function')window.renderList();if(typeof window.refreshTQBDashboard==='function')window.refreshTQBDashboard()}}
function start(){guard();setInterval(guard,1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();