import type { PluginEvent } from './types';

penpot.ui.open('Beautiful QR Code', `?theme=${penpot.theme}`);

penpot.ui.onMessage<PluginEvent>(async (message) => {
  if (message.type === 'add-qr') {
    const { data, name } = message.content;

    if (!data || !name) return;

    const group = penpot.createShapeFromSvg(data);
    if (group) group.name = name;
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
