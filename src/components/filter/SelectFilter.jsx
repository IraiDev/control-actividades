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
  defaultLabel = 'todos',
  upActive,
  downActive
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
      className={`hover:text-blue-500 mt-5 ${upActive ? 'text-blue-500' : 'text-gray-400'}`}
      icon='fas fa-angle-up text-lg'
      type='icon'
      onClick={filterUp}
    />
    <Button
      className={`hover:text-blue-500 mt-5 ${downActive ? 'text-blue-500' : 'text-gray-400'}`}
      icon='fas fa-angle-down text-lg'
      type='icon'
      onClick={filterDown}
    />
  </span>
)

export default SelectFilter
