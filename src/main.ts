import QRCodeStyling, {
  type FileExtension,
  type Options,
} from 'qr-code-styling';
import './style.css';
import type { PluginConfig } from './types';

// get the current theme from the URL
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get('theme') ?? 'light';

const config: PluginConfig = {
  fileType: 'svg',
  logoFilename: '',
};

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

  document
    .querySelector('#choose-file-input')
    ?.addEventListener('input', (e) => {
      const files = (e.target as HTMLInputElement).files;

      if (!files || files.length === 0) return;

      const file = files[0];
      const reader = new FileReader();

      reader.addEventListener(
        'load',
        () => {
          options.image = reader.result as string;
          config.logoFilename = file.name;
          updateLogoUI();
          generateQR();
        },
        false,
      );

      reader.readAsDataURL(file);
    });

  const updateLogoUI = () => {
    const chooseFileBtn = document.querySelector('#choose-file-btn');
    const logoGroup = document.querySelector('#logo-group');
    const logoFilename = document.querySelector('#logo-filename');

    if (config.logoFilename) {
      chooseFileBtn?.classList.add('hidden');
      logoGroup?.classList.remove('hidden');
      if (logoFilename) {
        if (config.logoFilename.length > 30)
          logoFilename.textContent = `${config.logoFilename.slice(0, 29)}...`;
        else logoFilename.textContent = config.logoFilename;
      }
    } else {
      chooseFileBtn?.classList.remove('hidden');
      logoGroup?.classList.add('hidden');
    }
  };

  document.querySelector('#choose-file-btn')?.addEventListener('click', () => {
    (document.querySelector('#choose-file-input') as HTMLInputElement)?.click();
  });

  document.querySelector('#remove-logo')?.addEventListener('click', () => {
    options.image = '';
    config.logoFilename = '';
    (document.querySelector('#choose-file-input') as HTMLInputElement).value =
      '';
    updateLogoUI();
    generateQR();
  });

  document.querySelector('#qr-file-type')?.addEventListener('input', (e) => {
    const value = (e.target as HTMLSelectElement).value as FileExtension;

    if (!value) return;

    config.fileType = value;
  });

  document.querySelector('#add-qr')?.addEventListener('click', async () => {
    if (!svg) return;

    let data;

    if (config.fileType === 'svg') {
      data = svg._svg?.outerHTML;
    } else {
      // Blob will always be returned in the browser
      data = (await svg.getRawData(config.fileType)) as Blob;
      data = await data.arrayBuffer();
    }

    if (!data) return;

    parent.postMessage(
      {
        type: 'add-qr',
        content: {
          fileType: config.fileType,
          data,
          name: 'New QR Code',
        },
      },
      '*',
    );
  });

  document
    .querySelector('#download-qr')
    ?.addEventListener('click', async () => {
      if (!svg) return;

      svg.download({ extension: config.fileType, name: 'New QR Code' });
    });
});

// Listen plugin.ts messages
window.addEventListener('message', (event) => {
  if (event.data.source === 'penpot') {
    document.body.dataset.theme = event.data.theme;
  }
});
