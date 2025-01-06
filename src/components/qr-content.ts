// @ts-nocheck

export const qrContent = () => ({
  content: '',

  init() {
    this.content = this.$store.qr.state.data;
  },

  updateContent(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (!value) return;
    this.$store.qr.state.data = value;
    this.$dispatch('qr:update');
  },
});
