(function(){
'use strict';
var SUPABASE_URL='https://cychngcvhgtfuahavlqq.supabase.co';
var SUPABASE_KEY='sb_publishable_nc_WEOT-I9hR5oH9hEMURQ_mG92V_VA';
var RPC=SUPABASE_URL+'/rest/v1/rpc/tqb_cloud_sync';
var OWNER_KEY='tqb_square_owner_key_v1';
var LOCAL_UPDATED='tqb_cloud_local_updated_v1';
var cardId='tqb-cloud-sync-card';
function $(id){return document.getElementById(id)}
function owner(){try{return localStorage.getItem(OWNER_KEY)||''}catch(e){return''}}
function read(key,fallback){try{var v=JSON.parse(localStorage.getItem(key)||'');return v==null?fallback:v}catch(e){return fallback}}
function quotes(){var q=read('tqb_quotes_v6',[]);return Array.isArray(q)?q:[]}
function settings(){var s=read('tqb_settings_v6',{});return s&&typeof s==='object'?s:{}}
function setStatus(text,ok){var el=$('tqb-cloud-status');if(el){el.textContent=text;el.style.color=ok?'#166534':'#667085'}}
function rpc(action,payload){var body={p_owner_key:owner(),p_action:action};if(action==='put'){body.p_quotes=payload.quotes;body.p_settings=payload.settings}return fetch(RPC,{method:'POST',headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY},body:JSON.stringify(body),cache:'no-store'}).then(function(r){return r.text().then(function(raw){var d={};try{d=raw?JSON.parse(raw):{}}catch(e){d={message:raw}}if(!r.ok){var msg=d&&d.message?d.message:(d&&d.error?d.error:'Cloud sync request failed');throw new Error(msg)}return d})})}
function saveLocal(qs,st){try{localStorage.setItem('tqb_quotes_v6',JSON.stringify(qs));localStorage.setItem('tqb_settings_v6',JSON.stringify(st));localStorage.setItem(LOCAL_UPDATED,String(Date.now()))}catch(e){}}
function markLocal(){try{localStorage.setItem(LOCAL_UPDATED,String(Date.now()))}catch(e){}}
function installCard(){if($(cardId))return;var settingsForm=$('settingsForm');if(!settingsForm)return;var square=$('squarePaymentsBlock');var card=document.createElement('div');card.id=cardId;card.className='feature-card';card.style.marginTop='24px';card.innerHTML='<h3>☁️ Cloud Sync <span id="tqb-cloud-pill" style="float:right;font-size:11px;background:#eef2f6;color:#475467;padding:5px 9px;border-radius:999px">Checking…</span></h3><p id="tqb-cloud-status" class="storage-note">Checking your Pro access…</p><button type="button" class="primary" id="tqb-cloud-btn" style="width:100%">Sync now</button><p class="storage-note" style="margin:9px 0 0">Your quotes and business settings are securely stored for this owner and can be restored on another device using the same owner key.</p>';
if(square&&square.parentNode===settingsForm)square.insertAdjacentElement('afterend',card);else settingsForm.appendChild(card);
$('tqb-cloud-btn').addEventListener('click',syncNow);}
function setLocked(){var pill=$('tqb-cloud-pill'),btn=$('tqb-cloud-btn');if(pill){pill.textContent='PRO ONLY';pill.style.background='#fef3c7';pill.style.color='#92400e'}if(btn){btn.textContent='Upgrade to Pro';btn.onclick=function(){location.href='./subscription.html'}}setStatus('Cloud Sync is a Pro feature. Upgrade to enable secure cloud storage.',false)}
function setReady(found,when){var pill=$('tqb-cloud-pill');if(pill){pill.textContent='PRO';pill.style.background='#ecfdf3';pill.style.color='#166534'}if(when)setStatus(found?'Cloud backup found. Last synced '+new Date(when).toLocaleString('en-AU')+'.':'Pro active. No cloud backup yet. Your first Sync now will upload this device.',true);else setStatus('Pro active. Your quotes are ready to sync.',true)}
function initial(){if(!owner()){setStatus('Cloud Sync is unavailable because this device has no owner key.',false);return}rpc('get').then(function(d){if(d&&d.found){setReady(true,d.updated_at)}else setReady(false,null)}).catch(function(e){if(String(e.message).toLowerCase().indexOf('pro subscription required')>=0)setLocked();else setStatus('Cloud Sync could not be checked right now.',false)})}
function syncNow(){var btn=$('tqb-cloud-btn');if(!owner()){setStatus('Cloud Sync is unavailable because this device has no owner key.',false);return}if(btn){btn.disabled=true;btn.textContent='⏳ Syncing…'}rpc('get').then(function(cloud){var localQ=quotes(),localS=settings();if(!cloud||!cloud.found){return rpc('put',{quotes:localQ,settings:localS}).then(function(d){saveLocal(localQ,localS);setReady(true,d&&d.updated_at);setStatus('✓ Uploaded this device to secure cloud storage.',true)})}
var cloudQ=Array.isArray(cloud.quotes)?cloud.quotes:[],cloudS=cloud.settings&&typeof cloud.settings==='object'?cloud.settings:{};
var choice=window.confirm('A cloud backup already exists.\n\nPress OK to download the cloud backup to this device.\nPress Cancel to upload this device and replace the cloud backup.');
if(choice){saveLocal(cloudQ,cloudS);setReady(true,cloud.updated_at);setStatus('✓ Cloud backup restored to this device. Reloading your saved data…',true);setTimeout(function(){location.reload()},350);return null}
return rpc('put',{quotes:localQ,settings:localS}).then(function(d){saveLocal(localQ,localS);setReady(true,d&&d.updated_at);setStatus('✓ This device is now the latest cloud backup.',true)})}).catch(function(e){if(String(e.message).toLowerCase().indexOf('pro subscription required')>=0)setLocked();else setStatus('Sync failed: '+e.message,false)}).then(function(){if(btn){btn.disabled=false;btn.textContent='Sync now'}})}
function patchStorage(){if(window.__tqbCloudStoragePatched)return;window.__tqbCloudStoragePatched=true;var original=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){var result=original.apply(this,arguments);if(this===window.localStorage&&(key==='tqb_quotes_v6'||key==='tqb_settings_v6')){markLocal();if(window.__tqbCloudSyncTimer)clearTimeout(window.__tqbCloudSyncTimer);window.__tqbCloudSyncTimer=setTimeout(function(){var b=$('tqb-cloud-btn');if(b&&b.textContent==='Sync now'&&owner()){rpc('put',{quotes:quotes(),settings:settings()}).then(function(d){if(d&&d.updated_at)setReady(true,d.updated_at)}).catch(function(){})}},2500)}return result}}
function start(){installCard();patchStorage();setTimeout(initial,300);document.addEventListener('click',function(e){var n=e.target.closest&&e.target.closest('[data-screen="settings"]');if(n)setTimeout(function(){installCard();initial()},100)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
