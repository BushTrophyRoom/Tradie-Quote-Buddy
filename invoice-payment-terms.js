(function(){
'use strict';
var KEY='tqb_invoices_v1';
function list(){try{var x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function save(x){localStorage.setItem(KEY,JSON.stringify(x))}
function datePlus(dateStr,days){var p=String(dateStr||'').split('/'),d;if(p.length===3)d=new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));else d=new Date(dateStr);if(isNaN(d.getTime()))d=new Date();d.setDate(d.getDate()+Number(days||0));return d.toLocaleDateString('en-AU')}
function current(){var v=document.getElementById('invoiceView')||document.querySelector('.tqb-invoice-detail');if(!v)return null;var m=(v.textContent||'').match(/INV-\d+/);if(!m)return null;return list().find(function(x){return String(x.number)===m[0]})||null}
function update(inv){var v=document.getElementById('invoiceView')||document.querySelector('.tqb-invoice-detail');if(!v)return;var due=inv.dueDate||datePlus(inv.invoiceDate,inv.paymentTermsDays||0);var dueEl=v.querySelector('#invoiceDueDate');if(dueEl)dueEl.textContent='Due: '+due;var text=v.querySelector('#invoicePaymentText');if(text)text.textContent=Number(inv.paymentTermsDays)===0?'Payment due on receipt.':'Payment due within '+inv.paymentTermsDays+' days, by '+due+'.'}
function inject(){var v=document.getElementById('invoiceView')||document.querySelector('.tqb-invoice-detail');if(!v)return;var inv=current();if(!inv)return;var payment=v.querySelector('.invoice-payment');if(!payment)return;
  var head=payment.querySelector('.invoice-payment-head');
  if(head&&!head.querySelector('#tqbTermsEditV2')&&!head.querySelector('.invoice-terms-toggle')){
    var btn=document.createElement('button');btn.type='button';btn.id='tqbTermsEditV2';btn.className='invoice-terms-toggle';btn.textContent='✏️ Change Terms';head.appendChild(btn);
  }
  if(v.querySelector('#tqbTermsEditorV2'))return;
  var box=document.createElement('div');box.id='tqbTermsEditorV2';box.style.cssText='display:none;margin-top:12px;padding:14px;border:1px solid #e1e5eb;border-radius:11px;background:#fff';
  box.innerHTML='<label style="display:block;font-size:13px;font-weight:700;color:#475467;margin:0">Payment terms<select id="tqbTermsSelectV2" style="display:block;width:100%;margin-top:7px;border:1px solid #d1d5db;border-radius:9px;padding:12px;font:inherit;font-size:16px;background:#fff"><option value="0">Due on receipt</option><option value="7">7 days</option><option value="14">14 days</option><option value="21">21 days</option><option value="30">30 days</option><option value="60">60 days</option><option value="custom">Custom</option></select></label><label id="tqbCustomWrapV2" style="display:none;margin-top:10px;font-size:13px;font-weight:700;color:#475467">Custom days<input id="tqbCustomDaysV2" type="number" min="0" max="365" step="1" style="display:block;width:100%;margin-top:7px;border:1px solid #d1d5db;border-radius:9px;padding:12px;font:inherit;font-size:16px;background:#fff"></label><button type="button" id="tqbTermsSaveV2" class="primary" style="width:100%;margin-top:12px">Save Payment Terms</button><div id="tqbTermsStatusV2" style="font-size:12px;color:#667085;margin-top:8px"></div>';
  payment.appendChild(box);
  var edit=head&&head.querySelector('#tqbTermsEditV2'),select=box.querySelector('#tqbTermsSelectV2'),custom=box.querySelector('#tqbCustomWrapV2'),customDays=box.querySelector('#tqbCustomDaysV2');
  var n=Math.max(0,Math.floor(Number(inv.paymentTermsDays)||0));
  select.value=['0','7','14','21','30','60'].indexOf(String(n))>=0?String(n):'custom';customDays.value=n;custom.style.display=select.value==='custom'?'block':'none';
  select.onchange=function(){custom.style.display=this.value==='custom'?'block':'none'};
  if(edit)edit.onclick=function(){var open=box.style.display!=='block';box.style.display=open?'block':'none';this.textContent=open?'✕ Close':'✏️ Change Terms';if(open)select.focus()};
  box.querySelector('#tqbTermsSaveV2').onclick=function(){var days=select.value==='custom'?Math.floor(Number(customDays.value)||0):Number(select.value);days=Math.max(0,Math.min(365,days));var all=list();for(var i=0;i<all.length;i++){if(String(all[i].id)===String(inv.id)){all[i].paymentTermsDays=days;all[i].dueDate=datePlus(all[i].invoiceDate,days);inv=all[i];break}}save(all);update(inv);box.querySelector('#tqbTermsStatusV2').textContent='✓ Saved. Due date updated to '+inv.dueDate+'.';setTimeout(function(){box.style.display='none';if(edit)edit.textContent='✏️ Change Terms';},1200)};
  update(inv);
}
function start(){inject();if(window.MutationObserver)new MutationObserver(function(){setTimeout(inject,0)}).observe(document.body,{childList:true,subtree:true});setInterval(inject,1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();