// @ts-nocheck
import type { ElementType } from '../common/store';
import type { FillType } from '../common/types';

export const colorControls = () => ({
  type: '' as ElementType,

  init() {
    this.type = this.$el.dataset.type as ElementType;
  },

  get element() {
    return this.$store.qr.state.elements[this.type];
  },

  get showSecondaryColor() {
    return this.element.fill !== 'single';
  },

  get showRotation() {
    return this.element.fill === 'linear';
  },

  updateFill(event: Event) {
    const fill = (event.target as HTMLSelectElement).value as FillType;
    this.$store.qr.updateElementFill(this.type, fill);
    this.$dispatch('qr:update');
  },

  updateColor(event: Event, isSecondary = false) {
    const color = (event.target as HTMLInputElement).value;
    this.$store.qr.updateElement(this.type, {
      [isSecondary ? 'colorSecondary' : 'color']: color,
    });
    this.$dispatch('qr:update');
  },

  updateRotation(event: Event) {
    const rotation = Number.parseInt((event.target as HTMLInputElement).value);
    if (Number.isNaN(rotation)) return;

    this.$store.qr.updateElement(this.type, { rotation });
    this.$dispatch('qr:update');
  },
});
