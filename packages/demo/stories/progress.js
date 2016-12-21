import React from 'react';
import {
  storiesOf
} from '@kadira/storybook';
import SKProgress from 'skateparkjs-progress';
import options from './defaultStoryOptions';

storiesOf('Progress', module)
  .addWithInfo('Fooo', () => (
    <div style={{width: '300px', height: '150px', border: '3px solid'}}>
      <sk-progress></sk-progress>
    </div>
  ), options)