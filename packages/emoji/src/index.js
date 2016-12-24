import {
  Component,
  h
} from 'skatejs';
import styles from './styles';
import icons from './icons';
import emojiData from './emoji_data';
import SKGrowy from 'skateparkjs-growy';

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
      const active = this.activeCategory === c ? 'active' : '';

      return h('div', {
        style: `background-image: url(${icons[c]})`,
        class: `cat ${active}`,
        onclick: this.goToCategory(c)
      });
    });

    return [
      h('style', styles),
      h('sk-growy', {
        class: 'text',
        'reset-on-enter': 'false',
        'min-height': 60,
        'textarea-style': JSON.stringify({height: '30px', 'font-size': '16px', 'padding': '10px'})
      }),
      h('img', {
        class: 'toggle',
        src: icons.people,
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
      const growy = component.shadowRoot.querySelector('.text');

      growy.addText(emoji);
    }
  }
  onSearch() {

  }

  toggle() {
    this.visible = !this.visible;
    setTimeout(() => this.shadowRoot.querySelector('.emoji-search').focus(), 10);
  }
}

customElements.define('sk-emoji', SKEmoji);

export default SKEmoji;