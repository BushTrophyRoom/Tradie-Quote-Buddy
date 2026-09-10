(function(){
'use strict';
function mobile(){return window.matchMedia&&window.matchMedia('(max-width:700px)').matches}
function readQuotes(){try{var q=JSON.parse(localStorage.getItem('tqb_quotes_v6')||'[]');return Array.isArray(q)?q:[]}catch(e){return[]}}
function status(q){var s=String(q&& (q.status||q.quoteStatus)||'').toLowerCase();if(s.indexOf('accept')>=0)return['Accepted','accepted'];if(s.indexOf('declin')>=0||s.indexOf('reject')>=0)return['Declined','declined'];return['Pending','pending']}
function decorate(){
 if(!mobile())return;
 var list=document.getElementById('allQuotes');if(!list)return;
 var qs=readQuotes();
 var head=list.parentElement&&list.parentElement.querySelector('.section-head');
 if(head){var h=head.querySelector('h2');if(h){var count=head.querySelector('.quote-mobile-count');if(!count){count=document.createElement('div');count.className='quote-mobile-count';h.insertAdjacentElement('afterend',count)}count.textContent=qs.length+' '+(qs.length===1?'quote':'quotes')+' saved';}}
 var cards=list.querySelectorAll('.quote-card');
 for(var i=0;i<cards.length;i++){
   var card=cards[i];if(card.dataset.mobileDecorated==='1')continue;
   var id=card.getAttribute('data-id'),q=null;
   for(var j=0;j<qs.length;j++)if(String(qs[j].id)===String(id)){q=qs[j];break}
   var st=status(q);
   var row=card.querySelector('.row');
   if(row){var badge=document.createElement('span');badge.className='quote-mobile-status quote-mobile-status-'+st[1];badge.textContent=st[0];row.insertBefore(badge,row.firstChild)}
   var arrow=document.createElement('span');arrow.className='quote-mobile-arrow';arrow.textContent='›';card.appendChild(arrow);
   card.dataset.mobileDecorated='1';
 }
}
function css(){if(document.getElementById('quote-list-mobile-style'))return;var s=document.createElement('style');s.id='quote-list-mobile-style';s.textContent=`
@media(max-width:700px){
 #saved .section-head{position:relative;display:block!important;min-height:62px!important;padding-left:2px!important}
 #saved .section-head .back-btn{position:absolute!important;left:0!important;top:0!important}
 #saved .section-head h2{margin:30px 0 0!important;font-size:25px!important;line-height:1.1!important}
 .quote-mobile-count{margin-top:5px!important;color:#737b86!important;font-size:13px!important;font-weight:500!important}
 #allQuotes{display:grid!important;gap:10px!important}
 #allQuotes .quote-card{position:relative!important;padding:15px 44px 14px 15px!important;min-height:100px!important;border-radius:15px!important;background:#fff!important;border:1px solid #e4e8ed!important;box-shadow:0 2px 8px #1720330b!important;overflow:hidden!important}
 #allQuotes .quote-card .row{display:grid!important;grid-template-columns:1fr auto!important;align-items:start!important;gap:8px!important;min-height:27px!important}
 #allQuotes .quote-card .row>b:first-of-type{font-size:17px!important;line-height:1.25!important}
 #allQuotes .quote-card .row>b:last-of-type{font-size:18px!important;white-space:nowrap!important}
 #allQuotes .quote-card small{display:block!important;margin-top:4px!important;color:#737b86!important;font-size:12px!important}
 #allQuotes .quote-card .desc{margin-top:7px!important;color:#4b5563!important;font-size:13px!important;line-height:1.35!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
 .quote-mobile-status{display:inline-flex!important;align-items:center!important;justify-content:center!important;grid-column:1/-1!important;grid-row:2!important;justify-self:start!important;padding:4px 8px!important;border-radius:999px!important;font-size:11px!important;font-weight:700!important;line-height:1!important;background:#fff7ed!important;color:#9a3412!important}
 .quote-mobile-status-accepted{background:#ecfdf5!important;color:#047857!important}.quote-mobile-status-declined{background:#fff1f2!important;color:#be123c!important}.quote-mobile-status-pending{background:#fff7ed!important;color:#9a3412!important}
 .quote-mobile-arrow{position:absolute!important;right:15px!important;top:50%!important;transform:translateY(-50%)!important;font-size:31px!important;line-height:1!important;color:#9ca3af!important;font-weight:300!important;pointer-events:none!important}
}
`;document.head.appendChild(s)}
function start(){css();decorate();var list=document.getElementById('allQuotes');if(list)new MutationObserver(function(){decorate()}).observe(list,{childList:true,subtree:true});document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-screen="saved"]'))setTimeout(decorate,80)});setInterval(decorate,1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
