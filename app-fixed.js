(() => {
  'use strict';

  const QUOTES_KEY = 'tqb_quotes_v5';
  const SETTINGS_KEY = 'tqb_settings_v5';
  const $ = id => document.getElementById(id);
  const money = n => new Intl.NumberFormat('en-AU', { style:'currency', currency:'AUD' }).format(Number(n) || 0);

  let quotes = [];
  let settings = { businessName:'Your Business Name', abn:'', businessPhone:'', businessEmail:'', businessAddress:'', defaultRate:90 };
  let currentQuote = null;
  let editingId = null;

  function read(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch (_) { return fallback; }
  }

  function save() {
    try {
      localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (_) {}
  }

  function show(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));
    document.querySelectorAll('.nav').forEach(n => n.classList.toggle('active', n.dataset.screen === id));
    if (id === 'dashboard') renderDashboard();
    if (id === 'saved') renderSaved();
    if (id === 'settings') loadSettings();
    window.scrollTo(0, 0);
  }

  function calc() {
    const materials = [...document.querySelectorAll('.item-amount')].reduce((sum, el) => sum + (Number(el.value) || 0), 0);
    const hours = Number($('labourHours')?.value) || 0;
    const rate = Number($('hourlyRate')?.value) || 0;
    const labour = hours * rate;
    const subtotal = materials + labour;
    const gst = $('gstEnabled')?.checked ? subtotal * 0.10 : 0;
    const total = subtotal + gst;
    if ($('subtotal')) $('subtotal').textContent = money(subtotal);
    if ($('gst')) $('gst').textContent = money(gst);
    if ($('grandTotal')) $('grandTotal').textContent = money(total);
    return { materials, labour, subtotal, gst, total };
  }

  function addItem(description = '', amount = '') {
    const row = document.createElement('div');
    row.className = 'item';
    row.innerHTML = '<input class="item-desc" placeholder="Material or other cost"><input class="item-amount" type="number" min="0" step="0.01" placeholder="$"><button type="button" aria-label="Remove item">✕</button>';
    row.querySelector('.item-desc').value = description;
    row.querySelector('.item-amount').value = amount;
    row.querySelector('.item-amount').addEventListener('input', calc);
    row.querySelector('.item-desc').addEventListener('input', calc);
    row.querySelector('button').addEventListener('click', () => { row.remove(); calc(); });
    $('lineItems').appendChild(row);
  }

  function resetForm() {
    editingId = null;
    currentQuote = null;
    $('quoteFormEl').reset();
    $('lineItems').innerHTML = '';
    addItem();
    $('hourlyRate').value = settings.defaultRate || 90;
    $('quoteFormTitle').textContent = 'New quote';
    $('saveQuoteBtn').textContent = 'Save & Preview Quote';
    calc();
  }

  function collectQuote() {
    const totals = calc();
    const items = [...document.querySelectorAll('.item')].map(row => ({
      description: row.querySelector('.item-desc').value.trim(),
      amount: Number(row.querySelector('.item-amount').value) || 0
    })).filter(i => i.description || i.amount);
    return {
      id: editingId || Date.now() + '-' + Math.random().toString(16).slice(2),
      number: currentQuote?.number || 'Q-' + String(Date.now()).slice(-6),
      date: currentQuote?.date || new Date().toLocaleDateString('en-AU'),
      customerName: $('customerName').value.trim(),
      customerPhone: $('customerPhone').value.trim(),
      customerEmail: $('customerEmail').value.trim(),
      jobDescription: $('jobDescription').value.trim(),
      items,
      labourHours: Number($('labourHours').value) || 0,
      hourlyRate: Number($('hourlyRate').value) || 0,
      ...totals,
      savedAt: Date.now()
    };
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
  }

  function quoteCard(q) {
    return '<div class="quote-card" data-id="' + escapeHtml(q.id) + '"><div class="row"><b>' + escapeHtml(q.customerName || 'Unnamed customer') + '</b><b>' + money(q.total) + '</b></div><small>' + escapeHtml(q.number) + ' · ' + escapeHtml(q.date) + '</small><div class="desc">' + escapeHtml(q.jobDescription || '') + '</div></div>';
  }

  function bindCards() {
    document.querySelectorAll('.quote-card').forEach(card => {
      card.onclick = () => {
        const q = quotes.find(x => x.id === card.dataset.id);
        if (!q) return;
        currentQuote = q;
        renderPreview(q);
        show('preview');
      };
    });
  }

  function renderDashboard() {
    if (!$('quoteCount')) return;
    $('quoteCount').textContent = quotes.length;
    $('totalQuoted').textContent = money(quotes.reduce((sum, q) => sum + (Number(q.total) || 0), 0));
    $('recentQuotes').innerHTML = quotes.length ? quotes.slice(0, 5).map(quoteCard).join('') : '<div class="empty">No quotes yet.<br><br>Tap <b>New Quote</b> to create your first one.</div>';
    bindCards();
  }

  function renderSaved() {
    $('allQuotes').innerHTML = quotes.length ? quotes.map(quoteCard).join('') : '<div class="empty">No saved quotes yet.</div>';
    bindCards();
  }

  function renderPreview(q) {
    const itemRows = (q.items || []).map(i => '<tr><td>' + escapeHtml(i.description) + '</td><td>' + money(i.amount) + '</td></tr>').join('');
    const labourRow = q.labourHours ? '<tr><td>Labour (' + q.labourHours + ' hrs × ' + money(q.hourlyRate) + '/hr)</td><td>' + money(q.labour) + '</td></tr>' : '';
    $('quotePreview').innerHTML = '<div class="paper-head"><div><div class="logo">🛠️</div><h1>' + escapeHtml(settings.businessName || 'Your Business Name') + '</h1><div>' + escapeHtml(settings.businessAddress || '') + '</div><div>' + escapeHtml(settings.businessPhone || '') + ' ' + escapeHtml(settings.businessEmail || '') + '</div><div>' + (settings.abn ? 'ABN ' + escapeHtml(settings.abn) : '') + '</div></div><div class="paper-meta"><h2>QUOTE</h2><b>' + escapeHtml(q.number) + '</b><div>' + escapeHtml(q.date) + '</div></div></div><div><b>Quote for</b><div>' + escapeHtml(q.customerName) + '</div><div>' + escapeHtml(q.customerPhone) + '</div><div>' + escapeHtml(q.customerEmail) + '</div></div><p class="job"><b>Job description</b><br>' + escapeHtml(q.jobDescription).replace(/\n/g, '<br>') + '</p><table><thead><tr><th>Description</th><th>Amount</th></tr></thead><tbody>' + itemRows + labourRow + '</tbody></table><div class="paper-total"><div><span>Subtotal</span><span>' + money(q.subtotal) + '</span></div><div><span>GST</span><span>' + money(q.gst) + '</span></div><div class="grand"><span>Total</span><span>' + money(q.total) + '</span></div></div><p class="thanks">Thank you for the opportunity to quote on your job.</p>';
  }

  function editQuote(q) {
    editingId = q.id;
    currentQuote = q;
    $('quoteFormTitle').textContent = 'Edit quote';
    $('saveQuoteBtn').textContent = 'Update Quote';
    $('customerName').value = q.customerName || '';
    $('customerPhone').value = q.customerPhone || '';
    $('customerEmail').value = q.customerEmail || '';
    $('jobDescription').value = q.jobDescription || '';
    $('labourHours').value = q.labourHours || 0;
    $('hourlyRate').value = q.hourlyRate || settings.defaultRate || 90;
    $('gstEnabled').checked = Number(q.gst) > 0;
    $('lineItems').innerHTML = '';
    (q.items || []).forEach(i => addItem(i.description, i.amount));
    if (!(q.items || []).length) addItem();
    calc();
    show('quoteForm');
  }

  function loadSettings() {
    ['businessName','abn','businessPhone','businessEmail','businessAddress','defaultRate'].forEach(k => { if ($(k)) $(k).value = settings[k] ?? ''; });
  }

  function backup() {
    const blob = new Blob([JSON.stringify({version:5, quotes, settings}, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'tradie-quote-buddy-backup.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function wire() {
    $('newQuoteBtn').onclick = () => { resetForm(); show('quoteForm'); };
    $('addItemBtn').onclick = () => addItem();
    $('settingsBtn').onclick = () => show('settings');
    $('viewAllBtn').onclick = () => show('saved');
    $('printBtn').onclick = () => window.print();
    $('editQuoteBtn').onclick = () => { if (currentQuote) editQuote(currentQuote); };
    $('deleteQuoteBtn').onclick = () => { if (currentQuote) $('confirmModal').classList.add('show'); };
    $('cancelDelete').onclick = () => $('confirmModal').classList.remove('show');
    $('confirmDelete').onclick = () => {
      if (!currentQuote) return;
      quotes = quotes.filter(q => q.id !== currentQuote.id);
      save();
      currentQuote = null;
      $('confirmModal').classList.remove('show');
      show('saved');
    };
    $('quoteFormEl').onsubmit = e => {
      e.preventDefault();
      const q = collectQuote();
      const index = quotes.findIndex(x => x.id === editingId);
      if (index >= 0) quotes[index] = q; else quotes.unshift(q);
      currentQuote = q;
      save();
      renderPreview(q);
      show('preview');
    };
    $('settingsForm').onsubmit = e => {
      e.preventDefault();
      settings = {
        businessName: $('businessName').value.trim(),
        abn: $('abn').value.trim(),
        businessPhone: $('businessPhone').value.trim(),
        businessEmail: $('businessEmail').value.trim(),
        businessAddress: $('businessAddress').value.trim(),
        defaultRate: Number($('defaultRate').value) || 0
      };
      save();
      show('dashboard');
    };
    $('backupBtn').onclick = backup;
    $('restoreBtn').onclick = () => $('restoreFile').click();
    $('restoreFile').onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (!Array.isArray(data.quotes)) throw new Error('invalid');
          quotes = data.quotes;
          settings = {...settings, ...(data.settings || {})};
          save();
          show('dashboard');
        } catch (_) { alert('That backup file could not be restored.'); }
      };
      reader.readAsText(file);
      e.target.value = '';
    };
    $('subscribeBtn')?.addEventListener('click', () => location.href = 'subscription.html');
    document.querySelectorAll('[data-back]').forEach(btn => btn.onclick = () => show('dashboard'));
    document.querySelectorAll('.nav').forEach(nav => nav.onclick = () => { if (nav.dataset.screen === 'quoteForm') resetForm(); show(nav.dataset.screen); });
    $('labourHours').oninput = calc;
    $('hourlyRate').oninput = calc;
    $('gstEnabled').onchange = calc;
  }

  function start() {
    quotes = read(QUOTES_KEY, read('tqb_quotes_v4', read('tqb_quotes_v3', [])));
    settings = {...settings, ...read(SETTINGS_KEY, read('tqb_settings_v3', read('tqb_settings_v2', {})))};
    try {
      wire();
      resetForm();
      show('dashboard');
      console.log('Tradie Quote Buddy runtime loaded');
    } catch (err) {
      console.error('Tradie Quote Buddy startup error:', err);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();