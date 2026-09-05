(function () {
  'use strict';

  var QUOTES_KEY = 'tqb_quotes_v6';
  var SETTINGS_KEY = 'tqb_settings_v6';
  var quotes = [];
  var settings = { businessName:'Your Business Name', abn:'', businessPhone:'', businessEmail:'', businessAddress:'', defaultRate:90, quoteSequence:0 };
  var currentQuote = null;
  var editingId = null;
  var PDF_LIBRARY_URL = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js';
  var pdfLibraryPromise = null;

  function $(id) { return document.getElementById(id); }
  function money(value) { return new Intl.NumberFormat('en-AU', {style:'currency', currency:'AUD'}).format(Number(value) || 0); }
  function read(key, fallback) { try { var raw=localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch(e) { return fallback; } }
  function save() { try { localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes)); localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch(e) {} }
  function escapeHtml(value) { return String(value == null ? '' : value).replace(/[&<>\"']/g,function(ch){var map={'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'};return map[ch];}); }
  function maxQuoteSequence() { var max=0; for(var i=0;i<quotes.length;i++){var m=String(quotes[i].number||'').match(/^Q-(\d{3})$/);if(m)max=Math.max(max,Number(m[1])||0);} return max; }
  function ensureQuoteSequence() { var stored=Number(settings.quoteSequence)||0; var existing=maxQuoteSequence(); if(stored>999)stored=0; if(existing>stored)stored=existing; settings.quoteSequence=stored; }
  function nextQuoteNumber() { ensureQuoteSequence(); settings.quoteSequence=(Number(settings.quoteSequence)||0)+1; save(); return 'Q-'+String(settings.quoteSequence).padStart(3,'0'); }

  function show(id) {
    var screens=document.querySelectorAll('.screen'), navs=document.querySelectorAll('.nav'), i;
    for(i=0;i<screens.length;i++)screens[i].classList.toggle('active',screens[i].id===id);
    for(i=0;i<navs.length;i++)navs[i].classList.toggle('active',navs[i].getAttribute('data-screen')===id);
    if(id==='dashboard')renderDashboard(); if(id==='saved')renderSaved(); if(id==='settings')loadSettings(); window.scrollTo(0,0);
  }

  function calc() {
    var amounts=document.querySelectorAll('.item-amount'), materials=0, i;
    for(i=0;i<amounts.length;i++)materials+=Number(amounts[i].value)||0;
    var hours=Number($('labourHours').value)||0, rate=Number($('hourlyRate').value)||0, labour=hours*rate;
    var subtotal=materials+labour, gst=$('gstEnabled').checked?subtotal*0.10:0, total=subtotal+gst;
    $('subtotal').textContent=money(subtotal); $('gst').textContent=money(gst); $('grandTotal').textContent=money(total);
    return {materials:materials,labour:labour,subtotal:subtotal,gst:gst,total:total};
  }

  function addItem(description,amount) {
    var row=document.createElement('div'); row.className='item';
    row.innerHTML='<input class="item-desc" placeholder="Material or other cost"><input class="item-amount" type="number" min="0" step="0.01" placeholder="$"><button type="button" aria-label="Remove item">✕</button>';
    row.querySelector('.item-desc').value=description||''; row.querySelector('.item-amount').value=amount==null?'':amount;
    row.querySelector('.item-desc').addEventListener('input',calc); row.querySelector('.item-amount').addEventListener('input',calc);
    row.querySelector('button').addEventListener('click',function(){row.remove();calc();}); $('lineItems').appendChild(row);
  }

  function resetForm() {
    editingId=null; currentQuote=null; $('quoteFormEl').reset(); $('lineItems').innerHTML=''; addItem('','');
    $('hourlyRate').value=settings.defaultRate||90; $('quoteFormTitle').textContent='New quote'; $('saveQuoteBtn').textContent='Save & Preview Quote'; calc();
  }

  function collectQuote() {
    var totals=calc(), rows=document.querySelectorAll('.item'), items=[], i;
    for(i=0;i<rows.length;i++){var desc=rows[i].querySelector('.item-desc').value.trim(),amount=Number(rows[i].querySelector('.item-amount').value)||0;if(desc||amount)items.push({description:desc,amount:amount});}
    return {id:editingId||String(Date.now())+'-'+Math.random().toString(16).slice(2),number:currentQuote&&currentQuote.number?currentQuote.number:nextQuoteNumber(),date:currentQuote&&currentQuote.date?currentQuote.date:new Date().toLocaleDateString('en-AU'),customerName:$('customerName').value.trim(),customerPhone:$('customerPhone').value.trim(),customerEmail:$('customerEmail').value.trim(),customerAddress:$('customerAddress').value.trim(),jobDescription:$('jobDescription').value.trim(),items:items,labourHours:Number($('labourHours').value)||0,hourlyRate:Number($('hourlyRate').value)||0,materials:totals.materials,labour:totals.labour,subtotal:totals.subtotal,gst:totals.gst,total:totals.total,savedAt:Date.now()};
  }

  function quoteCard(q) { return '<div class="quote-card" data-id="'+escapeHtml(q.id)+'"><div class="row"><b>'+escapeHtml(q.customerName||'Unnamed customer')+'</b><b>'+money(q.total)+'</b></div><small>'+escapeHtml(q.number||'')+' · '+escapeHtml(q.date||'')+'</small><div class="desc">'+escapeHtml(q.jobDescription||'')+'</div></div>'; }
  function bindCards(){var cards=document.querySelectorAll('.quote-card'),i;for(i=0;i<cards.length;i++)cards[i].onclick=function(){var id=this.getAttribute('data-id'),j;for(j=0;j<quotes.length;j++)if(String(quotes[j].id)===String(id)){currentQuote=quotes[j];renderPreview(currentQuote);show('preview');return;}};}
  function renderDashboard(){var total=0,i;for(i=0;i<quotes.length;i++)total+=Number(quotes[i].total)||0;$('quoteCount').textContent=quotes.length;$('totalQuoted').textContent=money(total);$('recentQuotes').innerHTML=quotes.length?quotes.slice(0,5).map(quoteCard).join(''):'<div class="empty">No quotes yet.<br><br>Tap <b>New Quote</b> to create your first one.</div>';bindCards();}
  function renderSaved(){$('allQuotes').innerHTML=quotes.length?quotes.map(quoteCard).join(''):'<div class="empty">No saved quotes yet.</div>';bindCards();}

  function renderPreview(q) {
    var rows='',i;
    for(i=0;i<(q.items||[]).length;i++)rows+='<tr><td>'+escapeHtml(q.items[i].description)+'</td><td>'+money(q.items[i].amount)+'</td></tr>';
    if(q.labourHours)rows+='<tr><td>Labour ('+q.labourHours+' hrs × '+money(q.hourlyRate)+'/hr)</td><td>'+money(q.labour)+'</td></tr>';
    var businessContact=''; if(settings.businessAddress)businessContact+='<div>'+escapeHtml(settings.businessAddress)+'</div>'; if(settings.businessPhone)businessContact+='<div>'+escapeHtml(settings.businessPhone)+'</div>'; if(settings.businessEmail)businessContact+='<div>'+escapeHtml(settings.businessEmail)+'</div>'; if(settings.abn)businessContact+='<div>ABN '+escapeHtml(settings.abn)+'</div>';
    var customerContact=''; if(q.customerPhone)customerContact+='<div>'+escapeHtml(q.customerPhone)+'</div>'; if(q.customerEmail)customerContact+='<div>'+escapeHtml(q.customerEmail)+'</div>'; if(q.customerAddress)customerContact+='<div>'+escapeHtml(q.customerAddress).replace(/\n/g,'<br>')+'</div>';
    $('quotePreview').innerHTML='<div class="paper-head"><div><div class="logo">🛠️</div><h1>'+escapeHtml(settings.businessName)+'</h1>'+businessContact+'</div><div class="paper-meta"><h2>QUOTE</h2><b>'+escapeHtml(q.number)+'</b><div>'+escapeHtml(q.date)+'</div></div></div><div class="customer-block"><b>Quote for</b><div>'+escapeHtml(q.customerName)+'</div>'+customerContact+'</div><p class="job"><b>Job description</b><br>'+escapeHtml(q.jobDescription).replace(/\n/g,'<br>')+'</p><table><thead><tr><th>Description</th><th>Amount</th></tr></thead><tbody>'+rows+'</tbody></table><div class="paper-total"><div><span>Subtotal</span><span>'+money(q.subtotal)+'</span></div><div><span>GST</span><span>'+money(q.gst)+'</span></div><div class="grand"><span>Total</span><span>'+money(q.total)+'</span></div></div><p class="thanks">Thank you for the opportunity to quote on your job.</p>';
  }

  function editQuote(q){editingId=q.id;currentQuote=q;$('quoteFormTitle').textContent='Edit quote';$('saveQuoteBtn').textContent='Update Quote';$('customerName').value=q.customerName||'';$('customerPhone').value=q.customerPhone||'';$('customerEmail').value=q.customerEmail||'';$('customerAddress').value=q.customerAddress||'';$('jobDescription').value=q.jobDescription||'';$('labourHours').value=q.labourHours||0;$('hourlyRate').value=q.hourlyRate||settings.defaultRate||90;$('gstEnabled').checked=Number(q.gst)>0;$('lineItems').innerHTML='';var i;for(i=0;i<(q.items||[]).length;i++)addItem(q.items[i].description,q.items[i].amount);if(!q.items||!q.items.length)addItem('','');calc();show('quoteForm');}
  function loadSettings(){$('businessName').value=settings.businessName||'';$('abn').value=settings.abn||'';$('businessPhone').value=settings.businessPhone||'';$('businessEmail').value=settings.businessEmail||'';$('businessAddress').value=settings.businessAddress||'';$('defaultRate').value=settings.defaultRate||0;}

  function backup(){var blob=new Blob([JSON.stringify({version:7,quotes:quotes,settings:settings},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='tradie-quote-buddy-backup.json';a.click();setTimeout(function(){URL.revokeObjectURL(a.href);},1000);}

  function loadPdfLibrary(){
    if(window.html2pdf)return Promise.resolve(window.html2pdf);
    if(pdfLibraryPromise)return pdfLibraryPromise;
    pdfLibraryPromise=new Promise(function(resolve,reject){
      var script=document.createElement('script'); script.src=PDF_LIBRARY_URL; script.async=true;
      script.onload=function(){if(window.html2pdf)resolve(window.html2pdf);else reject(new Error('PDF library unavailable'));};
      script.onerror=function(){reject(new Error('Could not load PDF library'));}; document.head.appendChild(script);
    });
    return pdfLibraryPromise;
  }

  function downloadBlob(blob,filename){var url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},2000);}

  function sharePdf(){
    if(!currentQuote)return;
    var button=$('printBtn'),original=button.textContent,element=$('quotePreview'),filename='quote-'+(currentQuote.number||'quote')+'.pdf';
    button.disabled=true; button.textContent='⏳ Creating PDF…';
    loadPdfLibrary().then(function(html2pdf){
      return html2pdf().set({margin:[0.35,0.35,0.35,0.35],filename:filename,image:{type:'jpeg',quality:0.98},html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff'},jsPDF:{unit:'in',format:'a4',orientation:'portrait'}}).from(element).outputPdf('blob');
    }).then(function(blob){
      var file=new File([blob],filename,{type:'application/pdf'});
      if(navigator.share && navigator.canShare && navigator.canShare({files:[file]})){
        return navigator.share({files:[file],title:'Tradie Quote Buddy '+(currentQuote.number||''),text:'Quote '+(currentQuote.number||'')}).catch(function(err){if(err&&err.name==='AbortError')return;throw err;});
      }
      downloadBlob(blob,filename);
    }).catch(function(){
      window.print();
    }).then(function(){button.disabled=false;button.textContent=original;});
  }

  function wire(){
    $('newQuoteBtn').onclick=function(){resetForm();show('quoteForm');};
    $('addItemBtn').onclick=function(){addItem('','');};
    $('settingsBtn').onclick=function(){show('settings');};
    $('viewAllBtn').onclick=function(){show('saved');};
    $('printBtn').onclick=sharePdf;
    $('editQuoteBtn').onclick=function(){if(currentQuote)editQuote(currentQuote);};
    $('deleteQuoteBtn').onclick=function(){if(currentQuote)$('confirmModal').classList.add('show');};
    $('cancelDelete').onclick=function(){$('confirmModal').classList.remove('show');};
    $('confirmDelete').onclick=function(){if(!currentQuote)return;quotes=quotes.filter(function(q){return q.id!==currentQuote.id;});save();currentQuote=null;$('confirmModal').classList.remove('show');show('saved');};
    $('quoteFormEl').onsubmit=function(e){e.preventDefault();var q=collectQuote(),index=-1,i;for(i=0;i<quotes.length;i++)if(quotes[i].id===editingId)index=i;if(index>=0)quotes[index]=q;else quotes.unshift(q);currentQuote=q;save();renderPreview(q);show('preview');};
    $('settingsForm').onsubmit=function(e){e.preventDefault();settings={businessName:$('businessName').value.trim(),abn:$('abn').value.trim(),businessPhone:$('businessPhone').value.trim(),businessEmail:$('businessEmail').value.trim(),businessAddress:$('businessAddress').value.trim(),defaultRate:Number($('defaultRate').value)||0,quoteSequence:Number(settings.quoteSequence)||maxQuoteSequence()};save();show('dashboard');};
    $('backupBtn').onclick=backup; $('restoreBtn').onclick=function(){$('restoreFile').click();};
    $('restoreFile').onchange=function(e){var file=e.target.files[0];if(!file)return;var reader=new FileReader();reader.onload=function(){try{var data=JSON.parse(reader.result);if(!Array.isArray(data.quotes))throw new Error('invalid');quotes=data.quotes;settings=Object.assign({},settings,data.settings||{});ensureQuoteSequence();save();show('dashboard');}catch(err){alert('That backup file could not be restored.');}};reader.readAsText(file);e.target.value='';};
    var subscribe=$('subscribeBtn');if(subscribe)subscribe.onclick=function(){location.href='subscription.html';};
    var back=document.querySelectorAll('[data-back]'),b;for(b=0;b<back.length;b++)back[b].onclick=function(){show('dashboard');};
    var navs=document.querySelectorAll('.nav'),n;for(n=0;n<navs.length;n++)navs[n].onclick=function(){var target=this.getAttribute('data-screen');if(target==='quoteForm')resetForm();show(target);};
  }

  function start(){
    quotes=read(QUOTES_KEY,[]); settings=Object.assign({},settings,read(SETTINGS_KEY,{})); ensureQuoteSequence(); save(); wire(); resetForm(); renderDashboard();
    if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js?v=9').catch(function(){});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
