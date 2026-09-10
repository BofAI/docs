import React, {ReactNode} from 'react'

import styles from './styles.module.css'

type ActivityCardVariant = 'free' | 'discount' | 'adjustment'

type ActivityCardProps = {
  children: ReactNode
  detail: string
  status: string
  title: string
  variant: ActivityCardVariant
}

export default function ActivityCard({
  children,
  detail,
  status,
  title,
  variant,
}: ActivityCardProps) {
  return (
    <section className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.content}>{children}</div>
      </div>
      <div className={styles.footer}>
        <span className={styles.status}>{status}</span>
        <span className={styles.detail}>{detail}</span>
      </div>
    </section>
  )
}
