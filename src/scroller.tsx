import React, {useState, useEffect, useRef, useContext, useMemo} from 'react';
import ScrollerProps from './types/scrollerProps';
import ScrollContext from './context';

export const Scroller = ({
  length = 20,
  topCount = 6,
  averageHeight = 350,
  fetch,
  pageSize = 30,
  renderItem,
  className = '',
  style = {},
}: ScrollerProps) => {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const compeltedRef = useRef(false);
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


  useEffect(() => {
    setLoading(true);
    fetch(pageSize).then((data) => {
      setLoading(false);
      if (data.length === 0) {
        compeltedRef.current = true;
      }
      const list = data.map(
          (item, i) =>
            ({index: (page - 1) * pageSize + i, data: item}));
      if (page === 1) {
        setItems(list);
      } else {
        setItems((state) => [...state, ...list]);
      }
    });
  }, [fetch, setItems, page, pageSize]);

  useEffect(() => {
    if (!contanierRef.current) return;
    const cd = contanierRef.current;
    const onScroll = () => {
      if (!cd) return;
      const direction = cd.scrollTop - lastScrollTop.current > 0;
      if (
        direction &&
        !loading &&
        !compeltedRef.current &&
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
  }, [averageHeight, loading, topCount, setIndex, setScrollTop]);

  return (
    <div
      className={className}
      ref={(n) => contanierRef.current = n}
      style={{minHeight: 300, overflow: 'auto', ...style}}>
      <div style={{height: upperHolderHeight}} />
      {activeItems.map((item) => renderItem(item.data, item.index))}
      <div
        style={{
          height: underHolderHight,
        }}
      />
    </div>
  );
};

export default Scroller;
