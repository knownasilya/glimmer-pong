import Component, { tracked } from "@glimmer/component";

export default class GlimmerPong extends Component {
  @tracked paused: boolean = true;

  play() {
    this.paused = false;
  }
}
