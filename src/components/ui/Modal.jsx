import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import Button from './Button'

const portal = document.getElementById('modal-root')

const Modal = ({
   children,
   showModal,
   onClose,
   isBlur = true,
   className = 'max-w-4xl',
   padding = 'p-10',
   title,
   hideCloseButton = false,
}) => {
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
      return () => {
         const body = document.querySelector('body')
         body.classList.remove('overflow-hidden')
      }
   }, [showModal])

   if (showModal) {
      return ReactDOM.createPortal(
         <main className='fixed top-0 bottom-0 left-0 right-0 z-40 animate__animated animate__fadeIn animate__faster'>
            <div
               onClick={onBlur}
               className='fixed top-0 bottom-0 left-0 right-0 z-40 bg-black bg-opacity-25'
            />

            <div className={`relative flex items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent p-2 h-full z-40 ${className}`}>

               <section className={`rounded-md bg-white shadow-xl relative w-full max-h-full overflow-custom ${padding}`}>

                  <Button
                     hidden={hideCloseButton}
                     onClick={onClose}
                     className='absolute z-50 right-4 top-4 text-slate-700 hover:text-red-500'>
                     <i className='fas fa-times fa-lg' />
                  </Button>

                  <h1 className='w-full text-center my-3 px-4 text-xl font-semibold first-letter:capitalize'>
                     {title}
                  </h1>

                  {children}

               </section>
            </div>
         </main>,
         portal
      )
   }

   return null
}

export default Modal
