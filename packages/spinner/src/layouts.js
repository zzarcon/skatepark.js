import {
  h
} from 'skatejs';

export default (type, extraClass = '') => {
  const layouts = {
    circle: [
      h('div', {
          class: `spinner circle ${extraClass}`
        },
        h('div', {
          class: `bounce1`
        }),
        h('div', {
          class: 'bounce2'
        })
      )
    ],
    rect: [
      h('div', {
        class: `spinner rect ${extraClass}`
      }, h('div', {
        class: 'rect1'
      }), h('div', {
        class: 'rect2'
      }), h('div', {
        class: 'rect3'
      }), h('div', {
        class: 'rect4'
      }), h('div', {
        class: 'rect5'
      }))
    ],
    bounce: [
      h('div', {
          class: `spinner bounce ${extraClass}`
        },
        h('div', {
          class: `bounce1`
        }),
        h('div', {
          class: 'bounce2'
        }),
        h('div', {
          class: 'bounce3'
        })
      )
    ]
  };

  return layouts[type];
}