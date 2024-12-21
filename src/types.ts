import type { FileExtension, GradientType } from 'qr-code-styling';

export type ColorType = 'single' | GradientType;

export interface PluginConfig {
  fileType: FileExtension;
  logoFilename: string;
  background: {
    colorType: ColorType;
  };
}

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
