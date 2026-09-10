(function(){
'use strict';
if(window.__dustybootsMobilePolishLoaded)return;
window.__dustybootsMobilePolishLoaded=true;
function init(){
 if(document.getElementById('dustyboots-universal-mobile-style'))return;
 var s=document.createElement('style');s.id='dustyboots-universal-mobile-style';
 s.textContent=`
@media(max-width:700px){
 body{background:#f4f6f8!important;color:#111827!important;padding-bottom:88px!important;font-family:Arial,sans-serif!important}
 .screen{padding:18px 14px 28px!important;max-width:760px!important;margin:0 auto!important;background:#f4f6f8!important}
 .screen>.section-head,.biz-head,.section-head{min-height:52px;margin:0 0 14px!important;padding:0 2px!important;align-items:center!important}
 .section-head h2{font-size:24px!important;letter-spacing:-.3px!important;color:#111827!important}
 .back-btn{font-size:16px!important;color:#374151!important;font-weight:700!important}
 .hero{border-radius:18px!important;padding:20px!important;margin-bottom:14px!important;box-shadow:0 3px 14px #17203312!important}
 .hero h1{font-size:27px!important;line-height:1.1!important}
 .stats{gap:10px!important;margin-bottom:16px!important}
 .stat,.quote-card,.feature-card,form,.empty{border:1px solid #e4e8ed!important;box-shadow:0 2px 8px #1720330b!important;border-radius:15px!important}
 .stat{padding:15px!important}
 .stat b{font-size:22px!important}
 form{padding:18px!important}
 form>h3{font-size:18px!important;margin:22px 0 12px!important;padding-top:18px!important;border-top:1px solid #e7eaee!important;color:#111827!important}
 form>h3:first-child{margin-top:0!important;padding-top:0!important;border-top:0!important}
 label{font-size:13px!important;margin-bottom:13px!important;color:#374151!important}
 input,textarea,select{min-height:48px!important;border-radius:11px!important;border:1px solid #d8dde5!important;padding:12px!important;background:#fff!important;font-size:16px!important}
 textarea{line-height:1.45!important}
 .grid2{gap:10px!important}
 .quote-list{gap:10px!important}
 .quote-card{padding:16px!important;min-height:88px!important}
 .action-row{display:grid!important;grid-template-columns:1fr 1fr!important;gap:9px!important;margin:0 0 14px!important}
 .action-row button{min-width:0!important;width:100%!important;min-height:48px!important}
 .primary,.secondary,.danger{min-height:48px!important;border-radius:11px!important;font-size:15px!important}
 form>.primary[type=submit]{margin-top:18px!important;min-height:54px!important;font-size:16px!important}
 #lineItems{display:grid!important;gap:9px!important}
 .item-head{margin-top:4px!important;padding:0 2px!important;color:#6b7280!important}
 .item{margin-bottom:0!important;background:#f8fafc!important;border:1px solid #e4e8ed!important;border-radius:12px!important;padding:8px!important}
 .item input{background:#fff!important}
 #addItemBtn{width:100%!important;margin:4px 0 4px!important}
 .pricing-note{line-height:1.45!important;margin-bottom:12px!important}
 .discount-row{margin-top:8px!important}
 .check{background:#f8fafc!important;border:1px solid #e4e8ed!important;border-radius:11px!important;padding:12px!important}
 .check input{min-height:auto!important}
 .totals{background:#f8fafc!important;border:1px solid #e4e8ed!important;border-radius:13px!important;padding:12px!important;margin-top:16px!important}
 .totals .grand{font-size:21px!important}
 .feature-card{padding:17px!important}
 .biz-screen{padding:18px 14px 28px!important;background:#f4f6f8!important}
 .biz-wrap{max-width:none!important}
 .biz-head{display:flex!important;gap:10px!important;align-items:center!important}
 .biz-head h1{font-size:25px!important;line-height:1.1!important}
 .biz-head p{font-size:13px!important}
 .biz-head .primary{width:auto!important;margin:0!important;white-space:nowrap!important}
 .biz-card{border-radius:15px!important;border:1px solid #e4e8ed!important;box-shadow:0 2px 8px #1720330b!important;padding:16px!important}
 .biz-toolbar{display:grid!important;grid-template-columns:1fr auto!important;gap:8px!important}
 .biz-toolbar input{min-width:0!important}
 .biz-kpis{gap:9px!important;margin-bottom:12px!important}
 .biz-kpi{border-radius:14px!important;padding:14px!important;box-shadow:0 2px 8px #1720330b!important}
 .biz-kpi b{font-size:20px!important}
 .biz-table{font-size:13px!important}
 .biz-table th,.biz-table td{padding:11px 8px!important}
 .db-data-page{max-width:none!important}
 #customersData>div,#customersData .db-data-page>div{border-radius:15px!important;box-shadow:0 2px 8px #1720330b!important}
 #settings form{border-radius:15px!important}
 .bottom-nav{border-top:1px solid #262626!important;box-shadow:0 -4px 18px #0002!important}
 .bottom-nav .nav{min-height:58px!important}
 .tqb-business-invoice{border-radius:16px!important;padding:14px!important;box-shadow:0 2px 10px #1720330b!important}
 .tqb-business-actions{grid-template-columns:1fr 1fr!important;gap:8px!important;margin-bottom:16px!important}
 .tqb-business-actions #tqbInvoiceBack,.tqb-business-actions #tqbSendInvoice,.tqb-business-actions #invoiceSquarePayBtn{grid-column:1/-1!important}
 .tqb-business-actions #tqbInvoiceBack{background:#fff!important;border:1px solid #e4e8ed!important}
 .tqb-business-actions button{min-height:46px!important;border-radius:11px!important;font-size:14px!important}
 .tqb-business-actions #tqbSendInvoice{min-height:54px!important;font-size:16px!important}
 .tqb-business-actions #tqbDeleteInvoice{background:#fff1f2!important;color:#991b1b!important}
 .tqb-business-actions .manual-payment{background:#16a34a!important;color:#fff!important}
 .tqb-business-head{border-bottom:1px solid #e4e8ed!important;padding-bottom:16px!important}
 .tqb-business-head h1{font-size:24px!important}
 .tqb-business-payment{border-radius:14px!important;background:#fff!important}
 .invoice-paper,.paper{border-radius:15px!important;box-shadow:0 2px 10px #1720330b!important}
 .invoice-payment,.invoice-terms-editor{border-radius:14px!important}
 .modal{border-radius:18px!important}
}
@media(max-width:430px){
 .screen{padding-left:12px!important;padding-right:12px!important}
 .stats{grid-template-columns:1fr 1fr!important}
 .action-row{grid-template-columns:1fr 1fr!important}
 .biz-toolbar{grid-template-columns:1fr!important}
 .biz-head .primary{width:100%!important;margin-top:10px!important}
 .biz-head{display:block!important}
}
`;
 document.head.appendChild(s);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
