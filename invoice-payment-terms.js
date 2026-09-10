(function(){
'use strict';
var KEY='tqb_invoices_v1',READY='tqbPaymentTermsV3';
function list(){try{var x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function save(x){localStorage.setItem(KEY,JSON.stringify(x))}
function datePlus(dateStr,days){var p=String(dateStr||'').split('/'),d;if(p.length===3)d=new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));else d=new Date(dateStr);if(isNaN(d.getTime()))d=new Date();d.setDate(d.getDate()+Number(days||0));return d.toLocaleDateString('en-AU')}
function view(){return document.getElementById('invoiceView')||document.querySelector('.tqb-invoice-detail')}
function current(){var v=view();if(!v)return null;var m=(v.textContent||'').match(/INV-\d+/);if(!m)return null;return list().find(function(x){return String(x.number)===m[0]})||null}
function updateDue(inv){var v=view();if(!v)return;var due=inv.dueDate||datePlus(inv.invoiceDate,inv.paymentTermsDays||0);var dueEl=v.querySelector('#invoiceDueDate');if(dueEl)dueEl.textContent='Due: '+due}
function build(inv,payment){
  payment.innerHTML='';
  var head=document.createElement('div');head.className='invoice-payment-head';
  var title=document.createElement('b');title.textContent='Payment terms';
  var toggle=document.createElement('button');toggle.type='button';toggle.className='invoice-terms-toggle';toggle.textContent='✏️ Change Terms';
  head.appendChild(title);head.appendChild(toggle);payment.appendChild(head);
  var summary=document.createElement('div');summary.id='tqbPaymentSummaryV3';summary.style.cssText='margin-top:10px;font-size:16px;line-height:1.45';payment.appendChild(summary);
  var box=document.createElement('div');box.id=READY;box.style.cssText='display:none;margin-top:12px;padding:14px;border:1px solid #e1e5eb;border-radius:11px;background:#fff';
  box.innerHTML='<label style="display:block;font-size:13px;font-weight:700;color:#475467">Payment terms<select id="tqbTermsSelectV3" style="display:block;width:100%;margin-top:7px;border:1px solid #d1d5db;border-radius:9px;padding:12px;font:inherit;font-size:16px;background:#fff"><option value="0">Due on receipt</option><option value="7">7 days</option><option value="14">14 days</option><option value="21">21 days</option><option value="30">30 days</option><option value="60">60 days</option><option value="custom">Custom</option></select></label><label id="tqbCustomWrapV3" style="display:none;margin-top:10px;font-size:13px;font-weight:700;color:#475467">Custom days<input id="tqbCustomDaysV3" type="number" min="0" max="365" step="1" style="display:block;width:100%;margin-top:7px;border:1px solid #d1d5db;border-radius:9px;padding:12px;font:inherit;font-size:16px;background:#fff"></label><button type="button" id="tqbTermsSaveV3" class="primary" style="width:100%;margin-top:12px;min-height:46px">Save Payment Terms</button><div id="tqbTermsStatusV3" style="font-size:12px;color:#667085;margin-top:8px"></div>';
  payment.appendChild(box);
  var select=box.querySelector('#tqbTermsSelectV3'),wrap=box.querySelector('#tqbCustomWrapV3'),custom=box.querySelector('#tqbCustomDaysV3'),status=box.querySelector('#tqbTermsStatusV3');
  var n=Math.max(0,Math.min(365,Math.floor(Number(inv.paymentTermsDays)||0)));
  select.value=['0','7','14','21','30','60'].indexOf(String(n))>=0?String(n):'custom';custom.value=n;wrap.style.display=select.value==='custom'?'block':'none';
  function refresh(){var days=Math.max(0,Math.min(365,Math.floor(Number(inv.paymentTermsDays)||0)));var due=inv.dueDate||datePlus(inv.invoiceDate,days);summary.textContent=days===0?'Payment due on receipt.':'Payment due within '+days+' days, by '+due+'.';updateDue(inv)}
  select.onchange=function(){wrap.style.display=this.value==='custom'?'block':'none'};
  toggle.onclick=function(){var open=box.style.display==='none';box.style.display=open?'block':'none';toggle.textContent=open?'✕ Close Terms':'✏️ Change Terms';if(open)select.focus()};
  box.querySelector('#tqbTermsSaveV3').onclick=function(){var days=select.value==='custom'?Math.floor(Number(custom.value)||0):Number(select.value);days=Math.max(0,Math.min(365,days));var all=list();for(var i=0;i<all.length;i++){if(String(all[i].id)===String(inv.id)){all[i].paymentTermsDays=days;all[i].dueDate=datePlus(all[i].invoiceDate,days);inv=all[i];break}}save(all);refresh();status.textContent='✓ Saved. Due date updated to '+inv.dueDate+'.';setTimeout(function(){box.style.display='none';toggle.textContent='✏️ Change Terms'},1200)};
  refresh();
}
function inject(){var v=view();if(!v)return;var inv=current();if(!inv)return;var payment=v.querySelector('.invoice-payment');if(!payment)return;if(payment.querySelector('#'+READY))return;build(inv,payment)}
function start(){inject();setInterval(inject,1200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();