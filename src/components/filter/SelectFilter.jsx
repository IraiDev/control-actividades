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
   downActive,
   type = 'sidebar',
   placeholder = 'seleccione',
   isOrder = true,
}) => {
   if (type === 'table') {
      return (
         <div className='flex justify-between items-center mt-2'>
            {isOrder && (
               <Button
                  disabled={upActive}
                  className={`hover:text-blue-500 mt-1 ${
                     upActive ? 'text-blue-500' : ''
                  }`}
                  onClick={filterUp}>
                  <i className='fas fa-angle-up' />
               </Button>
            )}

            <section className='w-40 px-1 mx-auto'>
               {field && <p className='text-xs ml-4 capitalize mb-1'>{field}</p>}
               <Select
                  components={{
                     DropdownIndicator: () => null,
                     IndicatorSeparator: () => null,
                  }}
                  className='capitalize text-sm font-normal'
                  placeholder={placeholder}
                  options={
                     isMulti
                        ? options
                        : [{ value: null, label: defaultLabel }].concat(options)
                  }
                  value={value}
                  onChange={onChange}
                  maxMenuHeight={170}
                  isMulti={isMulti}
               />
            </section>

            {isOrder && (
               <Button
                  disabled={downActive}
                  className={`hover:text-blue-500 mt-1 ${
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
      <div className='flex justify-between items-center pl-5 pr-3 gap-1'>
         <section className='w-full relative'>
            <p className='text-xs ml-4 capitalize mb-1'>{field}</p>
            <Select
               className='w-full capitalize text-sm'
               placeholder='Seleccione'
               options={
                  isMulti
                     ? options
                     : [{ value: null, label: defaultLabel }].concat(options)
               }
               value={value}
               onChange={onChange}
               maxMenuHeight={170}
               isMulti={isMulti}
            />
         </section>

         <Button
            disabled={upActive}
            className={`hover:text-blue-500 mt-5 ${
               upActive ? 'text-blue-500' : 'text-gray-700'
            }`}
            onClick={filterUp}>
            <i className='fas fa-angle-up text-lg' />
         </Button>

         <Button
            disabled={downActive}
            className={`hover:text-blue-500 mt-5 ${
               downActive ? 'text-blue-500' : 'text-gray-700'
            }`}
            onClick={filterDown}>
            <i className='fas fa-angle-down text-lg' />
         </Button>
      </div>
   )
}

export default SelectFilter
