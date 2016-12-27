import React from 'react';
import {
  storiesOf
} from '@kadira/storybook';
import 'skateparkjs-zoomable';
import options from './defaultStoryOptions';

storiesOf('Zoomable', module)
  .addWithInfo('Default options', () => (
    <sk-zoomable src="https://raw.githubusercontent.com/zzarcon/skatepark.js/master/art/logo.png"></sk-zoomable>
  ), options)
  .addWithInfo('Set zoom level', () => (
    <sk-zoomable zoom-level="1.5" src="https://raw.githubusercontent.com/zzarcon/skatepark.js/master/art/logo.png"></sk-zoomable>
  ), options)
