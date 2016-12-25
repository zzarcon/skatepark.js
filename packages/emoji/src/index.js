import {
  Component,
  h
} from 'skatejs';
import stylesDefinition from './styles';
import icons from './icons';
import emojiData from './emoji_data';
import {define, styles} from 'skateparkjs-core';
import 'skateparkjs-growy';
import 'skateparkjs-spinner';

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
      },
      isSearching: {
        default: false
      },
      searchResults: {
        default: []
      },
      showSpinner: {
        default: false
      }
    };
  }

  createCategory(emojis, categoryName) {
    const content = emojis.map(e => {
      return h('i', e);
    });

    return h('li', {
      class: 'emoji-category-content',
      'data-category': categoryName
    }, h('div', {
      class: 'emoji-category-header'
    }, categoryName), h('div', {
      class: 'emojis'
    }, ...content));
  }

  renderCallback() {
    const visible = this.visible ? 'visible' : '';
    const contentVisible = this.isSearching ? '' : 'visible';
    const isSearching = this.isSearching ? 'visible' : '';
    const categories = Object.keys(this.emojis);
    const emojiContent = categories.map(category => {
      return this.createCategory(this.emojis[category], category);
    });
    const categoriesContent = categories.map(c => {
      const active = this.activeCategory === c ? 'active' : '';

      return h('div', {
        style: `background-image: url(${icons[c]})`,
        class: `cat ${active}`,
        onclick: this.goToCategory(c)
      });
    });
    const searchResults = this.createCategory(this.searchResults, 'Search results');
    const spinnerClass = this.showSpinner ? 'visible' : '';

    return [
      h('style', stylesDefinition),
      h('sk-growy', {
        class: 'text',
        'reset-on-enter': 'false',
        'min-height': 60,
        styles: styles({
          textarea: {
            height: '30px',
            'font-size': '16px',
            'padding': '10px'  
          }
        })
      }),
      h('img', {
        class: 'toggle',
        src: icons.people,
        onclick: this.toggle.bind(this)
      }),
      h('div', {
          class: `emojis-wrapper ${visible}`
        }, h('div', {
          class: 'header'
        }, h('input', {
          type: 'search',
          oninput: this.onSearch(this),
          class: 'emoji-search'
        }), h('sk-spinner', {
          class: spinnerClass,
          type: 'rect',
          color: '#aaa',
          style: 'width: 30px; height: 30px;'
        })),
        h('div', {
          class: `emojis-content`,
          onclick: this.onEmojiClick(this)
        }, h('ul', {
          class: `emoji-data ${contentVisible}`
        }, ...emojiContent), h('div', {
          class: `emoji-search-results ${isSearching}`
        }, searchResults)), h('div', {
          class: `categories ${contentVisible}`
        }, categoriesContent))
    ];
  }

  renderedCallback() {
    if (this.intersectionObserver) return;

    this.intersectionObserver = new IntersectionObserver((entries, observer) => {
      const intersection = entries[0];
      const target = intersection.target;
      const category = target.getAttribute('data-category');
      const categories = Object.keys(this.emojis);
      const activeIndex = categories.indexOf(this.activeCategory);
      const currentIndex = categories.indexOf(category);

      if (this.activeCategory === category) {
        if (intersection.intersectionRatio === 0) {          
          this.activeCategory = categories[currentIndex + 1];
        }
      } else if (activeIndex - currentIndex === 1) {
        this.activeCategory = categories[activeIndex - 1];
      }
    }, {
      threshold: [0, 0.1]
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
  onSearch(component) {
    return function() {
      const value = this.value.trim();
      clearTimeout(component.searchingDelay);

      if (!value) {
        component.isSearching = false;
        component.showSpinner = false;
        return;
      }

      component.isSearching = true;
      component.showSpinner = true;
      component.searchResults = [];

      component.searchingDelay = setTimeout(() => {
        fetch(`https://emoji.getdango.com/api/emoji?q=${value}`).then(r => r.json()).then(response => {
          component.showSpinner = false;
          component.searchResults = response.results.map(e => e.text);
        });
      }, 300);
    }
  }

  toggle() {
    this.visible = !this.visible;
    setTimeout(() => this.shadowRoot.querySelector('.emoji-search').focus(), 10);
  }
}

define('sk-emoji', SKEmoji);

export default SKEmoji;