import React from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'

const InputFilter = ({
   isNumber = false,
   field,
   value,
   name,
   onChange,
   filterUp,
   filterDown,
   upActive,
   downActive,
   type = 'sidebar',
   width = 'w-full',
   padding = 'px-1.5 py-1.5',
   isOrder = true,
}) => {
   if (type === 'table') {
      return (
         <div className='w-full flex items-center justify-between'>
            {isOrder && (
               <Button
                  disabled={upActive}
                  className={`hover:text-blue-500 mt-3 ${
                     upActive ? 'text-blue-500' : ''
                  }`}
                  onClick={filterUp}>
                  <i className='fas fa-angle-up' />
               </Button>
            )}

            <Input
               className='mx-auto pt-2'
               padding={padding}
               width={width}
               field={field}
               isNumber={isNumber}
               name={name}
               value={value}
               onChange={onChange}
               placeholder=''
            />

            {isOrder && (
               <Button
                  disabled={downActive}
                  className={`hover:text-blue-500 mt-3 ${
                     downActive ? 'text-blue-500' : ''
                  }`}
                  onClick={filterDown}>
                  <i className='fas fa-angle-down' />
               </Button>
            )}
         </div>
      )
   }

   return (
      <div className='flex justify-between items-center pl-5 pr-3 mb-3'>

         <section>

            <span className='text-sm font-semibold capitalize block w-max mb-1.5 px-2 py-0.5 bg-amber-200/80 rounded-md'>
               {field}
            </span>

            <Input
               // field={field}
               isNumber={isNumber}
               name={name}
               value={value}
               onChange={onChange}
               placeholder=''
            />

         </section>

         <Button
            disabled={upActive}
            className={`hover:text-blue-500 mt-7 ${
               upActive ? 'text-blue-500' : 'text-slate-700'
            }`}
            onClick={filterUp}>
            <i className='fas fa-angle-up text-lg' />
         </Button>

         <Button
            disabled={downActive}
            className={`hover:text-blue-500 mt-7 ${
               downActive ? 'text-blue-500' : 'text-slate-700'
            }`}
            onClick={filterDown}>
            <i className='fas fa-angle-down text-lg' />
         </Button>
      </div>
   )
}

export default InputFilter
