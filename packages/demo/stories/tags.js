import React from 'react';
import {
  storiesOf,
  setAddon
} from '@kadira/storybook';
import infoAddon from '@kadira/react-storybook-addon-info';
import SKTags from 'skateparkjs-tags';
import options from './defaultStoryOptions';

setAddon(infoAddon);

storiesOf('Tags', module)
  .addWithInfo('Enter a space-separated list of tags', () => (
    <sk-tags></sk-tags>
  ), options)
  .addWithInfo('Custom delimiter', () => ( 
    <sk-tags delimiter=","></sk-tags>
  ), options)
  .addWithInfo('Allow deletion', () => ( 
    <sk-tags deletion="true"></sk-tags>
  ), options)
  .addWithInfo('Style it as you wish', () => ( 
    <div>
    </div>
  ), options);