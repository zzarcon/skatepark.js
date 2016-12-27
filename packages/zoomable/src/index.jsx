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
      },
      zoomLevel: {
        attribute: true,
        default: 1.2
      }
    };
  }

  renderCallback() {
    const level = Math.round(this.zoomLevel * 100);
    const mergedStyles = styles + `:host{--zoom-level: ${level}%;}`;

    return <div>
      <style>{mergedStyles}</style>
      <figure class='zoom' style={{'background-image': `url(${this.src})`}} onmousemove={this.zoom}>      
        <img src={this.src} />
      </figure>
    </div>
  }

  zoom(e) {
    const zoomer = e.currentTarget;
    const x = e.offsetX / zoomer.offsetWidth * 100;
    const y = e.offsetY / zoomer.offsetHeight * 100;

    zoomer.style.backgroundPosition = `${x}% ${y}%`;
  }
}

define('sk-zoomable', SKzoomable);

export default SKzoomable;
