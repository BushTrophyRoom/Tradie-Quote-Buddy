(function(){
'use strict';
var KEY='tqb_invoices_v1';
function read(){try{var x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function currentInvoiceId(){
  var view=document.getElementById('invoiceView');
  if(!view)return null;
  var meta=view.querySelector('.invoice-meta b');
  var number=meta?(meta.textContent||'').trim():'';
  if(!number){var m=(view.textContent||'').match(/INV-\d+/);number=m?m[0]:''}
  if(!number)return null;
  var list=read();
  for(var i=0;i<list.length;i++)if(String(list[i].number||'')===number)return list[i].id;
  return null;
}
function deleteInvoice(id){
  var list=read(),inv=null;
  for(var i=0;i<list.length;i++)if(String(list[i].id)===String(id)){inv=list[i];break}
  if(!inv){alert('Could not find this invoice. Please refresh the app and try again.');return}
  if(!confirm('Delete invoice '+(inv.number||'')+'?\n\nThis will permanently remove the invoice from this device.'))return;
  localStorage.setItem(KEY,JSON.stringify(list.filter(function(x){return String(x.id)!==String(id)})));
  var view=document.getElementById('invoiceView'),listEl=document.getElementById('invoiceList');
  if(view)view.innerHTML='';
  if(listEl)listEl.style.display='grid';
  var refresh=document.getElementById('invoiceRefresh');
  if(refresh)refresh.click();
}
function style(){
  if(document.getElementById('tqb-direct-delete-style'))return;
  var s=document.createElement('style');s.id='tqb-direct-delete-style';
  s.textContent='.tqb-delete-invoice{border:0;border-radius:12px;padding:13px 17px;background:#e53935;color:#fff;font-weight:800;cursor:pointer;font-size:15px;min-height:46px}.tqb-delete-invoice:hover{filter:brightness(.95)}';
  document.head.appendChild(s);
}
function addDetailButton(){
  var view=document.getElementById('invoiceView');
  if(!view)return;
  var id=currentInvoiceId();
  if(!id)return;
  var actions=view.querySelector('.invoice-actions');
  if(!actions||actions.querySelector('.tqb-delete-invoice'))return;
  var b=document.createElement('button');
  b.type='button';b.className='tqb-delete-invoice';b.textContent='🗑️ Delete Invoice';
  b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();deleteInvoice(id)});
  actions.appendChild(b);
}
function removeListButtons(){
  var buttons=document.querySelectorAll('#invoiceList .tqb-delete-invoice, #invoiceList .invoice-delete-btn, #invoiceList #deleteInvoiceBtn');
  for(var i=0;i<buttons.length;i++)buttons[i].remove();
}
function ensureButtons(){style();removeListButtons();addDetailButton()}
function start(){
  if(window.MutationObserver){var o=new MutationObserver(function(){window.requestAnimationFrame(ensureButtons)});o.observe(document.body,{childList:true,subtree:true})}
  ensureButtons();
  setInterval(ensureButtons,500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
