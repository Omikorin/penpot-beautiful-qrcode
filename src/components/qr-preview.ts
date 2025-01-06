// @ts-nocheck
import { debounce } from '../common/utils';

export const qrPreview = () => ({
  init() {
    this.$store.qr.initializeQR(this.$refs.container);

    // Listen for updates from store
    this.$watch(
      '$store.qr.state',
      debounce(() => this.$store.qr.updateQR(), 150),
    );
  },
});
