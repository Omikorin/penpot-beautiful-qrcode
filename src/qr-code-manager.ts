import QRCodeStyling, {
  type FileExtension,
  type Options,
} from 'qr-code-styling';
import { ELEMENT_IDS } from './common/constants';
import type {
  FillType,
  PluginConfig,
  UpdateColorOptionsType,
  UpdateGradientType,
} from './common/types';

export class QRCodeManager {
  private svg: QRCodeStyling;
  private config: PluginConfig;
  private options: Options;

  constructor() {
    this.config = this.initializeConfig();
    this.options = this.initializeOptions();
    this.svg = new QRCodeStyling(this.options);
  }

  private initializeConfig(): PluginConfig {
    return {
      fileType: 'png',
      logoFilename: '',
      background: { fill: 'single' },
      dots: { fill: 'single' },
      cornersDot: { fill: 'single' },
      cornersSquare: { fill: 'single' },
    };
  }

  private initializeOptions(): Options {
    return {
      width: 300,
      height: 300,
      type: 'canvas',
      data: 'https://links.omikor.in',
      margin: 10,
      imageOptions: { margin: 0 },
      backgroundOptions: { color: '#ffffff' },
      dotsOptions: { color: '#000000' },
      cornersSquareOptions: {
        color: '#000000',
        type: 'square',
      },
      cornersDotOptions: {
        color: '#000000',
        type: 'square',
      },
    };
  }

  public initializeEventListeners(): void {
    this.initializeBasicControls();
    this.initializeLogoControls();
    this.initializeStyleControls();
    this.initializeActionButtons();
  }

  private initializeBasicControls(): void {
    const qrContent = document.querySelector(ELEMENT_IDS.content);
    const qrMargin = document.querySelector(ELEMENT_IDS.margin);
    const qrMarginValue = document.querySelector(ELEMENT_IDS.marginValue);

    qrContent?.addEventListener('input', (e) => this.handleContentChange(e));
    qrMargin?.addEventListener('input', (e) => this.handleMarginChange(e));
    qrMarginValue?.addEventListener('input', (e) =>
      this.handleMarginValueChange(e),
    );
  }

  private initializeLogoControls(): void {
    const fileInput = document.querySelector(ELEMENT_IDS.fileInput);
    const fileButton = document.querySelector(ELEMENT_IDS.fileButton);
    const removeLogoButton = document.querySelector(
      ELEMENT_IDS.removeLogoButton,
    );
    const logoMargin = document.querySelector(ELEMENT_IDS.logoMargin);
    const logoMarginValue = document.querySelector(ELEMENT_IDS.logoMarginValue);

    fileInput?.addEventListener('input', (e) => this.handleFileInput(e));
    fileButton?.addEventListener('click', () => this.handleFileButtonClick());
    removeLogoButton?.addEventListener('click', () => this.handleRemoveLogo());
    logoMargin?.addEventListener('input', (e) =>
      this.handleLogoMarginChange(e),
    );
    logoMarginValue?.addEventListener('input', (e) =>
      this.handleLogoMarginValueChange(e),
    );
  }

  private initializeStyleControls(): void {
    this.initializeComponentControls('background');
    this.initializeComponentControls('dots');
    this.initializeComponentControls('cornersSquare');
    this.initializeComponentControls('cornersDot');
  }

  private initializeComponentControls(type: UpdateGradientType): void {
    const fillSelect = document.querySelector(`#qr-${type}-fill`);
    const colorPicker1 = document.querySelector(`#qr-${type}-color`);
    const colorPicker2 = document.querySelector(`#qr-${type}-color-2`);
    const styleSelect = document.querySelector(`#qr-${type}-style`);

    fillSelect?.addEventListener('input', (e) =>
      this.handleFillTypeChange(type, e),
    );
    colorPicker1?.addEventListener('input', (e) =>
      this.handleColorChange(type, e),
    );
    colorPicker2?.addEventListener('input', () =>
      this.handleGradientUpdate(type),
    );
    styleSelect?.addEventListener('input', (e) =>
      this.handleStyleChange(type, e),
    );
  }

  private initializeActionButtons(): void {
    const addButton = document.querySelector('#add-qr');
    const downloadButton = document.querySelector('#download-qr');
    const fileTypeSelect = document.querySelector('#qr-file-type');

    addButton?.addEventListener('click', () => this.handleAddQR());
    downloadButton?.addEventListener('click', () => this.handleDownloadQR());
    fileTypeSelect?.addEventListener('input', (e) =>
      this.handleFileTypeChange(e),
    );
  }

  // Event handler implementations
  private handleContentChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (value.length === 0) return;
    this.options.data = value;
    this.generateQR();
  }

  private handleMarginChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value) return;

    const marginInput = document.querySelector(
      ELEMENT_IDS.marginValue,
    ) as HTMLInputElement;
    marginInput.value = value;
    this.options.margin = parseInt(value);
    this.generateQR();
  }

  private handleMarginValueChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value) return;

    const marginSlider = document.querySelector(
      ELEMENT_IDS.margin,
    ) as HTMLInputElement;
    marginSlider.value = value;
    this.options.margin = parseInt(value);
    this.generateQR();
  }

  private handleFileInput(e: Event): void {
    const files = (e.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.addEventListener(
      'load',
      () => {
        this.options.image = reader.result as string;
        this.config.logoFilename = file.name;
        this.updateLogoUI();
        this.generateQR();
      },
      false,
    );

    reader.readAsDataURL(file);
  }

  private handleFileButtonClick(): void {
    (
      document.querySelector(ELEMENT_IDS.fileInput) as HTMLInputElement
    )?.click();
  }

  private handleRemoveLogo(): void {
    this.options.image = '';
    this.config.logoFilename = '';
    (document.querySelector(ELEMENT_IDS.fileInput) as HTMLInputElement).value =
      '';
    this.updateLogoUI();
    this.generateQR();
  }

  private handleLogoMarginChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value) return;

    const marginInput = document.querySelector(
      ELEMENT_IDS.logoMarginValue,
    ) as HTMLInputElement;
    marginInput.value = value;
    this.options.imageOptions!.margin = parseInt(value);
    this.generateQR();
  }

  private handleLogoMarginValueChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value) return;

    const marginSlider = document.querySelector(
      ELEMENT_IDS.logoMargin,
    ) as HTMLInputElement;
    marginSlider.value = value;
    this.options.imageOptions!.margin = parseInt(value);
    this.generateQR();
  }

  private handleFillTypeChange(type: UpdateGradientType, e: Event): void {
    const value = (e.target as HTMLSelectElement).value as FillType;
    this.updateFillType(type, value);
    this.generateQR();
  }

  private handleColorChange(type: UpdateGradientType, e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    this.updateFirstColor(type, value);
    this.generateQR();
  }

  private handleGradientUpdate(type: UpdateGradientType): void {
    this.updateGradient(type);
    this.generateQR();
  }

  private handleStyleChange(type: UpdateGradientType, e: Event): void {
    const value = (e.target as HTMLSelectElement).value;
    const optionKey = `${type}Options` as UpdateColorOptionsType;

    if (this.options[optionKey]) {
      (this.options[optionKey] as any).type = value;
      this.generateQR();
    }
  }

  private async handleAddQR(): Promise<void> {
    if (!this.svg) return;

    let data;

    if (this.config.fileType === 'svg') {
      data = this.svg._svg?.outerHTML;
    } else {
      data = (await this.svg.getRawData(this.config.fileType)) as Blob;
      data = await data.arrayBuffer();
    }

    if (!data) return;

    parent.postMessage(
      {
        type: 'add-qr',
        content: {
          fileType: this.config.fileType,
          data,
          name: 'New QR Code',
        },
      },
      '*',
    );
  }

  private handleDownloadQR(): void {
    if (!this.svg) return;
    this.svg.download({ extension: this.config.fileType, name: 'New QR Code' });
  }

  private handleFileTypeChange(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as FileExtension;
    if (!value) return;
    this.config.fileType = value;
  }

  // Utility Methods
  private updateLogoUI(): void {
    const chooseFileBtn = document.querySelector(ELEMENT_IDS.fileButton);
    const logoGroup = document.querySelector(ELEMENT_IDS.logoGroup);
    const logoMarginControl = document.querySelector(
      ELEMENT_IDS.logoMarginControl,
    );
    const logoFilename = document.querySelector(ELEMENT_IDS.logoFilename);

    if (this.config.logoFilename) {
      chooseFileBtn?.classList.add('hidden');
      logoGroup?.classList.remove('hidden');
      logoMarginControl?.classList.remove('hidden');
      if (logoFilename) {
        logoFilename.textContent =
          this.config.logoFilename.length > 30
            ? `${this.config.logoFilename.slice(0, 29)}...`
            : this.config.logoFilename;
      }
    } else {
      chooseFileBtn?.classList.remove('hidden');
      logoGroup?.classList.add('hidden');
      logoMarginControl?.classList.add('hidden');
    }
  }

  private updateGradient(type: UpdateGradientType): void {
    const { fill } = this.config[type];
    if (fill === 'single') return;

    const color1 = (
      document.querySelector(`#qr-${type}-color`) as HTMLInputElement
    ).value;
    const color2 = (
      document.querySelector(`#qr-${type}-color-2`) as HTMLInputElement
    ).value;
    const optionId = `${type}Options` as UpdateColorOptionsType;

    this.options[optionId]!.gradient = {
      type: fill,
      colorStops: [
        { offset: 0, color: color1 },
        { offset: 1, color: color2 },
      ],
    };

    this.options[optionId]!.color = undefined;
  }

  private updateFillType(type: UpdateGradientType, fill: FillType): void {
    this.config[type].fill = fill;

    const colorPicker1 = document.querySelector(
      `#qr-${type}-color`,
    ) as HTMLInputElement;
    const colorPicker2 = document.querySelector(
      `#qr-${type}-color-2`,
    ) as HTMLInputElement;
    const optionId = `${type}Options` as UpdateColorOptionsType;

    if (fill === 'single') {
      colorPicker2.classList.add('hidden');
      this.options[optionId]!.gradient = undefined;
      this.options[optionId]!.color = colorPicker1.value;
    } else {
      colorPicker2.classList.remove('hidden');
      this.updateGradient(type);
    }
  }

  private updateFirstColor(type: UpdateGradientType, color: string): void {
    const { fill } = this.config[type];
    const propId = `${type}Options` as UpdateColorOptionsType;

    if (fill === 'single') {
      this.options[propId]!.color = color;
    } else {
      this.updateGradient(type);
    }
  }

  public generateQR(): void {
    this.svg.update(this.options);
  }

  public append(container: HTMLElement): void {
    this.svg.append(container);
  }
}
