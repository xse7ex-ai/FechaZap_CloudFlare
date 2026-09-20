import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

async function configurarPWA() {
  if (!('serviceWorker' in navigator)) return;

  const host = window.location.hostname;
  const ambienteDesenvolvimento =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0';

  // No desenvolvimento, não deixamos o Service Worker esconder alterações
  // feitas no Spck. Também limpamos registros/caches antigos uma vez.
  if (ambienteDesenvolvimento) {
    try {
      const registros = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registros.map(registro => registro.unregister()));

      if ('caches' in window) {
        const cachesAtuais = await caches.keys();
        await Promise.all(cachesAtuais.map(nome => caches.delete(nome)));
      }
    } catch {
      // Se o navegador bloquear a limpeza, o app continua normalmente.
    }
    return;
  }

  // Em produção, mantém o PWA ativo.
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js?v=3')
      .catch(() => undefined);
  });
}

void configurarPWA();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
