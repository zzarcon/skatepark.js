import {
  Component,
  h
} from 'skatejs';
import styles from './styles';
import {define} from 'skateparkjs-core';

class SKStickyList extends Component {
  static get props() {
    return {
      
    };
  }

  renderCallback() {
    return <div>
    <style>{styles}</style>
    <ul class="">
      <li class="item">
        <header>ONE</header>
        <ul className="item-content">
          <li>A</li>
          <li>B</li>
          <li>C</li>
          <li>D</li>
          <li>E</li>
        </ul>
      </li>
      <li class="item">
        <header>TWO</header>
        <ul className="item-content">
          <li>A</li>
          <li>B</li>
          <li>C</li>
          <li>D</li>
          <li>E</li>
        </ul>
      </li>
      <li class="item">
        <header>THREE</header>
        <ul className="item-content">
          <li>A</li>
          <li>B</li>
          <li>C</li>
          <li>D</li>
          <li>E</li>
        </ul>
      </li>
    </ul>
    </div>
  }
}

define('sk-sticky-list', SKStickyList);

export default SKStickyList;
