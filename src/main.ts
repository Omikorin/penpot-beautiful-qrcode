import QRCodeStyling, {
  CornerDotType,
  CornerSquareType,
  DotType,
  type FileExtension,
  type Options,
} from 'qr-code-styling';
import './style.css';
import type {
  FillType,
  PluginConfig,
  UpdateColorOptionsType,
  UpdateGradientType,
} from './types';

// get the current theme from the URL
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get('theme') ?? 'light';

const config: PluginConfig = {
  fileType: 'svg',
  logoFilename: '',
  background: {
    fill: 'single',
  },
  dots: {
    fill: 'single',
  },
  cornersDot: {
    fill: 'single',
  },
  cornersSquare: {
    fill: 'single',
  },
};

const options: Options = {
  width: 300,
  height: 300,
  type: 'svg',
  data: 'https://links.omikor.in',
  margin: 10,

  backgroundOptions: {
    color: '#ffffff',
  },
  dotsOptions: {
    color: '#000000',
  },
  cornersSquareOptions: {
    color: '#000000',
    type: 'square',
  },
  cornersDotOptions: {
    color: '#000000',
    type: 'square',
  },
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

  const updateGradient = (type: UpdateGradientType) => {
    const { fill } = config[type];
    if (fill === 'single') return;

    const color1 = (
      document.querySelector(`#qr-${type}-color`) as HTMLInputElement
    ).value;
    const color2 = (
      document.querySelector(`#qr-${type}-color-2`) as HTMLInputElement
    ).value;

    const optionId = `${type}Options` as UpdateColorOptionsType;

    options[optionId]!.gradient = {
      type: fill,
      colorStops: [
        { offset: 0, color: color1 },
        { offset: 1, color: color2 },
      ],
    };

    options[optionId]!.color = undefined;
  };

  const updateFillType = (type: UpdateGradientType, fill: FillType) => {
    config[type].fill = fill;

    const colorPicker1 = document.querySelector(
      `#qr-${type}-color`,
    ) as HTMLInputElement;
    const colorPicker2 = document.querySelector(
      `#qr-${type}-color-2`,
    ) as HTMLInputElement;

    const optionId = `${type}Options` as UpdateColorOptionsType;

    if (fill === 'single') {
      colorPicker2.classList.add('hidden');
      options[optionId]!.gradient = undefined;
      options[optionId]!.color = colorPicker1.value;
    } else {
      colorPicker2.classList.remove('hidden');
      updateGradient(type);
    }
  };

  document
    .querySelector('#qr-background-fill')
    ?.addEventListener('input', (e) => {
      const value = (e.target as HTMLSelectElement).value as FillType;
      updateFillType('background', value);
      generateQR();
    });

  const updateFirstColor = (type: UpdateGradientType, color: string) => {
    const { fill } = config[type];

    const propId = `${type}Options` as UpdateColorOptionsType;

    if (fill === 'single') {
      options[propId]!.color = color;
    } else {
      updateGradient(type);
    }
  };

  document
    .querySelector('#qr-background-color')
    ?.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      updateFirstColor('background', value);
      generateQR();
    });

  document
    .querySelector('#qr-background-color-2')
    ?.addEventListener('input', () => {
      updateGradient('background');
      generateQR();
    });

  document.querySelector('#qr-dots-style')?.addEventListener('input', (e) => {
    const value = (e.target as HTMLSelectElement).value as DotType;
    options.dotsOptions!.type = value;
    generateQR();
  });

  document.querySelector('#qr-dots-fill')?.addEventListener('input', (e) => {
    const value = (e.target as HTMLSelectElement).value as FillType;
    updateFillType('dots', value);
    generateQR();
  });

  document.querySelector('#qr-dots-color')?.addEventListener('input', (e) => {
    const value = (e.target as HTMLInputElement).value;
    updateFirstColor('dots', value);
    generateQR();
  });

  document.querySelector('#qr-dots-color-2')?.addEventListener('input', () => {
    updateGradient('dots');
    generateQR();
  });

  document
    .querySelector('#qr-cornersSquare-style')
    ?.addEventListener('input', (e) => {
      const value = (e.target as HTMLSelectElement).value as CornerSquareType;
      options.cornersSquareOptions!.type = value;
      generateQR();
    });

  document
    .querySelector('#qr-cornersSquare-fill')
    ?.addEventListener('input', (e) => {
      const value = (e.target as HTMLSelectElement).value as FillType;
      updateFillType('cornersSquare', value);
      generateQR();
    });

  document
    .querySelector('#qr-cornersSquare-color')
    ?.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      updateFirstColor('cornersSquare', value);
      generateQR();
    });

  document
    .querySelector('#qr-cornersSquare-color-2')
    ?.addEventListener('input', () => {
      updateGradient('cornersSquare');
      generateQR();
    });

  document
    .querySelector('#qr-cornersDot-style')
    ?.addEventListener('input', (e) => {
      const value = (e.target as HTMLSelectElement).value as CornerDotType;
      options.cornersDotOptions!.type = value;
      generateQR();
    });

  document
    .querySelector('#qr-cornersDot-fill')
    ?.addEventListener('input', (e) => {
      const value = (e.target as HTMLSelectElement).value as FillType;
      updateFillType('cornersDot', value);
      generateQR();
    });

  document
    .querySelector('#qr-cornersDot-color')
    ?.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      updateFirstColor('cornersDot', value);
      generateQR();
    });

  document
    .querySelector('#qr-cornersDot-color-2')
    ?.addEventListener('input', () => {
      updateGradient('cornersDot');
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
