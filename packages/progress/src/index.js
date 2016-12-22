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
      },
      width: {
        attribute: true,
        default: 'inherit',
        deserialize(value) {
          return `${value}px`;
        }
      },
      height: {
        attribute: true,
        default: '30px',
        deserialize(value) {
          return `${value}px`;
        }
      },
      showPercentage: {
        attribute: true,
        default: false
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();

    this.style.width = this.width;
    this.style.height = this.height;
    this.widthValue = this.getElementSize('width');
    this.heightValue = this.getElementSize('height');
  }

  renderCallback() {    
    const width = this.widthValue;
    const height = this.heightValue;
    const progress = Math.min(width, (this.value * width) / 100);
    const progressValue = this.showPercentage ? h('span', {class: 'percentage'}, `${Math.min(100, this.value)}%`) : null;
    const mergedStyles = styles + `:host {--color: ${this.color};}`;
    const animated = this.animated ? 'animated' : '';

    return [
      h('style', mergedStyles),
      h('div', {
        class: `wrapper ${animated}`
      }, h('div', {
        class: 'progress',
        style: {
          transform: `translateX(${progress}px)`
        }
      }), progressValue)
    ];
  }

  getElementSize(property) {
    return isNaN(parseInt(this[property])) ? 
      this.parentElement.getClientRects()[0][property] : 
      parseInt(this[property]);
  }

  increment(increment) {
    this.value = parseInt(this.value) + increment;
  }
}

customElements.define('sk-progress', SKProgress);

export default SKProgress;