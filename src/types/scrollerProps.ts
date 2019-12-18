interface ScrollerProps {
  averageHeight: number
  anchorIndex: number
  focusLength: number
  fetch(data: any): Promise<any[]>
  pageSize: number
  renderItem(data: any, index: number): React.ReactElement
  className?: string
  style?: React.CSSProperties
}

export default ScrollerProps;
