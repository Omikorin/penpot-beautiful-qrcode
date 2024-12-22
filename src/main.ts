import { QRCodeManager } from './qr-code-manager';
import './style.css';

const initializeApp = () => {
  const qrManager = new QRCodeManager();
  const container = document.querySelector('#qr-preview') as HTMLElement;

  if (container) {
    qrManager.append(container);
    qrManager.initializeEventListeners();

    window.addEventListener('unload', () => {
      qrManager.destroy();
    });
  }
};

document.addEventListener('DOMContentLoaded', () => initializeApp());

// theme handling
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get('theme') ?? 'light';

// listen plugin.ts messages
window.addEventListener('message', (event) => {
  if (event.data.source === 'penpot') {
    document.body.dataset.theme = event.data.theme;
  }
});
