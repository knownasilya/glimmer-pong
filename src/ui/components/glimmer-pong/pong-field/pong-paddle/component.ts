import Component, { tracked } from '@glimmer/component';

export default class PongPaddle extends Component {
  @tracked position;
};
