import React from 'react';
import {
  storiesOf
} from '@kadira/storybook';
import 'skateparkjs-pkg_name';
import options from './defaultStoryOptions';

storiesOf('pkg_name', module)
  .addWithInfo('Default options', () => (
    <sk-pkn_name></sk-pkn_name>
  ), options)