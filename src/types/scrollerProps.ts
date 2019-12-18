interface ScrollerProps {
  length: number
  topCount: number
  averageHeight: number
  fetch(data: any): Promise<any[]>
  pageSize: number
  renderItem(data: any, index: number): React.ReactElement
  className?: string
  style?: React.CSSProperties
}

export default ScrollerProps;
