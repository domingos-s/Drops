const updateAppBtn = document.getElementById('updateAppBtn');
const updateStatus = document.getElementById('updateStatus');

async function updateApp() {
  if (!updateAppBtn) return;

  updateAppBtn.disabled = true;
  updateAppBtn.textContent = 'Updating…';
  if (updateStatus) updateStatus.textContent = 'Fetching the latest app files…';

  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }

    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
    }

    if (updateStatus) updateStatus.textContent = 'Updated. Reloading…';

    const url = new URL(window.location.href);
    url.searchParams.set('updated', Date.now().toString());
    window.location.replace(url.toString());
  } catch (error) {
    console.error('App update failed', error);
    if (updateStatus) updateStatus.textContent = 'Update failed. Check your connection and try again.';
    updateAppBtn.disabled = false;
    updateAppBtn.textContent = 'Update App';
  }
}

if (updateAppBtn) updateAppBtn.addEventListener('click', updateApp);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js');
  });
}
