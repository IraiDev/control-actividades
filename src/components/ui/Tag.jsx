import React from 'react'

const Tag = ({ children }) => {
   return (
      <div className='bg-white rounded-full py-[3px] mt-2 relative'>
         <span className='rounded-full px-2 py-[3px] bg-orange-200/80 text-orange-500 border border-orange-500 shadow font-bold w-max text-xs'>
            { children }
         </span>

         <i className='fas fa-bell absolute -top-1 -right-2 text-orange-200 rounded-full h-4 w-4 bg-orange-500 flex items-center justify-center' />
      </div>
   )
}

export default Tag