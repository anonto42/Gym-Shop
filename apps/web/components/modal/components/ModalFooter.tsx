import React from 'react'

interface IFooter {
  children?: React.ReactNode
}

export default function ModalFooter({
  children = "Footer 👞"
}: IFooter) {
  return <>{children}</>
}