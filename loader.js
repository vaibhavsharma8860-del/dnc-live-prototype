(async () => {
  const app = document.getElementById('app');
  try {
    const files = Array.from({length: 11}, (_, i) => `./app-part${i + 1}.js`);
    const responses = await Promise.all(files.map(async (url) => {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`${url} returned ${response.status}`);
      return response.text();
    }));
    let source = responses.join('\n');
    source = source.split("'data-action=\"select-all-matching\"`)").join("'data-action=\"select-all-matching\"')");
    new Function(source)();
  } catch (error) {
    console.error(error);
    const message = String(error && error.message || error).replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));
    app.innerHTML = `<main style="padding:40px;font:14px system-ui;color:#17232d"><h1 style="font-size:22px">Prototype failed to load</h1><p style="margin-top:12px;color:#5f6e7a">The deployment loaded, but the application bundle could not start. Please refresh; if this persists, the build needs attention.</p><pre style="margin-top:16px;white-space:pre-wrap">${message}</pre></main>`;
  }
})();
