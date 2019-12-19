import React, {useState, useEffect, useRef, useContext, useMemo} from 'react';
import ScrollerProps from './types/scrollerProps';
import ScrollContext from './context';
import packItems from './utils/packItems';

export const Scroller = ({
  averageHeight = 350,
  element: Element,
  className = '',
  style = {},
  onLoad,
}: ScrollerProps) => {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [length, setLength] = useState(0);
  const [topCount, setTopCount] = useState(0);
  const lastScrollTop = useRef(0);
  const contanierRef = useRef<HTMLDivElement | null>();
  const {
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
  } = useContext(ScrollContext);

  const activeItems = useMemo(
      () => items.slice(index, index + length),
      [items, index, length],
  );

  const upperHolderHeight = useMemo(() => averageHeight * index, [
    index,
    averageHeight,
  ]);

  const underHolderHight = useMemo(() => {
    const v = averageHeight * (items.length - index - length);
    return v >= 0 ? v : 0;
  }, [items.length, index, averageHeight, length]);

  // restore scroll position
  useEffect(() => {
    if (mounted) return;
    if (contanierRef.current) {
      contanierRef.current.scrollTop = scrollTop;
    }
    setMounted(true);
  }, [scrollTop, mounted]);

  // guess item count, visible count eg.
  useEffect(() => {
    if (page === 1 && items.length) {
      const len = Math.floor(items.length * 0.7);
      setLength(len);
      setTopCount(Math.floor(len * 0.2));
    }
  }, [items.length, page]);

  useEffect(() => {
    setLoading(true);
    const push = (data: []) => {
      setItems((state) => {
        const list = packItems(data, state.length);
        return page === 1 ? list : [...state, ...list];
      });
      if (!data.length) {
        setIsComplete(true);
      }
      setLoading(false);
    };
    isControl ? onLoad() : onLoad({page, push});
  }, [isControl, onLoad, page, setIsComplete, setItems]);

  useEffect(() => {
    if (!contanierRef.current) return;
    const cd = contanierRef.current;
    const onScroll = () => {
      if (!cd) return;
      const direction = cd.scrollTop - lastScrollTop.current > 0;
      if (
        direction &&
        !loading &&
        !isComplete &&
        cd.scrollTop + 3000 > cd.scrollHeight - cd.clientHeight
      ) {
        setPage((state) => state + 1);
      }

      const startIndex = Math.floor(
          (cd.scrollTop - topCount * averageHeight) / averageHeight,
      );
      setIndex(startIndex >= 0 ? startIndex : 0);

      lastScrollTop.current = cd.scrollTop;
      setScrollTop(cd.scrollTop);
    };

    cd.addEventListener('scroll', onScroll);

    return () => cd.removeEventListener('scroll', onScroll);
  }, [averageHeight, loading,
    topCount, setIndex, setScrollTop, setPage, isComplete]);

  return (
    <div
      className={className}
      ref={(n) => contanierRef.current = n}
      style={{height: '100vh', overflow: 'auto', ...style}}>
      <div style={{height: upperHolderHeight}} />
      {activeItems.map((item) => <Element key={item.index} {...item.data} />)}
      <div
        style={{
          height: underHolderHight,
        }}
      />
    </div>
  );
};

export default Scroller;
