import Component, { tracked } from '@glimmer/component';
import { Vector, BallApi, PaddleApi } from '../../../../utils/types';

type Direction = 'up' | 'down' | '';

export default class PongField extends Component {
  @tracked playerPosition: Vector = { x: 390, y: 192 };
  @tracked opponentPosition: Vector = { x: 5, y: 192 };

  playerMovement: Direction;
  opponentMovement: Direction;
  ball: BallApi;
  leftPaddle: PaddleApi;
  rightPaddle: PaddleApi;

  didInsertElement() {
    let [body] = document.getElementsByTagName('body');

    body.addEventListener('keydown', (e) => this.keyDown(e));
    body.addEventListener('keyup', (e) => this.keyUp(e));

    this.ball.setup({
      x: 200,
      y: 200
    });
    this.update();
  }

  registerTypeApi(type: string, api: object) {
    this[type] = api;
  }

  update(timestamp?) {
    this.moveUser('player');
    this.moveUser('opponent');

    let touchingSide = this.ballTouchingWall();

    if (touchingSide === 'left' || touchingSide === 'right') {
      this.ball.reset();
    } else if (touchingSide === 'top' || touchingSide === 'bottom') {
      this.ball.changeVelocity({
        y: -1
      });
      this.ball.move();
    } else if (intersectRect(this.ball.bbox, this.leftPaddle.bbox) || intersectRect(this.ball.bbox, this.rightPaddle.bbox)) {
      this.ball.changeVelocity({
        x: -1
      });
      this.ball.move();
    } else {
      this.ball.move();
    }

    window.requestAnimationFrame((timestamp) => this.update(timestamp));
  }

  moveUser(type: 'player' | 'opponent') {
    let movement = this[`${type}Movement`];
    let position = this[`${type}Position`];

    switch(movement) {
      case 'up': {
        if (position.y > 5) {
          this[`${type}Position`] = {
            x: position.x,
            y: position.y - 4
          };
        }
        break;
      }

      case 'down': {
        if (position.y < 370) {
          this[`${type}Position`] = {
            x: position.x,
            y: position.y + 4
          };
        }
        break;
      }
    }
  }

  ballTouchingWall() {
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
        this.playerMovement = '';
        return;
      }

      // up
      // down
      case 87:
      case 83: {
        this.opponentMovement = '';
        return;
      }
    }
  }

  keyDown(e) {
    switch(e.keyCode) {
      // up
      case 38: {
        this.playerMovement = 'up';
        return;
      }

      // down
      case 40: {
        this.playerMovement = 'down';
        return;
      }

      // up
      case 87: {
        this.opponentMovement = 'up';
        return;
      }

      // down
      case 83: {
        this.opponentMovement = 'down';
        return;
      }
    }
  }
};


function intersectRect(r1, r2) {
  //CHECK IF THE TWO BOUNDING BOXES OVERLAP
  return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}
