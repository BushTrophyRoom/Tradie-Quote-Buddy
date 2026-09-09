(function(){'use strict';
function mobile(){return window.matchMedia&&window.matchMedia('(max-width:600px)').matches}
function apply(){if(!mobile())return;var d=document.getElementById('dashboard');if(!d)return;
  var old=d.querySelector('.dashboard-welcome');if(old)old.remove();
  var panel=d.querySelector('.dashboard-panel');if(panel)panel.classList.remove('dashboard-panel');
  var hero=d.querySelector('.hero');if(hero){hero.style.display='block';hero.hidden=false;}
  var lower=document.querySelector('#tqb-dashboard-lower');if(lower)lower.remove();
  var feature=d.querySelector('.feature-card');if(feature)feature.remove();
  var legacy=d.querySelectorAll('[class*="month"],[class*="attention"],.dashboard-invoice-stats');legacy.forEach(function(x){if(x.parentElement===d||x.closest('#dashboard'))x.remove()});
}
function boot(){apply();setTimeout(apply,100);setTimeout(apply,400);setTimeout(apply,1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.addEventListener('resize',apply);
})();