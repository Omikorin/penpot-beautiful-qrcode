export const elementIds = [
  '.controls-section',
  '#qr-preview',
  '#qr-content',
  '#qr-margin-slider',
  '#qr-margin-slider-value',
  '#choose-file-input',
  '#choose-file-btn',
  '#logo-group',
  '#logo-filename',
  '#logo-margin-slider-control',
  '#logo-margin-slider',
  '#logo-margin-slider-value',
  '#remove-logo',
  '#add-qr',
  '#download-qr',
] as const;

export type ElementIds = (typeof elementIds)[number];
