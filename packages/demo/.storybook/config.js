import { configure } from '@kadira/storybook';
import { setOptions } from '@kadira/storybook-addon-options';

function loadStories() {
  require('../stories/index.js');
}

setOptions({
  name: 'Skatepark.js',
  url: 'https://github.com/zzarcon/skatepark.js',
  goFullScreen: false,
  showLeftPanel: true,
  showDownPanel: false,
  showSearchBox: false,
  downPanelInRight: false,
});

configure(loadStories, module);