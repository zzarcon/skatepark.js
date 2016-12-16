import {
  Component,
  h
} from 'skatejs';
import styles from './styles';

const deleteCode = 8;

customElements.define('sk-tags', class extends Component {
  static get props() {
    return {
      delimiter: {
        attribute: true,
        default: ' '
      },
      tags: {
        default: []
      }
    };
  }

  renderCallback() {
    const tags = this.tags;
    const tagElements = tags.map(t => h('span', {class: 'tag'}, t));

    return [
      h('style', styles),
      h('div', {
        class: 'wrapper',
        onclick: this.focusInput(this)
      }, 
        h('span', {class: 'tags'}, ...tagElements),
        h('input', {
          oninput: this.onInput(this),
          onkeydown: this.onKeydown(this),
          autofocus: true,
          class: 'input'
        })
      )
    ];
  }

  focusInput(component) {
    return function(e) {
      if (e.target !== this) return;
      
      component.shadowRoot.querySelector('.input').focus();
    };
  }

  onKeydown(component) {
    return function(e) {
      const value = this.value;
      const isDel = e.keyCode === deleteCode;

      if (isDel && value.length <= 0) {
        component.removeTag();
      }
    }
  }

  onInput(component) {
    return function(e) {
      const lastChar = this.value.substr(-1);
      const value = this.value.trim();
      const isDelimiter = lastChar === component.delimiter;

      if (value && isDelimiter) {
        component.addTag(value);
        this.value = '';
      }
    };
  }

  addTag(value) {
    this.tags = this.tags.concat(value);
  }

  removeTag() {
    const tags = this.tags.slice();

    tags.pop();
    this.tags = tags;
  }
});