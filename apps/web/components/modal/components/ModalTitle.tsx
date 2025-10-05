import React from 'react'

interface ITitle {
  children?: React.ReactNode
}

export default function ModalTitle({
  children = "Title 🎩"
}: ITitle) {
  return <>{children}</>
}
