import type { PluginEvent, PluginUIEvent } from './common/types';

penpot.ui.open('Beautiful QR Code', `?theme=${penpot.theme}`, {
  width: 285,
  height: 750,
});

penpot.ui.onMessage<PluginUIEvent>(async (message) => {
  if (message.type === 'insert-qr') {
    const { fileType, data, name } = message.content;

    if (!data || !name) return;

    const center = penpot.viewport.center;
    const undoBlockId = penpot.history.undoBlockBegin();

    if (fileType === 'svg') {
      const group = await penpot.createShapeFromSvgWithImages(data);
      if (group) {
        group.name = name;
        group.x = center.x;
        group.y = center.y;
      }
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
      shape.x = center.x;
      shape.y = center.y;
    }

    penpot.history.undoBlockFinish(undoBlockId);
  }
});

// Update the theme in the iframe
penpot.on('themechange', (theme) => {
  sendMessage({ type: 'themechange', content: theme });
});

const sendMessage = (message: PluginEvent) => {
  penpot.ui.sendMessage(message);
};
