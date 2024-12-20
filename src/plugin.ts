penpot.ui.open('Beautiful QR Code', `?theme=${penpot.theme}`);

penpot.ui.onMessage((message) => {
  if (message === '') {
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
