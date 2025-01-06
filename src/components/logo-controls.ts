// @ts-nocheck
export const logoControls = () => ({
  get hasLogo() {
    return Boolean(this.$store.qr.state.logo.file);
  },

  get filename() {
    const file = this.$store.qr.state.logo.file;
    if (!file) return '';

    return file.name.length > 30 ? `${file.name.slice(0, 29)}...` : file.name;
  },

  async handleFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      console.error('Please select an image file');
      return;
    }

    try {
      const dataUrl = await this.readFileAsDataURL(file);
      this.$store.qr.state.logo.file = file;
      this.$store.qr.updateLogo(dataUrl);
    } catch (error) {
      console.error('Error processing logo:', error);
    }
  },

  removeLogo() {
    this.$store.qr.updateLogo();
    this.$store.qr.state.logo.file = null;
    // Reset file input
    const fileInput = this.$refs.fileInput as HTMLInputElement;
    fileInput.value = '';
  },

  updateMargin(event: Event) {
    const margin = Number.parseInt((event.target as HTMLInputElement).value);
    if (Number.isNaN(margin)) return;

    this.$store.qr.state.logo.margin = margin;
    this.$dispatch('qr:update');
  },

  readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
});
