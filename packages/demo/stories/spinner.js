import React from 'react';
import {
  storiesOf
} from '@kadira/storybook';
import SKTags from 'skateparkjs-spinner';
import options from './defaultStoryOptions';

storiesOf('Spinner', module)
  .addWithInfo('Inherits parent size', () => (
    <div style={{width: '300px', height: '150px', border: '1px solid'}}>
      <sk-spinner></sk-spinner>
    </div>
  ), options)