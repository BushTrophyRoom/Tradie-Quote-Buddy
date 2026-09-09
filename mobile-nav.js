(function(){
'use strict';
if(window.__dustyMobileNavLoaded)return;
window.__dustyMobileNavLoaded=true;

var labels={
  dashboard:'Home',
  quoteForm:'New Quote',
  saved:'Quotes',
  invoices:'Invoices',
  customers:'Customers',
  itemsServices:'Items & Services',
  payments:'Payments',
  reports:'Reports',
  settings:'Settings'
};

function init(){
  var nav=document.querySelector('.bottom-nav');
  if(!nav)return;

  var style=document.createElement('style');
  style.id='dusty-mobile-nav-style';
  style.textContent='@media(max-width:600px){body{padding-bottom:70px}.bottom-nav{display:none!important}.mobile-nav-bar{position:fixed;left:0;right:0;bottom:0;background:#111;color:#fff;padding:8px 12px calc(8px + env(safe-area-inset-bottom));z-index:9998;box-shadow:0 -4px 16px #0003}.mobile-nav-trigger{width:100%;height:48px;border:1px solid #3b3b3b;border-radius:12px;background:#1b1b1b;color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 14px;font:700 15px Arial,sans-serif}.mobile-nav-trigger .mobile-nav-current{display:flex;align-items:center;gap:9px}.mobile-nav-trigger .mobile-nav-icon{font-size:20px}.mobile-nav-chevron{font-size:18px;color:#ffb000;transition:transform .18s ease}.mobile-nav-bar.open .mobile-nav-chevron{transform:rotate(180deg)}.mobile-nav-panel{position:absolute;left:12px;right:12px;bottom:66px;background:#fff;border-radius:16px;box-shadow:0 8px 30px #0004;overflow:hidden;display:none;border:1px solid #ddd}.mobile-nav-bar.open .mobile-nav-panel{display:block}.mobile-nav-item{width:100%;border:0;border-bottom:1px solid #eee;background:#fff;color:#171717;padding:14px 16px;text-align:left;font:700 15px Arial,sans-serif;display:flex;align-items:center;gap:12px}.mobile-nav-item:last-child{border-bottom:0}.mobile-nav-item.active{background:#fff7df;color:#a96a00}.mobile-nav-item-icon{width:24px;text-align:center;font-size:18px}.mobile-nav-item-label{flex:1}.mobile-nav-check{font-size:16px;color:#ffb000}.mobile-nav-bar .mobile-nav-panel{max-height:70vh;overflow-y:auto}}';
  document.head.appendChild(style);

  var bar=document.createElement('div');
  bar.className='mobile-nav-bar';
  bar.innerHTML='<div class="mobile-nav-panel"></div><button type="button" class="mobile-nav-trigger" aria-expanded="false"><span class="mobile-nav-current"><span class="mobile-nav-icon">☰</span><span class="mobile-nav-current-label">Menu</span></span><span class="mobile-nav-chevron">⌃</span></button>';
  document.body.appendChild(bar);

  var panel=bar.querySelector('.mobile-nav-panel');
  var trigger=bar.querySelector('.mobile-nav-trigger');
  var currentLabel=bar.querySelector('.mobile-nav-current-label');

  var icons={dashboard:'🏠',quoteForm:'➕',saved:'📋',invoices:'🧾',customers:'👥',itemsServices:'🛠️',payments:'💳',reports:'📊',settings:'⚙️'};
  var ids=['dashboard','quoteForm','saved','invoices','customers','itemsServices','payments','reports','settings'];

  function getNavButton(id){return nav.querySelector('.nav[data-screen="'+id+'"]')}

  function rebuild(){
    panel.innerHTML='';
    ids.forEach(function(id){
      var original=getNavButton(id);
      if(!original)return;
      var item=document.createElement('button');
      item.type='button';
      item.className='mobile-nav-item';
      item.setAttribute('data-screen',id);
      item.innerHTML='<span class="mobile-nav-item-icon">'+(icons[id]||'•')+'</span><span class="mobile-nav-item-label">'+(labels[id]||id)+'</span><span class="mobile-nav-check">✓</span>';
      item.addEventListener('click',function(){
        original.click();
        closeMenu();
        setTimeout(sync,30);
      });
      panel.appendChild(item);
    });
    sync();
  }

  function sync(){
    var active=nav.querySelector('.nav.active[data-screen]');
    var id=active?active.getAttribute('data-screen'):null;
    currentLabel.textContent=labels[id]||'Menu';
    panel.querySelectorAll('.mobile-nav-item').forEach(function(item){
      var on=item.getAttribute('data-screen')===id;
      item.classList.toggle('active',on);
      var check=item.querySelector('.mobile-nav-check');
      if(check)check.style.visibility=on?'visible':'hidden';
    });
  }

  function closeMenu(){
    bar.classList.remove('open');
    trigger.setAttribute('aria-expanded','false');
  }

  trigger.addEventListener('click',function(){
    var open=!bar.classList.contains('open');
    bar.classList.toggle('open',open);
    trigger.setAttribute('aria-expanded',open?'true':'false');
    if(open)sync();
  });

  document.addEventListener('click',function(e){
    if(!bar.contains(e.target))closeMenu();
  });

  var observer=new MutationObserver(function(){
    if(!panel.children.length || ids.some(function(id){return !!getNavButton(id)&&!panel.querySelector('[data-screen="'+id+'"]')}))rebuild();
    else sync();
  });
  observer.observe(nav,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});

  rebuild();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
