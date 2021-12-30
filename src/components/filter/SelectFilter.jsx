import React from 'react'
import Button from '../ui/Button'
import Select from 'react-select'

const SelectFilter = ({
  isMulti = false,
  field,
  value,
  options,
  onChange,
  filterUp,
  filterDown,
  defaultLabel = 'todos'
}) => (
  <span className='flex justify-between items-center pl-5 pr-3 gap-1'>

    <span className='w-full'>
      <p className='text-xs ml-4 capitalize mb-1'>{field}</p>
      <Select
        className='w-full capitalize text-sm'
        placeholder='Seleccione'
        options={[{ value: null, label: defaultLabel }].concat(options)}
        value={value}
        onChange={onChange}
        maxMenuHeight={170}
        isMulti={isMulti}
      />
    </span>
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

export default SelectFilter
