import Alpine from 'alpinejs';
import type { FileExtension, Options } from 'qr-code-styling';
import QRCodeStyling from 'qr-code-styling';
import type { FillType } from './types';

export type ElementType =
  | 'background'
  | 'dots'
  | 'cornersDot'
  | 'cornersSquare';
export type OptionsKey = `${ElementType}Options`;

export interface QRStoreState {
  data: string;
  margin: number;
  fileType: FileExtension;
  logo: {
    file: File | null;
    margin: number;
  };
  elements: Record<
    ElementType,
    {
      fill: FillType;
      color: string;
      colorSecondary?: string;
      rotation?: number;
      style?: string;
    }
  >;
}

export interface QRStore {
  state: QRStoreState;
  qr: QRCodeStyling | null;
  getOptions(): Options;
  updateElement(
    type: ElementType,
    updates: Partial<QRStoreState['elements'][ElementType]>,
  ): void;
  updateElementFill(type: ElementType, fill: FillType): void;
}

export const initializeStore = () => {
  Alpine.store('qr', {
    state: {
      data: 'https://links.omikor.in',
      margin: 10,
      fileType: 'png',
      logo: {
        file: null,
        margin: 0,
      },
      elements: {
        background: {
          fill: 'single',
          color: '#ffffff',
        },
        dots: {
          fill: 'single',
          color: '#000000',
          style: 'square',
        },
        cornersDot: {
          fill: 'single',
          color: '#000000',
          style: 'square',
        },
        cornersSquare: {
          fill: 'single',
          color: '#000000',
          style: 'square',
        },
      },
    } as QRStoreState,

    qr: null,

    getOptions(): Options {
      const options: Options = {
        width: 300,
        height: 300,
        type: 'canvas',
        data: this.state.data,
        margin: this.state.margin,
        imageOptions: { margin: this.state.logo.margin },
      };

      Object.entries(this.state.elements).forEach(([type, element]) => {
        const key = `${type}Options` as OptionsKey;

        // clean up options based on fill type
        if (element.fill === 'single') {
          options[key] = {
            color: element.color,
            // biome-ignore lint/suspicious/noExplicitAny: polymorphic type
            type: element.style as any,
            gradient: undefined,
          };
        } else {
          options[key] = {
            // biome-ignore lint/suspicious/noExplicitAny: polymorphic type
            type: element.style as any,
            gradient: {
              type: element.fill,
              rotation: element.rotation
                ? element.rotation * (Math.PI / 180)
                : 0,
              colorStops: [
                { offset: 0, color: element.color },
                { offset: 1, color: element.colorSecondary || '#ffffff' },
              ],
            },
          };
        }
      });

      return options;
    },

    initializeQR(container: HTMLDivElement) {
      this.qr = new QRCodeStyling(this.getOptions());
      this.qr.append(container);
    },

    updateQR() {
      if (!this.qr) return;
      requestAnimationFrame(() => {
        this.qr?.update(this.getOptions());
      });
    },

    updateLogo(dataUrl?: string) {
      if (!this.qr) return;
      this.qr.update({ image: dataUrl || undefined });
    },

    updateElement(
      type: ElementType,
      updates: Partial<QRStoreState['elements'][ElementType]>,
    ) {
      this.state.elements[type] = {
        ...this.state.elements[type],
        ...updates,
      };
    },

    updateElementFill(type: ElementType, fill: FillType) {
      const element = this.state.elements[type];
      const currentColor = element.color;

      if (fill === 'single') {
        this.state.elements[type] = {
          fill: 'single',
          color: currentColor,
          style: element.style,
        };
      } else {
        this.state.elements[type] = {
          ...element,
          fill,
          colorSecondary: element.colorSecondary || '#ffffff',
          ...(fill === 'linear' && { rotation: 0 }),
        };
      }
    },
  } as QRStore);
};
