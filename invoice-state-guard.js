(function(){
'use strict';
var KEY='tqb_invoices_v1',STATUS_HOST='cychngcvhgtfuahavlqq.supabase.co';
var originalFetch=window.fetch;
function read(){try{var x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function save(x){try{localStorage.setItem(KEY,JSON.stringify(x));return true}catch(e){return false}}
function hasActualSquarePayment(x){return !!(x&&(x.squarePaymentId||x.squareOrderId||x.paymentId||String(x.paidSource||'').toLowerCase()==='square'&&x.paidConfirmedAt))}
function hasRecordedPayment(x){return !!(x&&((Number(x.paidAt)||0)>0||x.paidSource||x.paidMethod||x.paymentMethod||x.paymentDate))}
window.fetch=function(input,init){
  try{
    var u=typeof input==='string'?new URL(input,location.href):(input&&input.url?new URL(input.url):null);
    if(u&&u.hostname===STATUS_HOST&&u.pathname.indexOf('/functions/v1/square-payment-status')>=0&&!u.searchParams.get('payment_link_id')){
      return Promise.resolve(new Response(JSON.stringify({status:'unpaid',reason:'No Square payment link exists for this invoice.'}),{status:200,headers:{'Content-Type':'application/json'}}));
    }
  }catch(e){}
  return originalFetch.apply(this,arguments);
};
function guard(){
  var list=read(),changed=false;
  list.forEach(function(inv){
    if(!inv||String(inv.status||'').toLowerCase()!=='paid'||!inv.quoteId)return;
    var source=String(inv.paidSource||'').toLowerCase();
    var squareSource=source==='square';
    var valid=squareSource?hasActualSquarePayment(inv):hasRecordedPayment(inv);
    if(!valid){
      inv.status='Unpaid';
      delete inv.paidAt;delete inv.paidSource;delete inv.paidMethod;delete inv.paymentMethod;delete inv.paymentDate;delete inv.paidConfirmedAt;delete inv.squarePaymentId;
      changed=true;
    }
  });
  if(changed){save(list);if(typeof window.renderList==='function')window.renderList();if(typeof window.refreshTQBDashboard==='function')window.refreshTQBDashboard();}
}
function start(){guard();setInterval(guard,1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
