import {
  Component,
  h
} from 'skatejs';
import styles from './styles';

class SKSpinner extends Component {
  static get props() {
    return {
      //TODO: Implement
      overlay: {
        attribute: true,
        default: false
      },
      //TODO: Render proper html based on style
      style: {
        attribute: true,
        default: 'circle' //rect, bounce
      },
      //TODO: Implement
      size: {
        attribute: true,
        default: '30px'
      },
      //TODO: Implement
      color: {
        attribute: true
      }
    };
  }

  renderCallback() {
    return [
      //TODO: pass proper .spinner width and height based on 'size' attribute
      h('style', styles),
      h('div', {
          class: 'spinner'
        },
        h('div', {
          class: `bounce1`
        }),
        h('div', {
          class: 'bounce2'
        })
      )
    ];
  }
}

customElements.define('sk-spinner', SKSpinner);

export default SKSpinner;