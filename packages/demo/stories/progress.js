import React from 'react';
import {
  storiesOf
} from '@kadira/storybook';
import SKProgress from 'skateparkjs-progress';
import options from './defaultStoryOptions';

let animatedInterval;

storiesOf('Progress', module)
  .addWithInfo('Using default options', () => {
    const onClick = () => {
      const progress = document.querySelector('sk-progress');

      progress.increment(10);
    };

    return <div style={{width: '300px', height: '150px', border: '3px solid'}}>
      <sk-progress value="10"></sk-progress>
      <button onClick={onClick} style={{margin: '10px auto', display: 'block'}}>Increment value</button>
    </div>
  }, options)
  .addWithInfo('Specify dimensions', () => (
    <div style={{width: '300px', height: '150px', border: '3px solid'}}>
      <sk-progress value="10" width="200" height="20"></sk-progress>
    </div>
  ), options)
  .addWithInfo('Show percentage', () => (
    <div style={{width: '300px', height: '150px', border: '3px solid'}}>
      <sk-progress value="10" show-percentage="true"></sk-progress>
    </div>
  ), options)
  .addWithInfo('Set color', () => (
    <div style={{width: '300px', height: '150px', border: '3px solid'}}>
      <sk-progress value="50" color="#4858c5"></sk-progress>
    </div>
  ), options)
  .addWithInfo('Animated', () => {
    clearInterval(animatedInterval);

    animatedInterval = setInterval(() => {
      const progress = document.querySelector('sk-progress');

      progress.increment(20);
    }, 2500);

    return <div style={{width: '300px', height: '150px', border: '3px solid'}}>
      <sk-progress color="#4858c5" value="15" animated="true" show-percentage="true"></sk-progress>
    </div>
  }, options)