(function(){
'use strict';
var KEY='tqb_customers_v1',QKEY='tqb_quotes_v6',IKEY='tqb_invoices_v1';
function read(k){try{var x=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function money(v){return new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD'}).format(Number(v)||0)}
function norm(v){return String(v||'').trim().toLowerCase().replace(/\s+/g,' ')}
function identity(x){return norm(x.email)||norm(x.phone)||norm(x.name)}
function esc(v){return String(v==null?'':v).replace(/[&<>\"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'})[c]})}
function getCustomer(id){var saved=read(KEY);return saved.find(function(c){return String(c.id)===String(id)})||null}
function open(id){
 var c=getCustomer(id);if(!c)return;
 var d=document.getElementById('customerDetail');if(!d)return;
 var qs=read(QKEY).filter(function(q){return identity({name:q.customerName,email:q.customerEmail,phone:q.customerPhone})===identity(c)});
 var ins=read(IKEY).filter(function(i){return identity({name:i.customerName,email:i.customerEmail,phone:i.customerPhone})===identity(c)});
 var total=ins.reduce(function(a,i){return a+(Number(i.total)||0)},0),paid=ins.filter(function(i){return String(i.status||'').toLowerCase()==='paid'}).reduce(function(a,i){return a+(Number(i.total)||0)},0);
 d.dataset.customerId=c.id;
 d.innerHTML='<div class="customers-v2-detail"><div class="customers-v2-detail-head"><div><h2>'+esc(c.name)+'</h2><div>'+esc(c.email||'No email')+'</div><div>'+esc(c.phone||'No phone')+'</div><div>'+esc(c.address||'No address')+'</div></div><div class="customers-v2-detail-actions"><button class="secondary" id="customerNewQuote">＋ New Quote</button><button class="secondary" id="customerEdit">✏️ Edit</button><button class="danger" id="customerDelete">🗑 Delete</button></div></div><div class="customers-v2-stat-grid"><div class="customers-v2-stat"><span>Total invoiced</span><b>'+money(total)+'</b></div><div class="customers-v2-stat"><span>Total paid</span><b>'+money(paid)+'</b></div><div class="customers-v2-stat"><span>Outstanding</span><b>'+money(Math.max(0,total-paid))+'</b></div></div><h3>Account history</h3><div class="customers-v2-history">'+(qs.concat(ins).length?qs.concat(ins).map(function(r){var isI=ins.indexOf(r)>=0;return '<div class="customers-v2-history-row"><div><b>'+esc(isI?'Invoice':'Quote')+' '+esc(r.number||r.invoiceNumber||'')+'</b><span class="customers-v2-badge">'+esc(r.status||r.quoteStatus||'Pending')+'</span><small>'+esc(r.date||r.invoiceDate||r.createdAt||'')+'</small></div><b>'+money(r.total)+'</b></div>'}).join(''):'<p class="storage-note">No quotes or invoices yet.</p>')+'</div></div>';
 document.getElementById('customerEdit').onclick=function(){if(typeof window.tqbEditCustomer==='function')window.tqbEditCustomer(c.id);else{var b=document.getElementById('customerDetail');b.querySelector('h2').scrollIntoView();alert('Customer edit is available from the Edit button.')}};
 document.getElementById('customerDelete').onclick=function(){if(!confirm('Delete '+c.name+' from your customer list? Existing quotes and invoices will not be deleted.'))return;localStorage.setItem(KEY,JSON.stringify(read(KEY).filter(function(x){return String(x.id)!==String(c.id)})));d.innerHTML='';var r=document.getElementById('customerRefresh');if(r)r.click()};
 document.getElementById('customerNewQuote').onclick=function(){var b=document.querySelector('[data-screen="quoteForm"]');if(b)b.click();setTimeout(function(){[['customerName',c.name],['customerPhone',c.phone],['customerEmail',c.email],['customerAddress',c.address]].forEach(function(p){var el=document.getElementById(p[0])||document.querySelector('[name="'+p[0]+'"]');if(el){el.value=p[1]||'';el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))}})},200)};
 document.querySelectorAll('.customers-v2-card').forEach(function(x){x.classList.toggle('selected',String(x.dataset.customerId)===String(id))});
}
function wire(){var list=document.getElementById('customerList');if(!list||list.dataset.directWired)return;list.dataset.directWired='1';list.addEventListener('pointerdown',function(e){var card=e.target.closest('.customers-v2-card');if(!card)return;if(e.target.closest('button'))return;e.preventDefault();e.stopPropagation();open(card.dataset.customerId)},true);list.addEventListener('click',function(e){var btn=e.target.closest('.customer-view-btn');if(btn){var card=btn.closest('.customers-v2-card');if(card){e.preventDefault();e.stopPropagation();open(card.dataset.customerId)}}},true)}
function start(){wire();setInterval(wire,500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();window.tqbOpenCustomerDirect=open;
})();
