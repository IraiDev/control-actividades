import React from 'react'
import Numerator from '../ui/Numerator'

const CardContent = ({ title, cardNum, children }) => {
   return (
      <div className='grid gap-2'>
         <header className='flex items-start justify-between gap-3 capitalize font-semibold'>
            <h1 className='text-base'>{title || 'Sin Titulo'}</h1>
            <Numerator number={cardNum} />
         </header>
         {children}
      </div>
   )
}

export default CardContent
