import React from 'react';
import {
  storiesOf,
  setAddon
} from '@kadira/storybook';
import infoAddon from '@kadira/react-storybook-addon-info';
import SKTags from 'skateparkjs-tags';
import Highlight from 'react-highlight';
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
  .addWithInfo('Retrieving tags', () => {
    const onClick = () => {
      const skTags = document.getElementById('tags');

      alert(JSON.stringify(skTags.tags));
    };

    return <div className="retrieve">
      <sk-tags id="tags"></sk-tags> 
      <button onClick={onClick}>Show tags</button>
      
      <Highlight className='javascript'>{`
const onClick = () => {
  const skTags = document.getElementById('tags');

  alert(JSON.stringify(skTags.tags));
};

<sk-tags id="tags"></sk-tags> 
<button onClick={onClick}>Show tags</button>
      `}</Highlight>
    </div>
  }, Object.assign({}, options, {source: false}))
  .addWithInfo('Set initial tags', () => (
    <sk-tags tags="1,2,3"></sk-tags>
  ), options);