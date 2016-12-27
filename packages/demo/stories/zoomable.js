import React from 'react';
import {
  storiesOf
} from '@kadira/storybook';
import 'skateparkjs-zoomable';
import options from './defaultStoryOptions';

storiesOf('Zoomable', module)
  .addWithInfo('Default options', () => (
    <sk-zoomable src="https://www.google.at/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"></sk-zoomable>
  ), options)
