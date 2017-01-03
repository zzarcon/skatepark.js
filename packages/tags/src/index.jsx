import {
  Component,
  h,
  prop
} from 'skatejs';
import styles from './styles';
import {define} from 'skateparkjs-core';

const deleteCode = 8;

class SKTags extends Component {
  static props = {
    delimiter: prop.string({attribute: true, default: ' '}),
    tags: prop.array({attribute: true}),
    deletion: {
      attribute: true,
      default: false
    },
    //TODO: Implement editable tags
    editable: {
      attribute: true,
      default: true
    }
  }

  renderCallback() {
    const tags = this.tags;
    const allowDeletion = this.deletion ? 'deletion' : '';
    const tagElements = tags.map(t => {
      const tagContent = allowDeletion ? <span class='deletion'>{t}</span> : t;

      return <span class="tag" onclick={this.onTagClick} >{tagContent}</span>;
    });

    return <div>
      <style>{styles}</style>
      <div class='wrapper' onclick={this.onWrapperClick}>
        <span class='tags'>{tagElements}</span>
        <input type="text" oninput={this.onInput} onkeydown={this.onKeydown} autofocus="true" class= 'input'/>
      </div>
    </div>
  }

  onTagClick = e => {
    if (e.target.classList.contains('deletion')) {
      const childs = Array.from(e.currentTarget.parentElement.children);
      const index = childs.indexOf(e.currentTarget);

      this.removeTag(index);
      this.focusInput();
    }
  }

  onWrapperClick = e => {
    this.focusInput();
  }

  focusInput() {
    this.shadowRoot.querySelector('.input').focus();
  }

  onKeydown = e => {
    const value = e.target.value;
    const isDel = e.keyCode === deleteCode;

    if (isDel && value.length <= 0) {
      this.removeTag();
    }
  }

  onInput = e => {
    const lastChar = e.target.value.substr(-1);
    const value = e.target.value.slice(0, -1).trim();
    const isDelimiter = lastChar === this.delimiter;

    if (value && isDelimiter) {
      this.addTag(value);
      e.target.value = '';
    }

    this.adjustInputSize(e.target.value.length);
  }

  adjustInputSize(textLength) {
    const input = this.shadowRoot.querySelector('.input');
    const width = (textLength * 10) + 6;

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