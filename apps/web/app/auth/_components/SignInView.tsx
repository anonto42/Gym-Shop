import Modal from 'components/modal/Modal'
import Link from 'next/link';
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
    <Modal 
      isOpen={isOpen} 
      isClose={false} 
      onClose={onClose} 
      className="bg-transparent text-white"
      containerClassName='w-[345px] h-[355px] sm:w-[430px] sm:h-[430px] md:w-[700px] md:h-[700px] border-[1px] shadow-[0_0_10px_0_rgba(0,0,0,0.15)] backdrop-blur-md bg-white/20' 
    >
      <Modal.Header>
        <div className='mt-6 bg-amber-200 py-3'>
          <h1 className='text-3xl font-bold text-center bg-amber-300'>Sign In</h1>
        </div>
      </Modal.Header>
      <Modal.Body>
        <form className="flex flex-col gap-4 bg-transparent p-4">
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit" onClick={onClose}>Sign In</button>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <p className='text-center text-sm'>Don't have an account? <Link href="/auth/signup" className='text-blue-500 hover:underline font-semibold'>Sign Up</Link></p>
      </Modal.Footer>
    </Modal>
  )
}
