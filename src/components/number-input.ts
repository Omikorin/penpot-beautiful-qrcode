// @ts-nocheck
import { clamp } from '../common/utils';

export const numberInput = () => ({
  value: 0,
  sliderValue: '0',
  min: 0,
  max: 100,
  step: 1,

  init() {
    this.min = Number(this.$el.dataset.min ?? 0);
    this.max = Number(this.$el.dataset.max ?? 100);
    this.step = Number(this.$el.dataset.step ?? 1);
    this.value = Number(this.$el.dataset.value ?? this.min);
    this.sliderValue = this.value.toString();
  },

  updateFromInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let newValue = input.value === '' ? this.min : Number(input.value);

    newValue = clamp(newValue, this.min, this.max);

    this.value = newValue;
    this.sliderValue = newValue.toString();

    this.$dispatch('number:update', { value: newValue });
  },

  updateFromSlider(event: Event) {
    const value = Number((event.target as HTMLInputElement).value);
    this.value = value;
    this.$dispatch('number:update', { value });
  },

  // Called on input blur to ensure valid number
  validateInput() {
    if (Number.isNaN(this.value)) this.value = this.min;

    this.value = clamp(this.value, this.min, this.max);
    this.sliderValue = this.value.toString();
    this.$dispatch('number:update', { value: this.value });
  },
});
