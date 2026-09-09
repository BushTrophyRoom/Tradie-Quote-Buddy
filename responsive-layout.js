(function(){
'use strict';
if(window.__dustyResponsiveLayoutLoaded)return;
window.__dustyResponsiveLayoutLoaded=true;
function install(){
 if(document.getElementById('dusty-responsive-layout'))return;
 var s=document.createElement('style');s.id='dusty-responsive-layout';
 s.textContent=`
html,body{min-height:100%;background:#f4f6f8}
body{overflow-x:hidden}
main{width:100%;min-width:0}
.screen{width:100%;max-width:1120px;margin:0 auto;padding:32px 36px;min-height:calc(100vh - 72px)}
.screen.active{display:block}
.hero{width:100%}.stats{width:100%}.quote-list{width:100%}
form,.paper,.dashboard-panel,.tqb-dash-card,.customers-v2,.customers-v2-form,.customers-v2-detail{max-width:100%}
.grid2{min-width:0}input,textarea,select,button{max-width:100%}
@media(min-width:801px){
 body{padding-left:270px!important;padding-bottom:0!important}
 .topbar{position:fixed!important;left:0!important;top:0!important;bottom:0!important;width:270px!important;height:100vh!important;z-index:1000!important}
 .bottom-nav{left:16px!important;right:auto!important;top:210px!important;bottom:auto!important;width:238px!important;z-index:1100!important}
 .screen{max-width:1120px!important;padding:36px 42px!important;min-height:100vh!important}
 .screen#dashboard{max-width:1120px!important}
}
@media(max-width:800px){
 html,body{width:100%!important;max-width:none!important;min-width:0!important;margin:0!important;padding-left:0!important;padding-right:0!important}
 body{padding:0 0 86px!important;background:#f4f6f8!important;overflow-x:hidden!important}
 main{width:100vw!important;max-width:none!important;min-width:0!important;margin:0!important}
 .topbar{position:sticky!important;top:0!important;left:0!important;width:100vw!important;max-width:none!important;height:82px!important;padding:8px 14px!important;z-index:1000!important}
 .topbar .brand{min-width:0!important;flex:1!important}.topbar .brand .logo{width:54px!important;height:54px!important;flex:0 0 54px!important}
 .topbar .brand strong{font-size:20px!important}.topbar .brand span{font-size:10px!important}
 .topbar .icon-btn{display:block!important;flex:0 0 auto!important;font-size:24px!important;padding:8px!important}
 .bottom-nav{position:fixed!important;left:0!important;right:0!important;bottom:0!important;top:auto!important;width:100vw!important;height:auto!important;z-index:10000!important}
 .bottom-nav .nav{min-height:58px!important}
 .screen{box-sizing:border-box!important;max-width:none!important;width:100vw!important;margin:0!important;padding:24px 18px 30px!important;min-height:calc(100vh - 82px)!important}
 .screen#dashboard{max-width:none!important;width:100vw!important}
 .hero{border-radius:16px!important;padding:20px!important}.hero h1{font-size:27px!important}
 .stats{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}.stat{min-width:0!important}
 .section-head{min-width:0!important}.section-head h2{min-width:0!important}.action-row{width:100%!important}
 .paper{width:100%!important;padding:20px!important}.paper-head{flex-direction:column!important}.paper-meta{text-align:left!important}
 .customers-v2-head,.customers-v2-toolbar,.customers-v2-grid,.customers-v2-card,.customers-v2-form{width:100%!important}
 .customers-v2-form-actions{bottom:76px!important}
}
@media(max-width:600px){
 .screen{padding:20px 14px 30px!important}.stats{grid-template-columns:1fr 1fr!important}.hero{padding:18px!important}.hero h1{font-size:25px!important}
 .grid2{grid-template-columns:1fr!important}.action-row{flex-direction:column!important}.action-row button{width:100%!important}
 .customers-v2-head{align-items:flex-start!important}.customers-v2-form-actions{position:sticky!important;bottom:76px!important}
}
@media(max-width:430px){.screen{padding-left:12px!important;padding-right:12px!important}.stats{gap:9px!important}.stat{padding:14px!important}.stat b{font-size:21px!important}}
`;
 document.head.appendChild(s);
}
function start(){install()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
