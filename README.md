## React-Roll
#### infinite scroller, record scroll position, like twitter's timeline

## Usage

``` javascript
import {Provider, Scroller} from 'react-roll'

const App () => (
  <Provider>
    <Scroller
      // render item's average height
      averageHeight={350}
      // index of anchor that trigger update render items
      anchorIndex={6}
      // fetch is to get list data, need return array data
      fetch={fetch}
      // render item length
      focusLength={20}
      // length of each fetch data, if less than focusLength that cover by focusLength
      pageSize={30}
      // custom render item, data is used to render item.
      itemRender={(data, index) => <Item {...data} key={index} />}
      // container dom style
      style
      // container dom class
      className
    />
  </Provider>
)
```

## Provider

record list states, record loaded item data, scroll position

## Scroller

main of react-roll
