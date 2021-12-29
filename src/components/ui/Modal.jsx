import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

const portal = document.getElementById('modal-root')

const Modal = ({ children, showModal, onClose, isBlur = true, className = 'max-w-4xl', padding = 'p-10' }) => {

   const onBlur = () => {
      if (isBlur) onClose()
   }

   useEffect(() => {
      if (showModal) {
         const body = document.querySelector('body')
         body.classList.add('overflow-hidden')
      } else {
         const body = document.querySelector('body')
         body.classList.remove('overflow-hidden')
      }
      return null
   }, [showModal])

   if (showModal) {
      return ReactDOM.createPortal(
         <div className="fixed top-0 bottom-0 left-0 right-0 z-40 animate__animated animate__fadeIn animate__faster">
            <div
               onClick={onBlur}
               className="fixed top-0 bottom-0 left-0 right-0 z-40 bg-black bg-opacity-25" />
            <div className={`relative flex items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent p-5 h-full z-40 ${className}`}>
               <div className={`rounded-md bg-white shadow-xl relative w-full max-h-full overflow-custom ${padding}`}>
                  <button
                     onClick={onClose}
                     className="focus:outline-none transition duration-500 absolute z-50 right-3 top-3 h-9 w-9 bg-white shadow-md hover:bg-red-400 text-gray-400 hover:text-white rounded-full">
                     <i className="fas fa-times fa-lg"></i>
                  </button>
                  {children}
               </div>
            </div>
         </div>, portal)
   }

   return null
}

export default Modal
