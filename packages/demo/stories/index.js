import React from 'react';
import {
  storiesOf
} from '@kadira/storybook';
import SKTags from 'skateparkjs-tags';

storiesOf('Tags', module)
  .add('Enter a space-separated list of tags', () => (
    <div>
      <sk-tags></sk-tags>
      <pre>{`
        <sk-tags></sk-tags>
      `}</pre>
    </div>
  ))
  .add('Custom delimiter', () => ( 
    <div>
      <sk-tags delimiter=","></sk-tags>
      <pre>{`
        <sk-tags delimiter=","></sk-tags>
      `}</pre>
    </div>
  ))
  .add('Allow deletion', () => ( 
    <div>
      <sk-tags deletion="true"></sk-tags>
      <pre>{`
        <sk-tags deletion="true"></sk-tags>
      `}</pre>
    </div>
  ))
  .add('Style it as you wish', () => ( 
    TODO
  ));