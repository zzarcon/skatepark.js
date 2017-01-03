import React from 'react';
import {
  storiesOf
} from '@kadira/storybook';
import 'skateparkjs-sticky-list';
import options from './defaultStoryOptions';

storiesOf('Sticky List', module)
  .addWithInfo('Default options', () => {
    const data = [{
      name: 'Cars',
      items: ['BWV', 'Mercedes', 'Ferrari', 'Audi', 'Porche', 'Lamborgini', 'Maserati', 'Aston Martin']
    }, {
      name: 'Cities',
      items: ['Valencia', 'Barcelona', 'Linz', 'Sydney', 'Madrid', 'LA', 'New York', 'Chicago', 'Berlin', 'London']
    }];

    return <sk-sticky-list data={JSON.stringify(data)}></sk-sticky-list>
  }, options)
