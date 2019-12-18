import {createContext} from 'react';
import ContextProps from './types/contextProps';

const ScrollContext = createContext<ContextProps>({
  items: [],
  setItems() {},
  index: 0,
  setIndex() {},
  scrollTop: 0,
  setScrollTop() {},
  page: 1,
  setPage() {},
});

export default ScrollContext;
