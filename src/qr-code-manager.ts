import QRCodeStyling, {
  type FileExtension,
  type Options,
} from 'qr-code-styling';
import { elementIds } from './common/constants';
import type {
  FillType,
  PluginConfig,
  UpdateColorOptionsType,
  UpdateGradientType,
} from './common/types';
import { debounce } from './common/utilities';

export class QRCodeManager {
  private svg: QRCodeStyling;
  private config: PluginConfig;
  private options: Options;

  // cache DOM elements
  private elements: Record<string, HTMLElement | null> = {};

  // cache color inputs for performance
  private colorInputs: Record<
    UpdateGradientType,
    {
      primary: HTMLInputElement | null;
      secondary: HTMLInputElement | null;
    }
  > = {
    background: { primary: null, secondary: null },
    dots: { primary: null, secondary: null },
    cornersDot: { primary: null, secondary: null },
    cornersSquare: { primary: null, secondary: null },
  };

  constructor() {
    this.config = this.initializeConfig();
    this.options = this.initializeOptions();
    this.svg = new QRCodeStyling(this.options);

    this.generateQR = debounce(this.generateQR.bind(this), 150);
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

  private getElement(id: string): HTMLElement | null {
    if (!this.elements[id]) {
      this.elements[id] = document.querySelector(id);
    }
    return this.elements[id];
  }

  private getInputElement(id: string): HTMLInputElement | null {
    return this.getElement(id) as HTMLInputElement | null;
  }

  public initializeEventListeners(): void {
    this.cacheElements();
    this.cacheColorInputs();
    this.initializeControlsEventDelegation();
    this.initializeLogoControls();
    this.initializeActionButtons();
  }

  private cacheElements(): void {
    elementIds.forEach((id) => {
      this.elements[id] = document.querySelector(id);
    });
  }

  private cacheColorInputs(): void {
    Object.keys(this.colorInputs).forEach((type) => {
      const key = type as UpdateGradientType;
      this.colorInputs[key] = {
        primary: document.querySelector(`#qr-${type}-color`),
        secondary: document.querySelector(`#qr-${type}-color-2`),
      };
    });
  }

  private initializeControlsEventDelegation(): void {
    const controlsSection = this.getElement('.controls-section');
    if (!controlsSection) return;

    controlsSection.addEventListener('input', (e) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const id = target.id;
      if (!id) return;

      if (id === 'qr-content') {
        this.handleContentChange(e as InputEvent);
      } else if (id.includes('margin')) {
        this.handleMarginChange(e as InputEvent);
      } else if (id.includes('color')) {
        this.handleColorChange(e as InputEvent);
      } else if (id.includes('style')) {
        this.handleStyleChange(e as InputEvent);
      } else if (id.includes('fill')) {
        this.handleFillChange(e as InputEvent);
      } else if (id.includes('file-input')) {
        this.handleFileInput(e as InputEvent);
      } else if (id.includes('file-type')) {
        this.handleFileTypeChange(e as InputEvent);
      }
    });
  }

  private handleContentChange(e: InputEvent): void {
    const value = (e.target as HTMLInputElement).value;

    if (value.length === 0 || value.length > 1000) return;

    this.options.data = value;
    this.generateQR();
  }

  private handleMarginChange(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    if (!value) return;

    const isMainMargin = target.id.includes('qr-margin');
    const isLogoMargin = target.id.includes('logo-margin');

    if (isMainMargin) {
      const marginValue = this.getInputElement('#qr-margin-value');
      if (marginValue) marginValue.value = value;
      this.options.margin = parseInt(value);
    } else if (isLogoMargin) {
      const logoMarginValue = this.getInputElement('#logo-margin-value');
      if (logoMarginValue) logoMarginValue.value = value;
      this.options.imageOptions!.margin = parseInt(value);
    }

    this.generateQR();
  }

  private handleColorChange(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
    const [, type, colorType] = target.id.split('-');

    if (!type || !this.colorInputs[type as UpdateGradientType]) return;

    const gradientType = type as UpdateGradientType;
    const isSecondary = colorType === 'color-2';

    if (this.config[gradientType].fill === 'single' && !isSecondary) {
      this.updateFirstColor(gradientType, target.value);
    } else {
      this.updateGradient(gradientType);
    }

    this.generateQR();
  }

  private handleFillChange(e: InputEvent): void {
    const target = e.target as HTMLSelectElement;
    const [, type] = target.id.split('-');
    const value = target.value as FillType;

    if (!type || !this.config[type as UpdateGradientType]) return;

    this.updateFillType(type as UpdateGradientType, value);
    this.generateQR();
  }

  private handleStyleChange(e: InputEvent): void {
    const target = e.target as HTMLSelectElement;
    const [, type, prop] = target.id.split('-');

    if (!type || !prop) return;

    const optionKey = `${type}Options` as UpdateColorOptionsType;

    if (this.options[optionKey]) {
      (this.options[optionKey] as any).type = target.value;
      this.generateQR();
    }
  }

  private initializeLogoControls(): void {
    const fileInput = this.getInputElement('#choose-file-input');
    const fileButton = this.getElement('#choose-file-btn');
    const removeLogoButton = this.getElement('#remove-logo');

    fileButton?.addEventListener('click', () => {
      fileInput?.click();
    });

    removeLogoButton?.addEventListener(
      'click',
      this.handleRemoveLogo.bind(this),
    );
  }

  private async handleFileInput(e: Event): Promise<void> {
    const target = e.target as HTMLInputElement;
    const files = target.files;

    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      console.error('Please select an image file');
      return;
    }

    try {
      const dataUrl = await this.readFileAsDataURL(file);
      this.options.image = dataUrl;
      this.config.logoFilename = file.name;

      this.updateLogoUI();
      this.generateQR();
    } catch (error) {
      console.error('Error processing logo:', error);
    }
  }

  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private handleRemoveLogo(): void {
    this.options.image = '';
    this.config.logoFilename = '';

    const fileInput = this.getInputElement('#choose-file-input');
    if (fileInput) fileInput.value = '';

    this.updateLogoUI();
    this.generateQR();
  }

  private updateLogoUI(): void {
    const chooseFileBtn = this.getElement('#choose-file-btn');
    const logoGroup = this.getElement('#logo-group');
    const logoFilename = this.getElement('#logo-filename');
    const logoMarginControl = this.getElement('#logo-margin-control');

    if (this.config.logoFilename) {
      chooseFileBtn?.classList.add('hidden');
      logoGroup?.classList.remove('hidden');
      logoMarginControl?.classList.remove('hidden');

      if (logoFilename) {
        const displayName =
          this.config.logoFilename.length > 30
            ? `${this.config.logoFilename.slice(0, 29)}...`
            : this.config.logoFilename;
        logoFilename.textContent = displayName;
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

    const colorInputs = this.colorInputs[type];
    if (!colorInputs.primary || !colorInputs.secondary) return;

    const optionId = `${type}Options` as UpdateColorOptionsType;
    this.options[optionId]!.gradient = {
      type: fill,
      colorStops: [
        { offset: 0, color: colorInputs.primary.value },
        { offset: 1, color: colorInputs.secondary.value },
      ],
    };

    this.options[optionId]!.color = undefined;
  }

  private updateFillType(type: UpdateGradientType, fill: FillType): void {
    this.config[type].fill = fill;
    const colorInputs = this.colorInputs[type];

    if (!colorInputs.primary || !colorInputs.secondary) return;

    const optionId = `${type}Options` as UpdateColorOptionsType;

    if (fill === 'single') {
      colorInputs.secondary.classList.add('hidden');
      this.options[optionId]!.gradient = undefined;
      this.options[optionId]!.color = colorInputs.primary.value;
    } else {
      colorInputs.secondary.classList.remove('hidden');
      this.updateGradient(type);
    }
  }

  private updateFirstColor(type: UpdateGradientType, color: string): void {
    const optionId = `${type}Options` as UpdateColorOptionsType;

    if (this.config[type].fill === 'single') {
      this.options[optionId]!.color = color;
    } else {
      this.updateGradient(type);
    }
  }

  private initializeActionButtons(): void {
    const addButton = this.getElement('#add-qr');
    const downloadButton = this.getElement('#download-qr');

    addButton?.addEventListener('click', this.handleAddQR.bind(this));
    downloadButton?.addEventListener('click', this.handleDownloadQR.bind(this));
  }

  private handleFileTypeChange(e: Event): void {
    const target = e.target as HTMLSelectElement;
    const value = target.value as FileExtension;

    if (!value) return;
    this.config.fileType = value;
  }

  private async handleAddQR(): Promise<void> {
    if (!this.svg) return;

    try {
      let data: string | ArrayBuffer;

      if (this.config.fileType === 'svg') {
        data = this.svg._svg?.outerHTML || '';
      } else {
        const blob = (await this.svg.getRawData(this.config.fileType)) as Blob;
        data = await blob.arrayBuffer();
      }

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
    } catch (error) {
      console.error('Error adding QR code:', error);
    }
  }

  private handleDownloadQR(): void {
    if (!this.svg) return;

    const timestamp = new Date()
      .toISOString()
      .replace(/[:]/g, '-')
      .slice(0, -5);
    const filename = `QR-Code-${timestamp}`;

    this.svg.download({
      extension: this.config.fileType,
      name: filename,
    });
  }

  private generateQR(): void {
    if (!this.svg) return;

    requestAnimationFrame(() => {
      this.svg.update(this.options);
    });
  }

  public append(container: HTMLElement): void {
    this.svg.append(container);
  }

  public destroy(): void {
    this.elements = {};

    this.colorInputs = {
      background: { primary: null, secondary: null },
      dots: { primary: null, secondary: null },
      cornersDot: { primary: null, secondary: null },
      cornersSquare: { primary: null, secondary: null },
    };

    this.config = this.initializeConfig();
    this.options = this.initializeOptions();
  }
}
