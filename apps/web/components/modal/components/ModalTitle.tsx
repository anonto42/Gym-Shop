import React from 'react'

interface ITitle {
  title?: React.ReactNode
}

export default function ModalTitle({
  title = "Title 🎩"
}: ITitle) {
  return <>{title}</>
}
