import {
  Component,
  h
} from 'skatejs';
import styles from './styles';
import {define} from 'skateparkjs-core';

const deleteCode = 8;

class SKTags extends Component {
  static get props() {
    return {
      delimiter: {
        attribute: true,
        default: ' '
      },
      tags: {
        attribute: true,
        default: [],
        deserialize (value) {
          console.log('deserialize', value)
          return value.split(',');
        }
      },
      deletion: {
        attribute: true,
        default: false
      },
      //TODO: Implement editable tags
      editable: {
        attribute: true,
        default: true
      }
    };
  }

  renderCallback() {
    const tags = this.tags;
    const allowDeletion = this.deletion ? 'deletion' : '';
    const tagElements = tags.map(t => {
      const tagContent = allowDeletion ? [t, h('span', {class: 'deletion'})] : [t];

      return h('span', {
        class: `tag`,
        onclick: this.onTagClick(this)
      }, ...tagContent);
    });

    return [
      h('style', styles),
      h('div', {
          class: 'wrapper',
          onclick: this.onWrapperClick(this)
        },
        h('span', {
          class: `tags`
        }, ...tagElements),
        h('input', {
          oninput: this.onInput(this),
          onkeydown: this.onKeydown(this),
          autofocus: true,
          class: 'input'
        })
      )
    ];
  }

  onTagClick(component) {
    return function(e) {
      if (e.target.classList.contains('deletion')) {
        const childs = Array.from(this.parentElement.children);
        const index = childs.indexOf(this);

        component.removeTag(index);
        component.focusInput();
      }
    };
  }

  onWrapperClick(component) {
    return function(e) {
      if (e.target !== this) return;

      component.focusInput();
    };
  }

  focusInput() {
    this.shadowRoot.querySelector('.input').focus();
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
      const value = this.value.slice(0, -1).trim();
      const isDelimiter = lastChar === component.delimiter;

      if (value && isDelimiter) {
        component.addTag(value);
        this.value = '';
      }

      component.adjustInputSize(this.value.length);
    };
  }

  adjustInputSize(textLength) {
    const input = this.shadowRoot.querySelector('.input');
    const width = (textLength * 9) + 5;

    input.style.width = `${width}px`;
  }

  addTag(value) {
    this.tags = this.tags.concat(value);
  }

  removeTag(index = -1) {
    const tags = this.tags.slice();

    tags.splice(index, 1);
    this.tags = tags;
  }
}

define('sk-tags', SKTags);

export default SKTags;