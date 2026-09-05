(function () {
  'use strict';

  var SETTINGS_KEY = 'tqb_settings_v6';
  var STYLE_ID = 'customer-response-styles';

  function $(id) { return document.getElementById(id); }
  function readSettings() {
    try {
      var raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }
  function encode(value) { return encodeURIComponent(String(value == null ? '' : value)); }
  function moneyText(value) {
    var n = Number(String(value || '').replace(/[^0-9.-]/g, '')) || 0;
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(n);
  }

  function addStyles() {
    if ($(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = '.customer-response{margin-top:24px;padding:18px;border:1px solid #d1d5db;border-radius:12px;background:#fafafa;text-align:center}.customer-response-title{font-size:16px;font-weight:800;margin-bottom:6px}.customer-response-text{font-size:12px;color:#555;line-height:1.5;margin-bottom:14px}.customer-response-actions{display:flex;gap:10px;justify-content:center}.customer-response-actions a{display:inline-block;flex:1;max-width:230px;padding:12px 16px;border-radius:10px;text-decoration:none;font-weight:800;font-size:14px}.response-accept{background:#16803c;color:#fff}.response-decline{background:#e53935;color:#fff}.customer-response-disabled{font-size:12px;color:#555;text-align:left}@media print{.customer-response{break-inside:avoid}.customer-response-actions a{color:#111!important;background:#fff!important;border:1px solid #777}}@media(max-width:430px){.customer-response-actions{flex-direction:column}.customer-response-actions a{max-width:none}}';
    document.head.appendChild(style);
  }

  function injectResponseActions() {
    var preview = $('quotePreview');
    if (!preview || !preview.querySelector('.paper-head')) return;
    if (preview.querySelector('.customer-response')) return;

    var settings = readSettings();
    var businessEmail = String(settings.businessEmail || '').trim();
    if (!businessEmail) {
      var note = document.createElement('div');
      note.className = 'customer-response customer-response-disabled';
      note.innerHTML = '<b>Customer response</b><br>Add your business email in Settings to enable Accept / Decline buttons on the customer quote.';
      preview.appendChild(note);
      return;
    }

    var numberEl = preview.querySelector('.paper-meta b');
    var customerEl = preview.querySelector('.customer-block > div');
    var totalEl = preview.querySelector('.paper-total .grand span:last-child');
    var number = numberEl ? numberEl.textContent.trim() : 'quote';
    var customer = customerEl ? customerEl.textContent.trim() : '';
    var total = totalEl ? moneyText(totalEl.textContent) : '';
    var businessName = String(settings.businessName || 'your business').trim();

    var acceptSubject = 'Quote ' + number + ' accepted';
    var declineSubject = 'Quote ' + number + ' declined';
    var acceptBody = 'Hi ' + businessName + ',\n\nI would like to ACCEPT quote ' + number + ' for ' + total + '.\n\nCustomer: ' + customer + '\n\nRegards,';
    var declineBody = 'Hi ' + businessName + ',\n\nI would like to DECLINE quote ' + number + ' for ' + total + '.\n\nCustomer: ' + customer + '\n\nRegards,';

    var wrap = document.createElement('div');
    wrap.className = 'customer-response';
    wrap.innerHTML = '<div class="customer-response-title">Customer response</div>' +
      '<div class="customer-response-text">If you would like to proceed, choose <b>Accept Quote</b>. Otherwise choose <b>Decline Quote</b>. This will open an email addressed to the business with the quote details.</div>' +
      '<div class="customer-response-actions">' +
      '<a class="response-accept" href="mailto:' + encode(businessEmail) + '?subject=' + encode(acceptSubject) + '&body=' + encode(acceptBody) + '">✓ Accept Quote</a>' +
      '<a class="response-decline" href="mailto:' + encode(businessEmail) + '?subject=' + encode(declineSubject) + '&body=' + encode(declineBody) + '">✕ Decline Quote</a>' +
      '</div>';
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
