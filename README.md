## React-Roll
#### infinite scroller, record scroll position, like twitter's timeline

## Usage

``` javascript
import {Provider, Scroller} from 'react-roll'

const Item = <div>{data}</div>

const handleLoad = (page, push) => {
  fetch(page)
  .then(list => push(list))
}

const App () => (
  <Provider source={[]}>
    <Scroller
      element={Item}
      onLoad={handleLoad}
    />
  </Provider>
)
```