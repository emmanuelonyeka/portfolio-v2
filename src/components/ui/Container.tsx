import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'nav'
}

/**
 * The shared page gutter: 1200px max, centred. 12px of padding up to 340px,
 * 24px from there, 48px above 900px — matching the `.container` CSS class it
 * replaces one section at a time.
 */
export function Container({ children, className = '', as: Tag = 'div' }: ContainerProps) {
  return (
    <Tag className={`mx-auto w-auto max-w-[1200px] px-3 min-[341px]:px-6 min-[901px]:px-12 ${className}`.trim()}>
      {children}
    </Tag>
  )
}
