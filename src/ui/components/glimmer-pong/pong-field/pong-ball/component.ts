import Component from '@glimmer/component';

export default class PongBall extends Component {
  didInsertElement() {
    this.args.register({
      test: 'test'
    });
  }
};
