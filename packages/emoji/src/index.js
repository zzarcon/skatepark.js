import {
  Component,
  h
} from 'skatejs';
import styles from './styles';
import toggleIcon from './toggle_icon';
import categoryIcons from './category_icons';
import emojiData from './emoji_data';

class SKEmoji extends Component {
  static get props() {
    return {
      visible: {
        attribute: true,
        default: false
      },
      emojis: {
        default: emojiData
      },
      activeCategory: {
        default: 'people'
      }
    };
  }

  renderCallback() {
    const visible = this.visible ? 'visible' : '';
    const categories = Object.keys(this.emojis);
    const emojiContent = categories.map(category => {
      const content = this.emojis[category].map(e => {
        return h('i', e);
      });

      return h('li', {
        class: 'emoji-category-content',
        'data-category': category
      }, h('div', {
        class: 'emoji-category-header'
      }, category), h('div', {
        class: 'emojis'
      }, ...content));
    });
    const categoriesContent = categories.map(c => {
      return h('img', {
        class: this.activeCategory === c ? 'active' : '',
        src: categoryIcons[c],
        onclick: this.goToCategory(c)
      });
    });

    return [
      h('style', styles),
      h('input', {
        class: 'text'
      }),
      h('img', {
        class: 'toggle',
        src: toggleIcon,
        onclick: this.toggle.bind(this)
      }, ':)'),
      h('div', {
        class: `emojis-wrapper ${visible}`
      }, h('input', {
        type: 'search',
        oninput: this.onSearch,
        class: 'emoji-search'
      }), h('ul', {
        class: 'emojis-content',
        onclick: this.onEmojiClick(this)
      }, emojiContent), h('div', {
        class: 'categories'
      }, categoriesContent))
    ];
  }

  renderedCallback() {
    if (this.intersectionObserver) return;

    this.intersectionObserver = new IntersectionObserver((entries, observer) => {
      const intersection = entries[0];
      const target = intersection.target;
      const category = target.getAttribute('data-category');

      this.activeCategory = category;
    }, {
      threshold: [1]
    });

    Object.keys(this.emojis).forEach((category) => {
      this.intersectionObserver.observe(
        this.shadowRoot.querySelector(`[data-category="${category}"]`)
      );
    });
  }

  goToCategory(category) {
    return function() {
      const categoryContent = this.shadowRoot.querySelector(`.emoji-category-content[data-category="${category}"]`);

      categoryContent.scrollIntoView();

      setTimeout(() => this.activeCategory = category, 10);
    }.bind(this)
  }

  onEmojiClick(component) {
    return function(e) {
      const target = e.target;
      const isIcon = target.tagName === 'I';

      if (!isIcon) return;

      const emoji = target.textContent;
      const input = component.shadowRoot.querySelector('.text');

      input.value += emoji;
    }
  }
  onSearch() {

  }

  toggle() {
    this.visible = !this.visible;
    //TODO: Set focus on '.emoji-search'
  }
}

customElements.define('sk-emoji', SKEmoji);

export default SKEmoji;