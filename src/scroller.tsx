import React, {useState, useEffect, useRef, useContext, useMemo,
  forwardRef} from 'react';
import ScrollerProps from './types/scrollerProps';
import ScrollContext from './context';
import packItems from './utils/packItems';

export const Scroller = ({
  averageHeight = 350,
  element: Element,
  length: customLength,
  style = {},
  onFetch,
  upperRender,
  ...divProps
}: ScrollerProps, outRef) => {
  const [mounted, setMounted] = useState(false);
  const [length, setLength] = useState(0);
  const [topCount, setTopCount] = useState(0);
  const lastScrollTop = useRef(0);
  const contanierRef = useRef<HTMLDivElement | null>();
  const upperRenderRef = useRef<HTMLDivElement | null>(null);
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
    loading,
    setLoading,
  } = useContext(ScrollContext);
  const canFetchRef = useRef(!items.length);

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
  }, [averageHeight, items.length, index, length]);

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
    if (customLength) {
      setLength(customLength);
      setTopCount(customLength * 0.2);
      return;
    }
    if (items.length) {
      const len = Math.floor(items.length * 0.7);
      setLength(len);
      setTopCount(Math.floor(len * 0.2));
    }
  }, [customLength, items.length, page]);

  useEffect(() => {
    if (!canFetchRef.current) return;
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
    if (onFetch) {
      isControl ? onFetch() : onFetch({page, push});
      canFetchRef.current = false;
    }
  }, [isControl, onFetch, page, setIsComplete, setItems, setLoading]);

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
        canFetchRef.current = true;
      }

      const upperRenderHeight = upperRenderRef.current ?
      upperRenderRef.current.clientHeight : 0;
      const startIndex = Math.floor(
          (cd.scrollTop - topCount * averageHeight - upperRenderHeight) /
          averageHeight,
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
      {...divProps}
      ref={(n) => {
        contanierRef.current = n;
        outRef && (outRef.current = n);
      }}
      style={{height: '100vh', overflow: 'auto', ...style}}>
      <div ref={upperRenderRef}>
        {upperRender && upperRender()}
      </div>
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

export default forwardRef(Scroller);
