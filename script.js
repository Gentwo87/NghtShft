// NGHT SHFT LNDN site interactions

function showPage(id) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  window.scrollTo(0, 0);
}

// Countdown: update this date for your next event
const EVENT_DATE = new Date('July 11, 2026 21:00:00').getTime();

function padNumber(value) {
  return String(value).padStart(2, '0');
}

function updateCountdown() {
  const now = Date.now();
  const distance = EVENT_DATE - now;

  const ids = ['days', 'hours', 'minutes', 'seconds'];
  const elements = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
  if (!elements.days || !elements.hours || !elements.minutes || !elements.seconds) return;

  if (distance <= 0) {
    elements.days.textContent = '00';
    elements.hours.textContent = '00';
    elements.minutes.textContent = '00';
    elements.seconds.textContent = '00';
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  elements.days.textContent = padNumber(days);
  elements.hours.textContent = padNumber(hours);
  elements.minutes.textContent = padNumber(minutes);
  elements.seconds.textContent = padNumber(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Tickets
function openTicketForm(tier, price) {
  const form = document.getElementById('ticketForm');
  if (!form) return;
  form.style.display = 'block';

  const title = document.getElementById('ticketFormTitle');
  const subtitle = document.getElementById('ticketFormSub');
  const success = document.getElementById('ticketSuccess');
  const select = document.getElementById('ticketTierSelect');

  if (title) title.textContent = `${tier} — ${price}`;
  if (subtitle) subtitle.textContent = 'NGHT SHFT Vol. 12 · Complete the form and we\'ll confirm your booking.';
  if (success) success.style.display = 'none';
  if (select) {
    [...select.options].forEach((option, index) => {
      if (option.textContent.toLowerCase().includes(tier.toLowerCase())) select.selectedIndex = index;
    });
  }

  setTimeout(() => form.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
}

function submitTicket() {
  const msg = document.getElementById('ticketSuccess');
  if (msg) msg.style.display = 'block';
}

// Merch modal
function openMerchModal(name, price, desc) {
  const modal = document.getElementById('merchModal');
  if (!modal) return;
  document.getElementById('modalItemName').textContent = name;
  document.getElementById('modalItemPrice').textContent = price;
  document.getElementById('modalItemDesc').textContent = desc;
  const success = document.getElementById('merchSuccess');
  if (success) success.style.display = 'none';
  modal.classList.add('open');
}

function closeMerchModal(event) {
  const modal = document.getElementById('merchModal');
  if (event.target === modal) modal.classList.remove('open');
}

function submitMerch() {
  const msg = document.getElementById('merchSuccess');
  if (msg) msg.style.display = 'block';
}

function submitContact() {
  const msg = document.getElementById('contactSuccess');
  if (msg) msg.style.display = 'block';
}

// Gallery upload and lightbox
let lbCards = [];
let lbIndex = 0;

function handleDrop(event) {
  event.preventDefault();
  const uploadZone = document.getElementById('uploadZone');
  if (uploadZone) {
    uploadZone.style.borderColor = 'var(--gold-dk)';
    uploadZone.style.background = 'var(--surface)';
  }
  handleFiles(event.dataTransfer.files);
}

function handleFiles(files) {
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = event => addUploadedCard(event.target.result, file.name);
    reader.readAsDataURL(file);
  });
}

function addUploadedCard(src, name) {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  const card = document.createElement('div');
  card.className = 'g-card uploaded-card';
  card.dataset.tag = 'uploaded';
  card.dataset.imgSrc = src;
  card.style.cssText = 'aspect-ratio:1;position:relative;overflow:hidden;cursor:pointer;';
  card.innerHTML = `
    <img src="${src}" alt="${name}" style="width:100%;height:100%;object-fit:cover;">
    <div class="g-overlay">VIEW</div>
    <div class="g-tag-badge">My Upload</div>
    <button onclick="event.stopPropagation();this.closest('.g-card').remove()" style="position:absolute;top:0.4rem;right:0.4rem;background:rgba(0,0,0,0.7);border:none;color:var(--silver);width:1.5rem;height:1.5rem;cursor:pointer;font-size:0.8rem;display:flex;align-items:center;justify-content:center;">✕</button>
  `;
  card.onclick = () => openLightbox(card);
  grid.prepend(card);
}

function filterGallery(tag, btn) {
  document.querySelectorAll('.filter-btn').forEach(button => button.classList.remove('active'));
  if (btn) btn.classList.add('active');

  document.querySelectorAll('.g-card').forEach(card => {
    if (tag === 'all' || card.dataset.tag === tag) card.classList.remove('hidden');
    else card.classList.add('hidden');
  });
}

function openLightbox(card) {
  lbCards = Array.from(document.querySelectorAll('.g-card:not(.hidden)'));
  lbIndex = lbCards.indexOf(card);
  renderLightbox();
  const lightbox = document.getElementById('lightbox');
  if (lightbox) lightbox.style.display = 'flex';
}

function renderLightbox() {
  const card = lbCards[lbIndex];
  if (!card) return;

  const img = document.getElementById('lbImg');
  const placeholder = document.getElementById('lbPlaceholder');
  const icon = document.getElementById('lbIcon');
  const caption = document.getElementById('lbCaption');
  const counter = document.getElementById('lbCounter');

  const src = card.dataset.imgSrc || (card.querySelector('img') ? card.querySelector('img').src : null);
  const emojiEl = card.querySelector('span[style*="font-size:2.5rem"]');
  const captionEl = card.querySelector('span[style*="letter-spacing"]');

  if (src && card.classList.contains('uploaded-card')) {
    img.src = src;
    img.style.display = 'block';
    placeholder.style.display = 'none';
  } else {
    img.style.display = 'none';
    placeholder.style.display = 'flex';
    icon.textContent = emojiEl ? emojiEl.textContent : '📷';
    caption.textContent = captionEl ? captionEl.textContent : '';
  }

  if (counter) counter.textContent = `${lbIndex + 1} / ${lbCards.length}`;
}

function lbNav(direction) {
  if (!lbCards.length) return;
  lbIndex = (lbIndex + direction + lbCards.length) % lbCards.length;
  renderLightbox();
}

function closeLightbox(event) {
  const lightbox = document.getElementById('lightbox');
  if (event.target === lightbox) lightbox.style.display = 'none';
}

document.addEventListener('keydown', event => {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox || lightbox.style.display !== 'flex') return;
  if (event.key === 'ArrowLeft') lbNav(-1);
  if (event.key === 'ArrowRight') lbNav(1);
  if (event.key === 'Escape') lightbox.style.display = 'none';
});

