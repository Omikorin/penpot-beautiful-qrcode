export interface PluginEvent {
  type: 'add-qr';
  content: {
    data: string;
    name: string;
  };
}
