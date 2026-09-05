(function () {
  'use strict';

  var STYLE_ID = 'customer-response-styles-v2';
  var ACTION_ID = 'customer-response-actions-v2';

  function $(id) { return document.getElementById(id); }

  function addStyles() {
    if ($(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = '.customer-response{margin-top:24px;padding:18px;border:1px solid #d1d5db;border-radius:14px;background:#fafafa;text-align:center}.customer-response-title{font-size:16px;font-weight:800;margin-bottom:6px}.customer-response-text{font-size:12px;color:#555;line-height:1.5;margin-bottom:14px}.customer-response-actions{display:flex;gap:10px;justify-content:center}.customer-response-actions a{display:inline-block;flex:1;max-width:230px;padding:13px 16px;border-radius:10px;text-decoration:none;font-weight:800;font-size:14px}.response-accept{background:#16803c;color:#fff}.response-decline{background:#e53935;color:#fff}.customer-response-note{margin-top:10px;font-size:11px;color:#777}@media(max-width:430px){.customer-response-actions{flex-direction:column}.customer-response-actions a{max-width:none}}@media print{.customer-response{break-inside:avoid}.customer-response-actions a{color:#111!important;background:#fff!important;border:1px solid #777}}';
    document.head.appendChild(style);
  }

  function encodeData(data) {
    var json = JSON.stringify(data);
    var base64 = btoa(unescape(encodeURIComponent(json)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  function extractCustomer(block) {
    var result = {name:'',phone:'',email:'',address:''};
    if (!block) return result;
    var divs = block.querySelectorAll(':scope > div');
    if (divs[0]) result.name = divs[0].textContent.trim();
    var leftovers = [];
    for (var i = 1; i < divs.length; i++) {
      var text = divs[i].textContent.trim();
      if (!text) continue;
      if (!result.email && /@/.test(text)) { result.email = text; continue; }
      if (!result.phone && /^[+()\d][\d\s().-]{5,}$/.test(text)) { result.phone = text; continue; }
      leftovers.push(text);
    }
    result.address = leftovers.join('\n');
    return result;
  }

  function buildResponseUrl(decision) {
    var preview = $('quotePreview');
    if (!preview) return '#';

    var numberEl = preview.querySelector('.paper-meta b');
    var businessEl = preview.querySelector('.paper-head h1');
    var customer = extractCustomer(preview.querySelector('.customer-block'));
    var totalEl = preview.querySelector('.paper-total .grand span:last-child');
    var quoteNumber = numberEl ? numberEl.textContent.trim() : '';
    var businessName = businessEl ? businessEl.textContent.trim() : 'Tradie Quote Buddy';
    var total = totalEl ? totalEl.textContent.trim() : '';
    var businessEmail = '';

    try {
      var raw = localStorage.getItem('tqb_settings_v6');
      var settings = raw ? JSON.parse(raw) : {};
      businessEmail = String(settings.businessEmail || '').trim();
    } catch (e) {}

    var token = quoteNumber + '|' + customer.name + '|' + decision + '|' + total;
    var payload = {
      quote_number: quoteNumber,
      business_name: businessName,
      business_email: businessEmail,
      customer_name: customer.name,
      customer_phone: customer.phone,
      customer_email: customer.email,
      customer_address: customer.address,
      total: total,
      decision: decision,
      response_token: token,
      responded_at: new Date().toLocaleString('en-AU')
    };

    return './respond.html?data=' + encodeData(payload);
  }

  function injectResponseActions() {
    var preview = $('quotePreview');
    if (!preview || !preview.querySelector('.paper-head')) return;
    if (preview.querySelector('#' + ACTION_ID)) return;

    var wrap = document.createElement('div');
    wrap.id = ACTION_ID;
    wrap.className = 'customer-response';
    wrap.innerHTML = '<div class="customer-response-title">Customer response</div>' +
      '<div class="customer-response-text">Ready to proceed? Choose <b>Accept Quote</b> or <b>Decline Quote</b>. Your response will be sent automatically to the business.</div>' +
      '<div class="customer-response-actions">' +
      '<a class="response-accept" href="' + buildResponseUrl('Accepted') + '">✓ Accept Quote</a>' +
      '<a class="response-decline" href="' + buildResponseUrl('Declined') + '">✕ Decline Quote</a>' +
      '</div>' +
      '<div class="customer-response-note">Quote response • No payment is taken here</div>';
    preview.appendChild(wrap);
  }

  function start() {
    addStyles();
    var preview = $('quotePreview');
    if (!preview) return;
    var observer = new MutationObserver(function () {
      window.requestAnimationFrame(injectResponseActions);
    });
    observer.observe(preview, { childList: true, subtree: true });
    injectResponseActions();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
