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
}) => {
   return (
      <span className='flex justify-between items-center pl-5 pr-3'>
         <Input
            field={field}
            isNumber={isNumber}
            name={name}
            value={value}
            onChange={onChange}
         />
         <Button
            disabled={upActive}
            className={`hover:text-blue-500 mt-5 ${
               upActive ? 'text-blue-500' : 'text-slate-700'
            }`}
            onClick={filterUp}>
            <i className='fas fa-angle-up text-lg' />
         </Button>
         <Button
            disabled={downActive}
            className={`hover:text-blue-500 mt-5 ${
               downActive ? 'text-blue-500' : 'text-slate-700'
            }`}
            onClick={filterDown}>
            <i className='fas fa-angle-down text-lg' />
         </Button>
      </span>
   )
}

export default InputFilter
