import Component, { tracked } from '@glimmer/component';
import { PaddleApi } from '../../../../../utils/types';

interface Vector {
  x: number;
  y: number;
}

export default class PongBall extends Component {
  element: HTMLElement;
  angle: number;
  timer: number = 5;
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
    if (this.timer !== 0) {
      this.timer -= 1;
      return;
    }

    let speed = this.velocity;

    this.position = {
      x: this.position.x + speed.x,
      y: this.position.y + speed.y
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
    this.timer = 5;
  }

  hitPaddle(paddle: PaddleApi) {
    return intersectRect(this.bbox, paddle.bbox);
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
    return {
      x: Math.cos(angle) * 2,
      y: Math.sin(angle) * 2
    };
  }
};

function intersectRect(r1, r2) {
  //CHECK IF THE TWO BOUNDING BOXES OVERLAP
  return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}
