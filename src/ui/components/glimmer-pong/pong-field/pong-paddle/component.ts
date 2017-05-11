import Component, { tracked } from '@glimmer/component';
import { Vector, Direction } from '../../../../../utils/types';

export default class PongPaddle extends Component {
  @tracked position: Vector;
  element: HTMLElement;
  movement: Direction;

  didInsertElement() {
    let self = this;

    this.args.register({
      setup({ x, y }) {
        self.position = { x, y };
      },
      get bbox() {
        return self.bbox;
      },
      get movement() {
        return self.movement;
      },
      set movement(value) {
        self.movement = value;
      },
      get position() {
        return self.position;
      },
      set position(value) {
        self.position = value;
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
