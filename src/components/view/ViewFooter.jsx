import React from 'react'

const ViewFooter = ({ children }) => {
   return (
      <footer className='grid grid-cols-2 gap-2 justify-between mt-5'>
         {children}
      </footer>
   )
}

export default ViewFooter
