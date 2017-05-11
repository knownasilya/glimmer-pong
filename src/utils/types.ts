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
  bbox: ClientRect;
  position: Vector;
}

export interface PaddleApi {
  setup: Function;
  bbox: ClientRect;
  position: Vector;
  moveUp: Function;
  moveDown: Function;
}