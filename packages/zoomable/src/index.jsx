import {
  Component,
  h
} from 'skatejs';
import styles from './styles';
import {define} from 'skateparkjs-core';

class SKzoomable extends Component {
  static get props() {
    return {
      src: {
        attribute: true
      }      
    };
  }

  renderCallback() {

    return <figure class='zoom' style={{background: this.src}} onmousemove={this.zoom}>      
      <img src={this.src} />
    </figure>
  }

  zoom(e) {
    const zoomer = event.currentTarget;
    const x = event.offsetX / zoomer.offsetWidth * 100;
    const y = event.offsetY / zoomer.offsetHeight * 100;

    zoomer.style.backgroundPosition = x + '% ' + y + '%';
  }
}

define('sk-zoomable', SKzoomable);

export default SKzoomable;
