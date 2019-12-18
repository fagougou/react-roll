import ItemProps from './itemProps';

interface ContextProps {
  items: ItemProps[]
  setItems(v: ItemProps[] | ((s: ItemProps[]) => ItemProps[])): void
  index: number
  setIndex(v: number): void
  scrollTop: number
  setScrollTop(v: number): void
  page: number
  setPage(v: number | ((s: number) => number)): void
}

export default ContextProps;
