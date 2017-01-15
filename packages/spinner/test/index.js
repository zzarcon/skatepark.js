const test = require('tape');

test('Spinner # default options', (t) => {
  t.plan(1);

  t.equal(1, 1);
});

test.onFinish(() => {
  console.log('close window')
  window.close();
});