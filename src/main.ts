import QRCodeStyling, { type Options } from 'qr-code-styling';
import './style.css';

// get the current theme from the URL
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get('theme') ?? 'light';

const options: Options = {
  width: 300,
  height: 300,
  type: 'svg',
  data: 'https://links.omikor.in',
  margin: 10,
};

const svg = new QRCodeStyling(options);

const generateQR = () => {
  svg.update(options);
};

document.addEventListener('DOMContentLoaded', () => {
  const svgContainer = document.querySelector('#qr-preview') as HTMLElement;

  if (svgContainer) svg.append(svgContainer);

  document.querySelector('#qr-content')?.addEventListener('input', (e) => {
    const value = (e.target as HTMLInputElement).value;

    if (value.length === 0) return;

    options.data = value;
    generateQR();
  });

  document.querySelector('#qr-margin')?.addEventListener('input', (e) => {
    const value = (e.target as HTMLInputElement).value;

    if (!value) return;

    const marginInput = document.querySelector(
      '#qr-margin-value',
    ) as HTMLInputElement;
    marginInput.value = value;
    options.margin = parseInt(value);
    generateQR();
  });

  document.querySelector('#qr-margin-value')?.addEventListener('input', (e) => {
    const value = (e.target as HTMLInputElement).value;

    if (!value) return;

    const marginSlider = document.querySelector(
      '#qr-margin',
    ) as HTMLInputElement;
    marginSlider.value = value;
    options.margin = parseInt(value);
    generateQR();
  });

  document.querySelector('#add-qr')?.addEventListener('click', async () => {
    if (!svg) return;

    const data = svg._svg?.outerHTML;

    if (!data) return;

    parent.postMessage(
      {
        type: 'add-qr',
        content: {
          data,
          name: 'New QR Code',
        },
      },
      '*',
    );
  });
});

// Listen plugin.ts messages
window.addEventListener('message', (event) => {
  if (event.data.source === 'penpot') {
    document.body.dataset.theme = event.data.theme;
  }
});
