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

  registerTypeApi(type: string, api: object) {
    this[type] = api;
  }

  update(timestamp?) {
    this.moveUser('player');
    this.moveUser('opponent');

    let touchingSide = this.ballTouchingWall();

    if (touchingSide === 'left' || touchingSide === 'right') {
      this.resetBall();
    } else if (touchingSide === 'top' || touchingSide === 'bottom') {
      this.changeBallVelocity({
        y: -1
      });
      this.moveBall(timestamp);
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

  ballTouchingWall() {
    let { x, y } = this.ballPosition;
    
    if (x < -5) {
      return 'left';
    } else if (x > 455) {
      return 'right';
    } else if (y < -5) {
      return 'top';
    } else if (y > 405) {
      return 'bottom';
    } else {
      return '';
    }
  }

  calculateBallAngle() {
    let numSections = 8;
    let sections = [3, 4, 7, 8, 9];
    let sectionIndex = Math.floor(Math.random() * 4);
    let section = sections[sectionIndex];
    let angle = (Math.random() + section) * Math.PI * 2 / numSections;

    return angle;
  }

  calculateBallVector(angle: number) {
    return {
      x: Math.cos(angle) * 2,
      y: Math.sin(angle) * 2
    };
  }

  resetBall() {
    this.ballPosition = {
      x: 200,
      y: 200
    };
    this.ballAngle = this.calculateBallAngle();
    this.ballVector = this.calculateBallVector(this.ballAngle);
  }

  changeBallVelocity({x=1, y=1}) {
    this.ballVector = {
      x: this.ballVector.x * x,
      y: this.ballVector.y * y
    };
  }

  moveBall(timestamp) {
    let speed = this.ballVector;

    this.ballPosition = {
      x: this.ballPosition.x + speed.x,
      y: this.ballPosition.y + speed.y
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
