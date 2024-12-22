import { ELEMENT_IDS } from './common/constants';
import { QRCodeManager } from './qr-code-manager';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const qrManager = new QRCodeManager();
  const container = document.querySelector(ELEMENT_IDS.preview) as HTMLElement;

  if (container) {
    qrManager.append(container);
    qrManager.initializeEventListeners();
  }
});

// theme handling
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get('theme') ?? 'light';

// listen plugin.ts messages
window.addEventListener('message', (event) => {
  if (event.data.source === 'penpot') {
    document.body.dataset.theme = event.data.theme;
  }
});
