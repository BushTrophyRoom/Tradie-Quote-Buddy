(function(){
  'use strict';
  function businessName(){
    try{
      var s=JSON.parse(localStorage.getItem('tqb_settings_v6')||'{}');
      var n=String(s.businessName||s.business_name||'').trim();
      if(!n || n.toLowerCase()==='tradie quote buddy') return 'DustyBoots Invoicing';
      return n;
    }catch(e){return 'DustyBoots Invoicing'}
  }
  function applySquareBranding(){
    var block=document.getElementById('squarePaymentsBlock');
    if(!block)return;
    var name=businessName();
    var copy=block.querySelectorAll('.storage-note');
    if(copy.length>0)copy[0].textContent='Connect your '+name+' Square seller account to accept card payments on invoices. This test connection uses Square Sandbox and does not charge real money.';
    if(copy.length>1)copy[copy.length-1].textContent='You will be taken to Square to authorize '+name+'.';
  }
  function init(){
    applySquareBranding();
    setTimeout(applySquareBranding,300);
    setTimeout(applySquareBranding,1000);
    setTimeout(applySquareBranding,2000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.addEventListener('storage',applySquareBranding);

  if(!window.emailjs || !window.emailjs.send) return;
  var originalSend=window.emailjs.send.bind(window.emailjs);
  window.emailjs.send=function(serviceId,templateId,params,options){
    params=params||{};
    if(templateId==='template_9kx2gib'){
      var isInvoice=!!params.invoice_number;
      params.is_invoice=isInvoice;
      params.email_type=isInvoice?'invoice':'quote';
      if(!params.email_subject){
        var business=params.business_name||businessName();
        if(isInvoice){
          params.email_subject='Invoice '+params.invoice_number+' from '+business;
        }else if(params.quote_number){
          params.email_subject='Quote '+params.quote_number+' from '+business;
        }
      }
    }
    return originalSend(serviceId,templateId,params,options);
  };
})();
