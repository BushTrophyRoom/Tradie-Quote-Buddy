(function(){
'use strict';
if(window.__dustybootsQuotePreviewMobileLoaded)return;
window.__dustybootsQuotePreviewMobileLoaded=true;
function mobile(){return window.matchMedia&&window.matchMedia('(max-width:700px)').matches}
function setup(){
 if(!mobile())return false;
 var screen=document.getElementById('preview');
 if(!screen)return false;
 var head=screen.querySelector('.section-head');
 if(head){head.style.position='relative';head.style.display='grid';head.style.gridTemplateColumns='auto 1fr auto';head.style.alignItems='center';head.style.gap='10px';var back=head.querySelector('.back-btn');if(back){back.style.position='static';back.style.margin='0';}var h=head.querySelector('h2');if(h){h.style.margin='0';h.style.fontSize='24px';h.style.textAlign='center';}var share=head.querySelector('#printBtn');if(share){share.style.margin='0';share.style.whiteSpace='nowrap';share.style.fontSize='14px';}}
 var preview=document.getElementById('quotePreview');
 if(!preview)return true;
 var buttons=[];
 screen.querySelectorAll('button').forEach(function(b){var t=(b.textContent||'').trim();if(/Edit Quote|Delete Quote|Send Quote to Customer|Awaiting Customer Acceptance/i.test(t))buttons.push(b)});
 if(buttons.length){
   var wrap=document.getElementById('quote-preview-actions-mobile');
   if(!wrap){wrap=document.createElement('section');wrap.id='quote-preview-actions-mobile';wrap.className='quote-preview-actions-mobile';var title=document.createElement('h3');title.textContent='Quote actions';wrap.appendChild(title);preview.parentNode.insertBefore(wrap,preview)}
   buttons.forEach(function(b){if(b.parentElement!==wrap)wrap.appendChild(b)});
 }
 return true;
}
function css(){if(document.getElementById('quote-preview-mobile-style'))return;var s=document.createElement('style');s.id='quote-preview-mobile-style';s.textContent=`
@media(max-width:700px){
 #preview{padding:18px 14px 28px!important;background:#f4f6f8!important}
 #preview .section-head{min-height:54px!important;margin-bottom:12px!important}
 #quote-preview-actions-mobile{display:grid!important;grid-template-columns:1fr 1fr!important;gap:9px!important;background:#fff!important;border:1px solid #e4e8ed!important;border-radius:15px!important;padding:12px!important;margin:0 0 12px!important;box-shadow:0 2px 8px #1720330b!important}
 #quote-preview-actions-mobile h3{grid-column:1/-1!important;margin:0 0 2px!important;font-size:16px!important;color:#111827!important}
 #quote-preview-actions-mobile button{width:100%!important;min-height:58px!important;margin:0!important;border-radius:11px!important;font-size:15px!important;line-height:1.15!important;padding:10px!important}
 #quote-preview-actions-mobile button:last-child{opacity:.8}
 #quotePreview{margin:0!important;border-radius:16px!important;box-shadow:0 2px 10px #1720330b!important;overflow:hidden!important}
 #quotePreview .paper-head{gap:14px!important}
}
@media(max-width:430px){#preview .section-head{grid-template-columns:auto 1fr auto!important}#preview .section-head h2{font-size:22px!important}#preview .section-head #printBtn{font-size:13px!important}.quote-preview-actions-mobile{padding:11px!important}}
`;
document.head.appendChild(s)}
function start(){css();var tries=0;function run(){tries++;if(setup()||tries>=100)return;setTimeout(run,100)}run();if(window.MutationObserver){var ob=new MutationObserver(function(){setup()});ob.observe(document.body,{childList:true,subtree:true});setTimeout(function(){ob.disconnect()},12000)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
