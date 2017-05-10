import Component, { tracked } from '@glimmer/component';

export default class PongPaddle extends Component {
  @tracked position;

  didInsertElement() {
    let self = this;

    this.args.register({
      get bbox() {
        return self.bbox;
      }
    });
  }

  get bbox() {
    if (this.element) {
      return this.element.getBoundingClientRect();
    }
  }
};
