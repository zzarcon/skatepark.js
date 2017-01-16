import {
  Component,
  h,
  prop
} from 'skatejs';
import styles from './styles';
import {define} from 'skateparkjs-core';

class SKStickyList extends Component {
  static get props() {
    return {
      data: {
        attribute: true,
        default: '[]',
        coerce(val) {
          return JSON.parse(val);
        }
      },
      func: prop.create({
        coerce(val) {
          debugger
        }
      })
    };
  }

  renderCallback() {
    debugger
    const items = this.data.map(item => {
      const content = item.items.map(i => <li>{i}</li>);

      return <li class="item">
        <header>{item.name}</header>
        <ul className="item-content">{content}</ul>
      </li>
    });

    return <div>
      <style>{styles}</style>
      <ul class="">{items}</ul>
    </div>
  }

  renderedCallback() {
    // this.shadowRoot.querySelector('.items').addEventListener('scroll', this.onScroll);
  }

  onScroll() {
    console.log('scroll');
  }
}

define('sk-sticky-list', SKStickyList);

export default SKStickyList;
