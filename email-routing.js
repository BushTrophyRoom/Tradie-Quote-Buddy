(function(){
  if(!window.emailjs || !window.emailjs.send) return;
  var originalSend=window.emailjs.send.bind(window.emailjs);
  window.emailjs.send=function(serviceId,templateId,params,options){
    params=params||{};
    if(templateId==='template_9kx2gib' && !params.email_subject){
      var business=params.business_name||'Tradie Quote Buddy';
      if(params.invoice_number){
        params.email_subject='Invoice '+params.invoice_number+' from '+business;
      }else if(params.quote_number){
        params.email_subject='Quote '+params.quote_number+' from '+business;
      }
    }
    return originalSend(serviceId,templateId,params,options);
  };
})();
