import { useState, ReactNode } from 'react'
import styles from './CollapsibleSection.module.css'

interface CollapsibleSectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={styles.section}>
      <button
        className={styles.header}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.title}>{title}</span>
        <span className={`${styles.chevron} ${isOpen ? styles.open : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className={styles.content}>
          {children}
        </div>
      )}
    </div>
  )
}
