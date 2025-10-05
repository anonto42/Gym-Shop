import Modal from 'components/modal/Modal'
import React from 'react'

export default function SignInView({
  isOpen,
  isClose,
  onClose = () => console.log("Close ❎"),
}: {
  isOpen: boolean;
  isClose: boolean;
  onClose?: () => void;
}) {
    
  return (
    <Modal isOpen={isOpen} isClose={false} onClose={onClose} className="bg-transparent" >
      <Modal.Header>
        <h1>Sign In</h1>
      </Modal.Header>
      <Modal.Body>
        <form className="flex flex-col gap-4 bg-transparent p-4">
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
