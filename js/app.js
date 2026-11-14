/**
 * Registro de Alcalinizado en Tanque – App logic
 * EXPORTADORA ROMEX S.A. | P-RAT-R-055
 */

const STORAGE_KEY = 'romex_registro_alcalinizado_v1';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registroForm');
  const statusEl = document.getElementById('status');

  // Load saved draft
  loadDraft();

  // Auto-save on change (debounced)
  let saveTimer;
  form.addEventListener('input', () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveDraft(true);
    }, 600);
  });

  // Buttons
  document.getElementById('btnSave').addEventListener('click', () => saveDraft(false));
  document.getElementById('btnClear').addEventListener('click', clearForm);
  document.getElementById('btnPrint').addEventListener('click', () => window.print());

  // Set today's date by default if empty
  const fechaInput = document.getElementById('fecha');
  if (fechaInput && !fechaInput.value) {
    const today = new Date().toISOString().slice(0, 10);
    fechaInput.value = today;
  }

  function saveDraft(silent = false) {
    const data = {};
    const elements = form.querySelectorAll('input, select, textarea');
    elements.forEach(el => {
      if (el.name) {
        if (el.type === 'checkbox') {
          data[el.name] = el.checked;
        } else {
          data[el.name] = el.value;
        }
      }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (!silent) {
      showStatus('Borrador guardado correctamente');
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
        if (el.type === 'checkbox') {
          el.checked = !!data[key];
        } else {
          el.value = data[key];
        }
      });
      showStatus('Borrador restaurado', 2500);
    } catch (e) {
      console.warn('No se pudo cargar el borrador', e);
    }
  }

  function clearForm() {
    if (!confirm('¿Seguro que deseas limpiar todo el formulario? Esta acción no se puede deshacer.')) return;
    form.reset();
    localStorage.removeItem(STORAGE_KEY);
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
      fechaInput.value = new Date().toISOString().slice(0, 10);
    }
    showStatus('Formulario limpio');
  }

  function showStatus(msg, duration = 2200) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.classList.add('visible');
    setTimeout(() => statusEl.classList.remove('visible'), duration);
  }
});
