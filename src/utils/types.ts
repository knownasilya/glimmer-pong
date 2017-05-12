export type Direction = 'up' | 'down' | '';

export interface Vector {
  x: number;
  y: number;
}

export interface BallApi {
  setup: Function;
  reset: Function;
  move: Function;
  changeVelocity: Function;
  hitPaddle: Function;
  bbox: ClientRect;
  position: Vector;
}

export interface PaddleApi {
  setup: Function;
  bbox: ClientRect;
  movement: Direction;
  position: Vector;
  moveUp: Function;
  moveDown: Function;
}