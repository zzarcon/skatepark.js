import React from 'react';
import {
  storiesOf
} from '@kadira/storybook';
import SKSpinner from 'skateparkjs-spinner';
import options from './defaultStoryOptions';

storiesOf('Spinner', module)
  .addWithInfo('Always in the center', () => (
    <div style={{width: '300px', height: '150px', border: '1px solid'}}>
      <sk-spinner></sk-spinner>
    </div>
  ), options)
  .addWithInfo('Different types', () => (
    <div>
      <div style={{width: '100px', height: '50px', border: '1px solid'}}>
        <sk-spinner type="circle"></sk-spinner>
      </div>
      <div style={{width: '100px', height: '50px', border: '1px solid'}}>
        <sk-spinner type="rect"></sk-spinner>
      </div>
      <div style={{width: '100px', height: '50px', border: '1px solid'}}>
        <sk-spinner type="bounce"></sk-spinner>
      </div>
    </div>
  ), options)
  .addWithInfo('Specify color', () => (
    <div style={{width: '100px', height: '50px', border: '1px solid'}}>
      <sk-spinner type="circle" color="#4858c5"></sk-spinner>
    </div>
  ), options)
  .addWithInfo('Add overlay', () => (
    <div style={{width: '100px', height: '50px', border: '1px solid'}}>
      <sk-spinner type="rect" color="white" overlay="true"></sk-spinner>
    </div>
  ), options)