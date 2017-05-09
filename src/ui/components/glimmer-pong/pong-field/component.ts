import Component, { tracked } from '@glimmer/component';

type Direction = 'up' | 'down' | '';
interface Position {
  x: number;
  y: number;
}

export default class PongField extends Component {
  @tracked ballPosition: Position = { x: 200, y: 200 };
  @tracked playerPosition: Position = { x: 400, y: 200 };
  @tracked opponentPosition: Position = { x: 20, y: 200 };

  ballAngle: number;
  ballVector: Position;
  playerMovement: Direction;
  opponentMovement: Direction;

  didInsertElement() {
    let [body] = document.getElementsByTagName('body');
    let ballAngle = this.calculateBallAngle();
    let ballVector = this.calculateBallVector(ballAngle);

    body.addEventListener('keydown', (e) => this.keyDown(e));
    body.addEventListener('keyup', (e) => this.keyUp(e));

    this.ballVector = ballVector;
    this.ballAngle = ballAngle;
    this.update();
  }

  update(timestamp?) {
    this.moveUser('player');
    this.moveUser('opponent');

    if (!this.ballWithinField()) {
      this.resetBall();
    } else {
      this.moveBall(timestamp);
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
            y: position.y - 2
          };
        }
        break;
      }

      case 'down': {
        if (position.y < 380) {
          this[`${type}Position`] = {
            x: position.x,
            y: position.y + 2
          };
        }
        break;
      }
    }
  }

  ballWithinField() {
    let { x, y } = this.ballPosition;
    
    return x > -5 && x < 455 && y > -5 && y < 405;
  }

  calculateBallAngle() {
    let angle = Math.random() * Math.PI * 2;
    return angle;
  }

  calculateBallVector(angle: number) {
    return {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5
    };
  }

  resetBall() {
    this.ballPosition = {
      x: 200,
      y: 200
    };
    this.ballAngle = this.calculateBallAngle();
  }

  moveBall(timestamp) {
    this.ballPosition = {
      x: this.ballPosition.x + (2 * Math.cos(this.ballAngle)),
      y: this.ballPosition.y + (2 * Math.sin(this.ballAngle)),
    };
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
