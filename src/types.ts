import type {
  CornerDotType,
  CornerSquareType,
  DotType,
  FileExtension,
  GradientType,
} from 'qr-code-styling';

export type ColorType = 'single' | GradientType;

export interface PluginConfig {
  fileType: FileExtension;
  logoFilename: string;
  background: {
    colorType: ColorType;
  };
  dots: {
    colorType: ColorType;
    style: DotType;
  };
  cornersDot: {
    colorType: ColorType;
    style: CornerDotType;
  };
  cornersSquare: {
    colorType: ColorType;
    style: CornerSquareType;
  };
}

export type UpdateGradientType =
  | 'background'
  | 'dots'
  | 'cornersDot'
  | 'cornersSquare';

export type UpdateColorOptionsType = `${UpdateGradientType}Options`;

// Penpot integration types
export interface PluginAddSVGEvent {
  type: 'add-qr';
  content: {
    fileType: Extract<FileExtension, 'svg'>;
    data: string;
    name: string;
  };
}

export interface PluginAddImageEvent {
  type: 'add-qr';
  content: {
    fileType: Exclude<FileExtension, 'svg'>;
    data: ArrayBuffer;
    name: string;
  };
}

export type PluginAddEvent = PluginAddSVGEvent | PluginAddImageEvent;

export type PluginEvent = PluginAddEvent;
