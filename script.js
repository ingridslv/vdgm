(() => {
  'use strict';

  // America/Belem uses UTC−03:00. This explicit offset is independent
  // of the device's time zone: 27 October 2026 at 03:00:00 UTC.
  const target = Date.parse('2026-10-27T00:00:00-03:00');
  const fields = ['days', 'hours', 'minutes', 'seconds'].map(id => document.getElementById(id));
  let interval = null;

  function update() {
    const total = Math.max(0, Math.ceil((target - Date.now()) / 1000));
    const values = [Math.floor(total / 86400), Math.floor(total / 3600) % 24, Math.floor(total / 60) % 60, total % 60];
    fields.forEach((field, index) => {
      const value = String(values[index]).padStart(2, '0');
      if (field.textContent !== value) field.textContent = value;
    });
    if (total === 0 && interval !== null) {
      clearInterval(interval);
      interval = null;
    }
    return total;
  }

  function start() {
    if (update() > 0 && interval === null) interval = setInterval(update, 1000);
  }

  start();
  window.addEventListener('pagehide', () => {
    clearInterval(interval);
    interval = null;
  });
  window.addEventListener('pageshow', start);
})();
