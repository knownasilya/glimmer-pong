export interface Vector {
  x: number;
  y: number;
}

export interface BallApi {
  reset: Function;
  move: Function;
  changeVelocity: Function;
  bbox: ClientRect;
  position: Vector;
}

export interface PaddleApi {
  bbox: ClientRect
}