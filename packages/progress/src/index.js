import {
  Component,
  h
} from 'skatejs';
import styles from './styles';

class SKProgress extends Component {
  static get props() {
    return {
      //TODO: Implement
      type: {
        attribute: true,
        default: 'plain' //radial
      },
      min: {
        attribute: true,
        default: 0
      },
      max: {
        attribute: true,
        default: 100
      },
      value: {
        attribute: true,
        default: 0
      },
      color: {
        attribute: true,
        default: '#f80'
      },
      animated: {
        attribute: true,
        default: false
      }
    };
  }

  renderCallback() {
    const translation = 100;

    return [
      h('style', styles),
      h('div', {
        class: 'wrapper'
      }, h('div', {
        class: 'progress',
        style: {
          transform: `translateX(${translation}px)`
        }
      }))
    ];
  }
}

customElements.define('sk-progress', SKProgress);

export default SKProgress;