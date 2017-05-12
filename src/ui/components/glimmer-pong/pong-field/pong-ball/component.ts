import Component, { tracked } from '@glimmer/component';
import { PaddleApi } from '../../../../../utils/types';

interface Vector {
  x: number;
  y: number;
}

const timerDefault = 30;

export default class PongBall extends Component {
  element: HTMLElement;
  angle: number;
  delayMovementTimer: number;
  velocity: Vector;
  defaultPosition: Vector;
  @tracked position: Vector = { x: 200, y: 200 };

  constructor() {
    super(...arguments);

    let self = this;

    this.args.register({
      get bbox() {
        return self.bbox;
      },
      get position() {
        return self.position;
      },
      hitPaddle: this.hitPaddle.bind(this),
      changeVelocity: this.changeVelocity.bind(this),
      reset: this.reset.bind(this),
      move: this.move.bind(this),
      setup: this.setup.bind(this)
    });
  }

  setup({ x, y }) {
    this.defaultPosition = {
      x, y
    };
    this.reset();
  }

  get bbox() {
    if (this.element) {
      return this.element.getBoundingClientRect();
    }
  }

  move() {
    if (this.delayMovementTimer !== 0) {
      this.delayMovementTimer -= 1;
      return;
    }

    let velocity = this.velocity;

    this.position = {
      x: this.position.x + velocity.x,
      y: this.position.y + velocity.y
    };
  }

  changeVelocity({ x = 1, y = 1 }) {
    this.velocity = {
      x: this.velocity.x * x,
      y: this.velocity.y * y
    };
  }

  reset() {
    this.position = {
      x: this.defaultPosition.x,
      y: this.defaultPosition.y
    };
    this.angle = this.calculateAngle();
    this.velocity = this.calculateVelocity(this.angle);
    this.delayMovementTimer = timerDefault;
  }

  hitPaddle(paddle: PaddleApi) {
    if (paddle.side === 'left') {
      return intersectLeftRect(this.bbox, paddle.bbox);
    } else {
      return intersectRightRect(this.bbox, paddle.bbox);
    }
  }

  calculateAngle() {
    let numSections = 8;
    let sections = [3, 4, 7, 8, 9];
    let sectionIndex = Math.floor(Math.random() * 4);
    let section = sections[sectionIndex];
    let angle = (Math.random() + section) * Math.PI * 2 / numSections;

    return angle;
  }

  calculateVelocity(angle: number) {
    let speed = 3;

    return {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    };
  }
};

function intersectLeftRect(r1, r2) {
  //CHECK IF THE TWO BOUNDING BOXES OVERLAP
  return !(r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}

function intersectRightRect(r1, r2) {
  //CHECK IF THE TWO BOUNDING BOXES OVERLAP
  return !(r2.left > r1.right || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}
