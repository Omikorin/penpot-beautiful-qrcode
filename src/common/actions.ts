import Alpine from 'alpinejs';
import type { QRStore } from './store';
import type { InsertEvent, PluginUIEvent } from './types';

export const sendMessage = (message: PluginUIEvent) => {
  parent.postMessage(message, '*');
};

export const insertQR = async () => {
  const store = Alpine.store('qr') as QRStore;
  if (!store.qr) return;

  try {
    const { fileType } = store.state;
    let data: string | ArrayBuffer;

    if (fileType === 'svg') {
      data = store.qr._svg?.outerHTML || '';
    } else {
      const blob = (await store.qr.getRawData(fileType)) as Blob;
      data = await blob.arrayBuffer();
    }

    sendMessage({
      type: 'insert-qr',
      content: {
        fileType,
        data,
        name: 'New QR Code',
      },
    } as InsertEvent);
  } catch (error) {
    console.error('Error inserting QR code:', error);
  }
};

export const downloadQR = () => {
  const store = Alpine.store('qr') as QRStore;
  if (!store.qr) return;

  try {
    const timestamp = new Date()
      .toISOString()
      .replace(/[:]/g, '-')
      .slice(0, -5);

    store.qr.download({
      name: `QR-Code-${timestamp}`,
      extension: store.state.fileType,
    });
  } catch (error) {
    console.error('Error downloading QR code:', error);
  }
};
