import React, {useState, useEffect, useRef} from 'react';
import ItemProps from './types/itemProps';
import ScrollContext from './context';
import ProviderProps from './types/providerProps';
import packItems from './utils/packItems';

export const Provider = ({children, source}: ProviderProps) => {
  const [items, setItems] = useState<ItemProps[]>([]);
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [scrollTop, setScrollTop] = useState(0);
  const [isControl, setIsControl] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const lastItemsLength = useRef(0);

  useEffect(() => {
    if (!source) return;
    setItems(packItems(source));
    setLoading(false);
    setIsControl(true);
    if (lastItemsLength.current === source.length) {
      setIsComplete(true);
    } else {
      lastItemsLength.current = source.length;
      setIsComplete(false);
    }
  }, [source]);

  return (
    <ScrollContext.Provider value={{
      items,
      setItems,
      index,
      setIndex,
      scrollTop,
      setScrollTop,
      page,
      setPage,
      isControl,
      isComplete,
      setIsComplete,
      loading,
      setLoading,
    }}
    >
      {React.Children.only(children)}
    </ScrollContext.Provider>
  );
};

export default Provider;

