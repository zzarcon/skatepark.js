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
      h('div', {class: 'wrapper'}, 
        h('span', ...tagElements),
        h('input', {
          onkeyup: this.onKey(),
          autofocus: true,
          class: 'input'
        })
      )
    ];
  }

  onKey() {
    const component = this;

    return function(e) {
      const lastChar = this.value.substr(-1);
      const value = this.value.trim();
      const code = e.keyCode;
      const isDel = code === deleteCode;
      const isDelimiter = lastChar === component.delimiter;

      if (isDel && value.length <= 0) {
        component.removeTag();
      }

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