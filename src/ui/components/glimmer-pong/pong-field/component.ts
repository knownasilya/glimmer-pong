import Component, { tracked } from '@glimmer/component';
import { Vector, Side, Direction, BallApi, PaddleApi } from '../../../../utils/types';

export default class PongField extends Component {
  ball: BallApi;
  leftPaddle: PaddleApi;
  rightPaddle: PaddleApi;
  @tracked rightScore: number = 0;
  @tracked leftScore: number = 0;

  didInsertElement() {
    let [body] = document.getElementsByTagName('body');

    body.addEventListener('keydown', (e) => this.keyDown(e));
    body.addEventListener('keyup', (e) => this.keyUp(e));

    this.update();
  }

  registerTypeApi(type: string, api: PaddleApi | BallApi) {
    this[type] = api;

    switch(type) {
      case 'ball': {
        return api.setup({
          x: 200,
          y: 200
        });
      }

      case 'leftPaddle': {
        return api.setup({
          x: 5,
          y: 192
        });
      }

      case 'rightPaddle': {
        return api.setup({
          x: 390,
          y: 192
        });
      }
    }
  }

  update(timestamp?) {
    this.leftPaddle.attemptMovement();
    this.rightPaddle.attemptMovement();

    let touchingSide = this.ballTouchingWall();
    let skipBallMove = false;

    switch(touchingSide) {
      case 'left': {
        this.ball.reset();
        this.rightScore += 1;
        skipBallMove = true;
        break;
      }

      case 'right': {
        this.ball.reset();
        this.leftScore += 1;
        skipBallMove = true;
        break;
      }

      case 'top':
      case 'bottom': {
        this.ball.changeVelocity({
          y: -1
        });
        break;
      }
    }

    let hitLeftPaddle = this.ball.hitPaddle(this.leftPaddle);
    let hitRightPaddle = this.ball.hitPaddle(this.rightPaddle);

    if (hitLeftPaddle || hitRightPaddle) {
      this.ball.changeVelocity({
        x: -1
      });
    }

    if (!skipBallMove) {
      this.ball.move();
    }

    window.requestAnimationFrame((timestamp) => this.update(timestamp));
  }

  // TODO: move to ball api
  ballTouchingWall() : Side {
    let { x, y } = this.ball.position;
    
    if (x < -6) {
      return 'left';
    } else if (x > 406) {
      return 'right';
    } else if (y < 0) {
      return 'top';
    } else if (y > 400) {
      return 'bottom';
    } else {
      return '';
    }
  }

  keyUp(e) {
    switch(e.keyCode) {
      // up
      // down
      case 38:
      case 40: {
        this.rightPaddle.movement = '';
        return;
      }

      // up
      // down
      case 87:
      case 83: {
        this.leftPaddle.movement = '';
        return;
      }
    }
  }

  keyDown(e) {
    switch(e.keyCode) {
      // up
      case 38: {
        this.rightPaddle.movement = 'up';
        return;
      }

      // down
      case 40: {
        this.rightPaddle.movement = 'down';
        return;
      }

      // up
      case 87: {
        this.leftPaddle.movement = 'up';
        return;
      }

      // down
      case 83: {
        this.leftPaddle.movement = 'down';
        return;
      }
    }
  }
};
