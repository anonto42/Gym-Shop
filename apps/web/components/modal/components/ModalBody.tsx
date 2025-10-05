import React from 'react'

interface IBody {
  children?: React.ReactNode
}

export default function ModalBody({
  children = "Body 🧥"
}: IBody) {
  return <>{children}</>
}
