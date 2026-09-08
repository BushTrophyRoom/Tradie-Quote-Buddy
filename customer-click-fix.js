(function(){
'use strict';
var Q='tqb_quotes_v6',I='tqb_invoices_v1',C='tqb_customers_v1';
function read(k){try{var x=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function esc(v){return String(v==null?'':v).replace(/[&<>\"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'})[c]})}
function money(v){return new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD'}).format(Number(v)||0)}
function norm(v){return String(v||'').trim().toLowerCase().replace(/\s+/g,' ')}
function ident(x){return norm(x.email)||norm(x.phone)||norm(x.name)}
function openDirect(c){
 if(!c)return;
 var qs=read(Q).filter(function(q){return ident({name:q.customerName,email:q.customerEmail,phone:q.customerPhone})===ident(c)});
 var ins=read(I).filter(function(i){return ident({name:i.customerName,email:i.customerEmail,phone:i.customerPhone})===ident(c)});
 var rows=qs.map(function(q){return{type:'Quote',number:q.number||'Quote',date:q.date||q.createdAt,total:q.total,status:q.status||q.quoteStatus||'Pending'}}).concat(ins.map(function(i){return{type:'Invoice',number:i.number||'Invoice',date:i.invoiceDate||i.date,total:i.total,status:i.status||'Unpaid'}}));
 rows.sort(function(a,b){return String(b.date||'').localeCompare(String(a.date||''))});
 var paid=ins.filter(function(i){return String(i.status||'').toLowerCase()==='paid'}).reduce(function(a,i){return a+(Number(i.total)||0)},0),total=ins.reduce(function(a,i){return a+(Number(i.total)||0)},0);
 var d=document.getElementById('customerDetail');if(!d)return;d.dataset.customerId=c.id||'';
 d.innerHTML='<div class="customers-v2-detail"><div class="customers-v2-detail-head"><div><h2>'+esc(c.name)+'</h2><div>'+esc(c.email||'No email')+'</div><div>'+esc(c.phone||'No phone')+'</div><div>'+esc(c.address||'No address')+'</div></div><div class="customers-v2-detail-actions"><button class="secondary" id="customerNewQuote">＋ New Quote</button><button class="secondary" id="customerEdit">✏️ Edit</button><button class="danger" id="customerDelete">🗑 Delete</button></div></div><div class="customers-v2-stat-grid"><div class="customers-v2-stat"><span>Total invoiced</span><b>'+money(total)+'</b></div><div class="customers-v2-stat"><span>Total paid</span><b>'+money(paid)+'</b></div><div class="customers-v2-stat"><span>Outstanding</span><b>'+money(Math.max(0,total-paid))+'</b></div></div><h3>Account history</h3><div class="customers-v2-history">'+(rows.length?rows.slice(0,20).map(function(r){return '<div class="customers-v2-history-row"><div><b>'+esc(r.type)+' '+esc(r.number)+'</b><span class="customers-v2-badge">'+esc(r.status)+'</span><small>'+esc(r.date||'')+'</small></div><b>'+money(r.total)+'</b></div>'}).join(''):'<p class="storage-note">No quotes or invoices yet.</p>')+'</div>'+(c.notes?'<h3>Private notes</h3><p>'+esc(c.notes)+'</p>':'')+'</div>';
 var edit=document.getElementById('customerEdit');if(edit)edit.onclick=function(){if(window.tqbCustomerEdit)window.tqbCustomerEdit(c);else{alert('Customer editing is loading. Please try again.')}};
 var del=document.getElementById('customerDelete');if(del)del.onclick=function(){if(!confirm('Delete '+c.name+' from your customer list? Existing quotes and invoices will not be deleted.'))return;localStorage.setItem(C,JSON.stringify(read(C).filter(function(x){return String(x.id)!==String(c.id)})));if(window.tqbShowCustomers)window.tqbShowCustomers()};
 var nq=document.getElementById('customerNewQuote');if(nq)nq.onclick=function(){var b=document.querySelector('[data-screen="quoteForm"]');if(b)b.click()};
}
function start(){
 var style=document.getElementById('tqb-customer-direct-style')||document.createElement('style');style.id='tqb-customer-direct-style';style.textContent='.customers-v2-grid,.customers-v2-card{position:relative;z-index:9999!important}.customers-v2-card{pointer-events:auto!important;cursor:pointer!important}.customers-v2-card:after{content:"";position:absolute;inset:0;z-index:1;pointer-events:none}.customers-v2-card *{position:relative;z-index:2}';document.head.appendChild(style);
 document.addEventListener('click',function(e){var card=e.target&&e.target.closest?e.target.closest('.customers-v2-card'):null;if(!card)return;if(e.target.closest&&e.target.closest('button'))return;var name=card.querySelector('.customers-v2-name');var wanted=name?name.textContent.trim():'';if(!wanted)return;var saved=read(C),c=saved.find(function(x){return norm(x.name)===norm(wanted)});if(c){e.preventDefault();e.stopImmediatePropagation();openDirect(c)}},true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
