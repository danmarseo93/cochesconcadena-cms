const form = document.getElementById('setup');
const preview = document.getElementById('preview');
const errorMessage = document.getElementById('error');
try { preview.value = localStorage.getItem('ccc-preview-origin') || ''; } catch {}

form.addEventListener('submit', async event => {
  event.preventDefault();
  errorMessage.textContent = '';
  const button = form.querySelector('button');
  button.disabled = true;
  try {
    const response = await fetch('./config.json');
    if (!response.ok) throw new Error('No se ha podido cargar el editor. Recarga la página e inténtalo de nuevo.');
    const config = await response.json();
    const value = preview.value.trim();
    if (value) {
      const url = new URL(value);
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
        throw new Error('Introduce la dirección HTTP o HTTPS de la web de pruebas.');
      }
      config.site_url = config.display_url = url.origin;
      try { localStorage.setItem('ccc-preview-origin', url.origin); } catch {}
    } else {
      try { localStorage.removeItem('ccc-preview-origin'); } catch {}
    }
    if (!window.CMS) throw new Error('No se ha podido cargar Sveltia. Comprueba la conexión y recarga la página.');
    form.hidden = true;
    window.CMS.init({ config: { ...config, load_config_file: false } });
  } catch (error) {
    form.hidden = false;
    errorMessage.textContent = error instanceof TypeError ? 'Comprueba la dirección de la web de pruebas y la conexión.' : error.message;
    button.disabled = false;
  }
});
