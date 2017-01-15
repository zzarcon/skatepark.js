import 'skatejs-web-components';
import { h, mount } from 'bore';
import Spinner from '../src/index.jsx';
import test from 'tape';
// import tapeDOM from 'tape-dom';

// tapeDOM(test);

test('Spinner # default options', (t) => {
  t.plan(1);

  mount(<Spinner />).wait(w => {
    t.equal(w.node.tagName, 'SK-SPINNER');
  });
});

test.onFinish(() => {
  console.log('close window')
  // window.close();
});