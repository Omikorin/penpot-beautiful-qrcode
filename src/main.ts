import Alpine from 'alpinejs';
import './assets/main.css';
import { downloadQR, insertQR } from './common/actions';
import { initializeStore } from './common/store';
import type { PluginEvent } from './common/types';
import { colorControls } from './components/color-controls';
import { logoControls } from './components/logo-controls';
import { numberInput } from './components/number-input';
import { qrContent } from './components/qr-content';
import { qrPreview } from './components/qr-preview';

document.addEventListener('alpine:init', () => {
  Alpine.data('colorControls', colorControls);
  Alpine.data('logoControls', logoControls);
  Alpine.data('numberInput', numberInput);
  Alpine.data('qrContent', qrContent);
  Alpine.data('qrPreview', qrPreview);

  Alpine.data('qrActions', () => ({
    insertQR,
    downloadQR,
  }));
});

window.Alpine = Alpine;

initializeStore();
Alpine.start();

// theme handling
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get('theme') ?? 'light';

// listen plugin.ts messages
window.addEventListener('message', (event: MessageEvent<PluginEvent>) => {
  if (event.data.type === 'themechange') {
    document.body.dataset.theme = event.data.content;
  }
});

declare global {
  interface Window {
    Alpine: typeof Alpine;
  }
}
