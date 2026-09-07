(function(){
'use strict';
var ENDPOINT='https://cychngcvhgtfuahavlqq.supabase.co/functions/v1/stripe-create-checkout-session';
var KEY='tqb_square_owner_key_v1';
function owner(){try{return localStorage.getItem(KEY)||''}catch(e){return''}}
window.tqbStartProCheckout=function(){
  var k=owner();
  if(!k){alert('Your account key is unavailable on this device. Please return to the app and try again.');return;}
  var btn=document.getElementById('subscribeBtn');
  if(btn){btn.textContent='Opening secure checkout…';btn.classList.add('disabled');}
  fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','x-owner-key':k},body:JSON.stringify({owner_key:k,success_url:location.origin+location.pathname+'?subscription=success',cancel_url:location.origin+location.pathname+'?subscription=cancelled'})})
  .then(function(r){return r.json().then(function(d){if(!r.ok)throw new Error(d.error||'checkout');return d})})
  .then(function(d){if(!d.url)throw new Error('No checkout URL returned');location.href=d.url})
  .catch(function(){if(btn){btn.textContent='Subscribe to Pro';btn.classList.remove('disabled')}alert('We could not open Stripe checkout right now. Please try again.')});
};
})();