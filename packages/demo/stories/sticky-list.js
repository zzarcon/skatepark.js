import React from 'react';
import {
  storiesOf
} from '@kadira/storybook';
import 'skateparkjs-sticky-list';
import options from './defaultStoryOptions';

storiesOf('Sticky List', module)
  .addWithInfo('Default options', () => (
    <sk-sticky-list></sk-sticky-list>
  ), options)
