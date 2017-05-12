import Component, { tracked } from "@glimmer/component";

export default class GlimmerPong extends Component {
  @tracked playing: boolean;

  play() {
    this.playing = true;
  }
}
