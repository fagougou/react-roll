import React, {useState} from 'react';
import ItemProps from './types/itemProps';
import ScrollContext from './context';

export const Provider = ({children}: { children: React.ReactNode }) => {
  const [items, setItems] = useState<ItemProps[]>([]);
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [scrollTop, setScrollTop] = useState(0);
  return (
    <ScrollContext.Provider value={{
      items, index, scrollTop, setItems, setIndex, setScrollTop, page, setPage,
    }}
    >
      {React.Children.only(children)}
    </ScrollContext.Provider>
  );
};

export default Provider;

