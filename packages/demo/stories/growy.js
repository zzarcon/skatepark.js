import React from 'react';
import {
  storiesOf
} from '@kadira/storybook';
import SKGrowy from 'skateparkjs-growy';
import options from './defaultStoryOptions';

storiesOf('Growy', module)
  .addWithInfo('Using default options', () => (
    <sk-growy></sk-growy>
  ), options)
  .addWithInfo('Disable clear text when pressing Enter', () => (
    <sk-growy reset-on-enter="false"></sk-growy>
  ), options)