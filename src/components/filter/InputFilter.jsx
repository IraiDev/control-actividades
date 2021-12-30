import React from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'

const InputFilter = ({ isNumber = false, field, value, name, onChange, filterUp, filterDown }) => {
  return (
    <span className='flex justify-between items-center pl-5 pr-3'>
      <Input field={field} isNumber={isNumber} name={name} value={value} onChange={onChange} />
      <Button
        className='rounded-full text-slate-600 hover:text-blue-500 mt-5'
        icon='fas fa-chevron-up fa-sm'
        type='icon'
        onClick={filterUp}
      />
      <Button
        className='rounded-full text-slate-600 hover:text-blue-500 mt-5'
        icon='fas fa-chevron-down fa-sm'
        type='icon'
        onClick={filterDown}
      />
    </span>
  )
}

export default InputFilter
