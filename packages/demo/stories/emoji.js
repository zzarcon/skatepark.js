import React from 'react';
import {
  storiesOf
} from '@kadira/storybook';
import SKEmoji from 'skateparkjs-emoji';
import options from './defaultStoryOptions';

storiesOf('Emoji', module)
  .addWithInfo('Using default options', () => (
    <sk-emoji></sk-emoji>
  ), options)