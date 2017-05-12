import Component, { tracked } from '@glimmer/component';
import { Vector, Direction, Side } from '../../../../../utils/types';

export default class PongPaddle extends Component {
  @tracked position: Vector;
  element: HTMLElement;
  movement: Direction;

  args: {
    side: Side;
  }

  constructor() {
    super(...arguments);

    let self = this;

    this.args.register({
      setup({ x, y }) {
        self.position = { x, y };
      },
      attemptMovement: this.attemptMovement.bind(this),
      get side() {
        return self.args.side;
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

  attemptMovement() {
    let direction = this.movement;
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
