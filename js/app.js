/**
 * Registro de Alcalinizado en Tanque – Lógica orientada a OPERARIOS
 * EXPORTADORA ROMEX S.A. | P-RAT-R-055
 *
 * Parámetros oficiales:
 *   pH          : 6.80 – 7.40
 *   % Humedad   : 1.5  – 4.0
 *   Solución T° : 50   – 120 °C
 *   Vacío       : -0.5 – -0.8
 */

const STORAGE_KEY = 'romex_registro_alcalinizado_v1';

const RANGES = {
  carga_ph:      { min: 6.80, max: 7.40, label: 'pH' },
  carga_humedad: { min: 1.5,  max: 4.0,  label: '% Humedad' },
  sol_parametro: { min: 50,   max: 120,  label: 'T° Solución' },
  vac_parametro: { min: -0.8, max: -0.5, label: 'Vacío (BAR)' }
};

// Campos críticos para la barra de progreso
const CRITICAL_FIELDS = [
  'fecha', 'turno', 'operario',
  'carga_ph', 'carga_humedad',
  'n_tanque_reactor',
  'lote_producto'
];

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registroForm');
  const statusEl = document.getElementById('status');

  loadDraft();
  setupValidation();
  setupNowButtons();
  setupEnterNavigation();
  updateProgress();

  // Auto-save + progress
  let saveTimer;
  form.addEventListener('input', (e) => {
    validateField(e.target);
    updateProgress();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveDraft(true), 700);
  });

  form.addEventListener('change', (e) => {
    validateField(e.target);
    updateProgress();
  });

  document.getElementById('btnSave').addEventListener('click', () => saveDraft(false));
  document.getElementById('btnClear').addEventListener('click', clearForm);
  document.getElementById('btnPrint').addEventListener('click', () => {
    saveDraft(true);
    window.print();
  });

  // Fecha de hoy por defecto
  const fechaInput = document.getElementById('fecha');
  if (fechaInput && !fechaInput.value) {
    fechaInput.value = new Date().toISOString().slice(0, 10);
  }

  // ========== BOTONES "AHORA" PARA CAMPOS DE HORA ==========
  function setupNowButtons() {
    document.querySelectorAll('input[type="time"]').forEach(input => {
      // Evitar duplicar el botón
      if (input.parentElement.querySelector('.btn-now')) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-now';
      btn.textContent = 'Ahora';
      btn.title = 'Poner la hora actual';
      btn.addEventListener('click', () => {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        input.value = `${hh}:${mm}`;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.focus();
      });

      // Envolver input + botón
      const wrap = document.createElement('div');
      wrap.className = 'time-wrap';
      input.parentNode.insertBefore(wrap, input);
      wrap.appendChild(input);
      wrap.appendChild(btn);
    });
  }

  // ========== NAVEGACIÓN CON ENTER ==========
  function setupEnterNavigation() {
    const fields = Array.from(form.querySelectorAll('input, select'));
    fields.forEach((el, idx) => {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const next = fields[idx + 1];
          if (next) next.focus();
        }
      });
    });
  }

  // ========== BARRA DE PROGRESO ==========
  function updateProgress() {
    const bar = document.getElementById('progressBar');
    const label = document.getElementById('progressLabel');
    if (!bar || !label) return;

    let filled = 0;
    CRITICAL_FIELDS.forEach(name => {
      const el = form.querySelector(`[name="${name}"]`);
      if (el && el.value && el.value.trim() !== '') filled++;
    });

    const pct = Math.round((filled / CRITICAL_FIELDS.length) * 100);
    bar.style.width = pct + '%';
    label.textContent = `${filled}/${CRITICAL_FIELDS.length} datos clave`;

    bar.classList.toggle('complete', pct === 100);
  }

  // ========== VALIDACIÓN EN TIEMPO REAL ==========
  function setupValidation() {
    Object.keys(RANGES).forEach(name => {
      const el = form.querySelector(`[name="${name}"]`);
      if (el) validateField(el);
    });
  }

  function validateField(el) {
    if (!el || !el.name) return;
    const range = RANGES[el.name];
    if (!range) return;

    const raw = el.value.trim().replace(',', '.');
    if (raw === '') {
      el.classList.remove('ok', 'out');
      return;
    }

    const val = parseFloat(raw);
    if (isNaN(val)) {
      el.classList.remove('ok');
      el.classList.add('out');
      return;
    }

    const inRange = val >= range.min && val <= range.max;
    el.classList.toggle('ok', inRange);
    el.classList.toggle('out', !inRange);
  }

  // ========== GUARDAR / CARGAR / LIMPIAR ==========
  function saveDraft(silent = false) {
    const data = {};
    form.querySelectorAll('input, select, textarea').forEach(el => {
      if (el.name) {
        data[el.name] = el.type === 'checkbox' ? el.checked : el.value;
      }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    if (!silent) {
      showStatus('✓ Borrador guardado', 'ok');
    }
  }

  function loadDraft() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      Object.keys(data).forEach(key => {
        const el = form.querySelector(`[name="${key}"]`);
        if (!el) return;
        if (el.type === 'checkbox') el.checked = !!data[key];
        else el.value = data[key];
      });
      setupValidation();
      updateProgress();
      showStatus('Borrador restaurado', 'ok', 2200);
    } catch (e) {
      console.warn('No se pudo cargar el borrador', e);
    }
  }

  function clearForm() {
    if (!confirm('¿Seguro que deseas limpiar todo el formulario?\nSe perderán los datos no guardados.')) return;
    form.reset();
    localStorage.removeItem(STORAGE_KEY);
    form.querySelectorAll('input').forEach(el => el.classList.remove('ok', 'out'));
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) fechaInput.value = new Date().toISOString().slice(0, 10);
    updateProgress();
    showStatus('Formulario limpio');
  }

  function showStatus(msg, type = '', duration = 2400) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'visible' + (type ? ' ' + type : '');
    clearTimeout(statusEl._timer);
    statusEl._timer = setTimeout(() => {
      statusEl.className = '';
    }, duration);
  }
});
