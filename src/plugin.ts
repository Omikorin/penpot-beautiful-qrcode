import type { PluginEvent } from './types';

penpot.ui.open('Beautiful QR Code', `?theme=${penpot.theme}`, {
  width: 285,
  height: 770,
});

penpot.ui.onMessage<PluginEvent>(async (message) => {
  if (message.type === 'add-qr') {
    const { fileType, data, name } = message.content;

    if (!data || !name) return;

    if (fileType === 'svg') {
      const group = penpot.createShapeFromSvg(data);
      if (group) group.name = name;
    } else {
      const mimeType = `image/${fileType}`;
      const imageData = await penpot.uploadMediaData(
        name,
        new Uint8Array(data),
        mimeType,
      );

      const shape = penpot.createRectangle();
      shape.resize(300, 300);
      shape.fills = [{ fillOpacity: 1, fillImage: imageData }];
    }
  }
});

// Update the theme in the iframe
penpot.on('themechange', (theme) => {
  penpot.ui.sendMessage({
    source: 'penpot',
    type: 'themechange',
    theme,
  });
});
