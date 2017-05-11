import Component, { tracked } from '@glimmer/component';
import { Vector, Direction } from '../../../../../utils/types';

export default class PongPaddle extends Component {
  @tracked position: Vector;

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

  move(direction: Direction) {
    let { x, y } = this.position;

    switch(direction) {
      case 'up': {
        if (y > 5) {
          this.position = {
            x,
            y: y - 4
          };
        }
        return;
      }

      case 'down': {
        if (y < 370) {
          this.position = {
            x,
            y: y + 4
          };
        }
        return;
      }
    }
  }
};
