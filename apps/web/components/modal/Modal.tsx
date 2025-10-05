import React from 'react';
import { twMerge } from 'tailwind-merge';
import ModalTitle from './components/ModalTitle';
import ModalBody from './components/ModalBody';
import ModalFooter from './components/ModalFooter';
import { CustomButton } from 'components/buttons/CustomButton';
import { X } from 'lucide-react';

interface IModalProps {
  children: React.ReactNode;
  isOpen?: boolean;
  isClose?: boolean;
  className?: string;
  containerClassName?: string;
  onClose?: () => void;
}

function Modal({
  children,
  isOpen = false,
  isClose = false,
  className = '',
  containerClassName = '',
  onClose = () => console.log("Close ❎")
}: IModalProps ) {

  // Check that is the model is open or not
  if (!isOpen) return null;

  return (// Modal Backdrop
    <section className={twMerge('bg-black/30 fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center', className)}>

      {/* // Modal Container */}
      <div className={twMerge('grid grid-cols-1 grid-rows-3 gap-4 border-2 rounded-xl overflow-hidden', containerClassName)}>{children}</div>

      {/* // Modal close Button */}
      {isClose && <CustomButton 
        onClick={onClose} 
        className='absolute top-10 right-10' 
        IIcon={X}  
      />}       

    </section>
  )
}

// Modal components added
Modal.Header = ModalTitle;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;