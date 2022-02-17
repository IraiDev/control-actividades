import React from 'react'

const CardFooter = ({ children }) => {
   return (
      <footer className='flex justify-between items-center border-t w-full pt-2 mt-2'>
         {children}
      </footer>
   )
}

export default CardFooter
