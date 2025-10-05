import Modal from 'components/modal/Modal'
import React from 'react'

export default function SignUpView({
  isOpen,
  isClose,
  onClose = () => console.log("Close ❎"),
}: {
  isOpen: boolean;
  isClose: boolean;
  onClose?: () => void;
}) {
    
  return (
    <Modal isOpen={isOpen} isClose={isClose} onClose={onClose} className="">
      <Modal.Header>
        <h1>Sign Up</h1>
      </ Modal.Header>
      <Modal.Body>
        <form className="flex flex-col gap-4 bg-amber-700 p-4">
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Sign In</button>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <p>Don't have an account? <a href="/auth/signup">Sign Up</a></p>
      </Modal.Footer>
    </Modal>
  )
}
