import {
  Component,
  h
} from 'skatejs';
import styles from './styles';
import layout from './layouts';

class SKSpinner extends Component {
  static get props() {
    return {
      overlay: {
        attribute: true,
        default: false
      },
      type: {
        attribute: true,
        default: 'circle' //rect, bounce
      },
      //TODO: Implement
      size: {
        attribute: true,
        default: '30px'
      },
      color: {
        attribute: true,
        default: '#333'
      }
    };
  }

  renderCallback() {
    const mergedStyles = styles + `:host {--color: ${this.color};}`;
    const overlay = this.overlay ? 'overlay' : '';

    return [
      //TODO: pass proper .spinner width and height based on 'size' attribute
      h('style', mergedStyles),
      ...layout(this.type, overlay)
    ];
  }
}

customElements.define('sk-spinner', SKSpinner);

export default SKSpinner;