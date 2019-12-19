interface ScrollerProps {
  averageHeight: number
  element: React.ReactType
  className?: string
  style?: React.CSSProperties
  onLoad(event?: {page?: number, push(data: []): void}): void
}

export default ScrollerProps;
