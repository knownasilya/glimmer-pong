import Component, { tracked } from '@glimmer/component';
import { Vector, Side, Direction, BallApi, PaddleApi } from '../../../../utils/types';

export default class PongField extends Component {
  ball: BallApi;
  leftPaddle: PaddleApi;
  rightPaddle: PaddleApi;

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

    if (touchingSide === 'left' || touchingSide === 'right') {
      this.ball.reset();
      skipBallMove = true;
    } else if (touchingSide === 'top' || touchingSide === 'bottom') {
      this.ball.changeVelocity({
        y: -1
      });
    } else if (this.ball.hitPaddle(this.leftPaddle) || this.ball.hitPaddle(this.rightPaddle)) {
      this.ball.changeVelocity({
        x: -1
      });
    }

    if (!skipBallMove) {
      this.ball.move();
    }

    window.requestAnimationFrame((timestamp) => this.update(timestamp));
  }

  moveUser(paddle: PaddleApi) {
    let movement = paddle.movement;
    let position = paddle.position;

    switch(movement) {
      case 'up': {
        paddle.move(movement);
        break;
      }

      case 'down': {
        if (position.y < 370) {
          paddle.position = {
            x: position.x,
            y: position.y + 4
          };
        }
        break;
      }
    }
  }

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
