(function(){
'use strict';
var ENDPOINT='https://cychngcvhgtfuahavlqq.supabase.co/functions/v1/create-quote-pdf';
var QUOTES_KEY='tqb_quotes_v6';
function readQuotes(){try{var q=JSON.parse(localStorage.getItem(QUOTES_KEY)||'[]');return Array.isArray(q)?q:[]}catch(e){return[]}}
function saveQuotes(q){try{localStorage.setItem(QUOTES_KEY,JSON.stringify(q))}catch(e){}}
function statusText(q){var s=String(q.status||q.quoteStatus||'').toLowerCase();if(s.indexOf('accept')>=0)return'Accepted';if(s.indexOf('declin')>=0||s.indexOf('reject')>=0)return'Declined';return'Pending'}
function updatePreview(q){var p=document.getElementById('quotePreview');if(!p||!window.currentQuote||String(window.currentQuote.id)!==String(q.id))return;var el=p.querySelector('.tqb-live-status');if(!el){el=document.createElement('div');el.className='tqb-live-status';p.appendChild(el)}var st=statusText(q);el.textContent='Customer response: '+st;el.style.cssText='margin-top:18px;padding:10px 14px;border-radius:10px;font-weight:700;text-align:center;background:'+(st==='Accepted'?'#dff5e8':st==='Declined'?'#fde1e2':'#e6f0ff')+';color:'+(st==='Accepted'?'#148043':st==='Declined'?'#d92d20':'#1769c2')+';'}
function refreshDashboard(){if(typeof window.refreshTQBDashboard==='function')window.refreshTQBDashboard()}
function checkQuote(q,quotes,index){if(!q.responseToken||!q.number)return Promise.resolve(false);var url=ENDPOINT+'?quoteNumber='+encodeURIComponent(q.number)+'&responseToken='+encodeURIComponent(q.responseToken);return fetch(url,{cache:'no-store'}).then(function(r){if(!r.ok)return null;return r.json()}).then(function(data){var decision=String(data&&data.decision||'').trim();if(decision!=='Accepted'&&decision!=='Declined')return false;var old=statusText(q);q.status=decision;q.quoteStatus=decision;q.respondedAt=data.responded_at||q.respondedAt||new Date().toISOString();quotes[index]=q;saveQuotes(quotes);if(window.currentQuote&&String(window.currentQuote.id)===String(q.id))window.currentQuote=q;updatePreview(q);refreshDashboard();return old!==decision}).catch(function(){return false})}
function sync(){var quotes=readQuotes();var jobs=[];for(var i=0;i<quotes.length;i++)if(quotes[i].responseToken)jobs.push(checkQuote(quotes[i],quotes,i));return Promise.all(jobs)}
function start(){sync();setInterval(sync,15000);document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('.nav'))setTimeout(sync,250);});window.addEventListener('focus',sync)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
