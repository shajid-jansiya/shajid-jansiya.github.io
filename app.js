(function () {
  'use strict';

  var NIKAH_AT = new Date('2026-12-10T11:00:00+05:30'); // 11 AM IST, Koduvayur, Kerala

  /* ---------- Countdown ---------- */
  var cellsEl = document.getElementById('count-cells');
  var hijriEl = document.getElementById('count-hijri');
  var countBox = document.getElementById('countdown');

  function renderCountdown() {
    var ms = NIKAH_AT.getTime() - Date.now();
    if (ms <= 0) {
      cellsEl.innerHTML = '';
      var done = document.createElement('div');
      done.className = 'nk-count-done';
      done.textContent = 'Alhamdulillah, the Nikah day is here.';
      countBox.insertBefore(done, countBox.firstChild);
      var sub = countBox.querySelector('.nk-count-sub');
      if (sub) sub.hidden = true;
      return;
    }
    var days = Math.floor(ms / 86400000);
    var hours = Math.floor((ms % 86400000) / 3600000);
    var minutes = Math.floor((ms % 3600000) / 60000);
    var seconds = Math.floor((ms % 60000) / 1000);
    var cells = [
      { n: days, label: days === 1 ? 'Day' : 'Days' },
      { n: hours, label: 'Hours' },
      { n: minutes, label: 'Minutes' },
      { n: seconds, label: 'Seconds' }
    ];
    cellsEl.innerHTML = cells.map(function (c) {
      var num = String(c.n).padStart(2, '0');
      return '<div class="nk-count-cell"><div class="nk-count-n">' + num +
        '</div><div class="nk-count-l">' + c.label + '</div></div>';
    }).join('');
  }

  try {
    hijriEl.textContent = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata'
    }).format(NIKAH_AT) + ' (may vary with moon sighting)';
  } catch (e) { /* Hijri label optional */ }

  renderCountdown();
  setInterval(renderCountdown, 1000);

  /* ---------- Dua / lanterns ---------- */
  var DUA_TEXT = {
    prophet: 'Bārakallāhu laka, wa bāraka ʿalayka, wa jamaʿa baynakumā fī khayr — may Allah bless you, send His blessings upon you, and bring you both together in goodness.',
    barakah: 'May Allah fill your home with love, mercy and barakah, and unite you both in this world and in Jannah.'
  };

  var choice = 'prophet';
  var choiceBtns = Array.prototype.slice.call(document.querySelectorAll('.choice'));
  var ownField = document.getElementById('dua-own-field');
  var ownInput = document.getElementById('dua-own');
  var nameInput = document.getElementById('dua-name');
  var lightBtn = document.getElementById('light-btn');
  var litList = document.getElementById('lit-list');
  var litCaption = document.getElementById('lit-caption');

  function syncDuaPanels() {
    choiceBtns.forEach(function (b) {
      var active = b.getAttribute('data-dua') === choice;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-checked', active ? 'true' : 'false');
    });
    document.getElementById('dua-prophet').hidden = choice !== 'prophet';
    document.getElementById('dua-barakah').hidden = choice !== 'barakah';
    ownField.hidden = choice !== 'own';
    lightBtn.disabled = choice === 'own' && !ownInput.value.trim();
  }

  choiceBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      choice = b.getAttribute('data-dua');
      syncDuaPanels();
    });
  });
  ownInput.addEventListener('input', syncDuaPanels);

  lightBtn.addEventListener('click', function () {
    var dua = choice === 'own' ? ownInput.value.trim() : DUA_TEXT[choice];
    if (!dua) return;
    var name = nameInput.value.trim();
    var text = name ? dua + ' — ' + name : dua;
    var item = document.createElement('div');
    item.className = 'nk-lit-lantern';
    var flame = document.createElement('span');
    flame.className = 'nk-lit-flame';
    flame.setAttribute('aria-hidden', 'true');
    flame.textContent = '🏮';
    var body = document.createElement('span');
    body.className = 'nk-lit-text';
    body.textContent = text;
    item.appendChild(flame);
    item.appendChild(body);
    litList.appendChild(item);
    litList.hidden = false;
    litCaption.hidden = false;
    ownInput.value = '';
    syncDuaPanels();
  });

  syncDuaPanels();
})();
