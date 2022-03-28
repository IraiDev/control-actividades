import React from 'react'
import Button from '../ui/Button'
import Select, { components } from 'react-select'
import Tooltip, { TooltipPrimitive } from '@atlaskit/tooltip'
import styled from '@emotion/styled';

const InlineDialog = styled(TooltipPrimitive)`
  background: rgb(244, 244, 245);
  border-radius: 4px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  box-sizing: content-box; /* do not set this to border-box or it will break the overflow handling */
  color: #333;
  border: 1px solid #ccc;
  max-height: 300px;
  max-width: 300px;
  padding: 8px 12px;
  margin-left: 13px;
`

const Option = (props) => {

   return (
      <Tooltip appearance='secundary' content={props?.data?.tooltip} position='right-end' component={InlineDialog}>
         <components.Option {...props} />
      </Tooltip>
   )
}

const SelectFilter = ({
   isMulti = false,
   field,
   value,
   options,
   onChange,
   filterUp,
   filterDown,
   defaultLabel = 'Todos',
   upActive,
   downActive,
   type = 'sidebar',
   isOrder = true,
   defaultOptions = false,
   className = '',
   showTooltip = false,
   height = 170
}) => {

   if (type === 'table') {
      return (
         <div className={`flex justify-between items-center mt-2 mx-auto ${className}`}>
            {isOrder && (
               <Button
                  disabled={upActive}
                  className={`hover:text-blue-500 mt-1 ${upActive ? 'text-blue-500' : ''
                     }`}
                  onClick={filterUp}>
                  <i className='fas fa-angle-up' />
               </Button>
            )}

            <section className='w-40 px-1 mx-auto'>
               {field && <p className='text-xs text-center capitalize mb-1'>{field}</p>}
               <Select
                  components={
                     showTooltip ? {
                        Option,
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                     } : {
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                     }
                  }
                  menuPortalTarget={document.getElementById("select-root")}
                  isClearable={false}
                  styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                  downActive
                  className='capitalize text-sm font-normal'
                  placeholder=''
                  options={
                     isMulti
                        ? defaultOptions ? [{ value: null, label: defaultLabel }].concat(options) : options
                        : !defaultOptions ? [{ value: null, label: defaultLabel }].concat(options) : options
                  }
                  value={value}
                  onChange={onChange}
                  maxMenuHeight={height}
                  isMulti={isMulti}
               />
            </section>

            {isOrder && (
               <Button
                  disabled={downActive}
                  className={`hover:text-blue-500 mt-1 ${downActive ? 'text-blue-500' : ''
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

            <span className='text-sm font-semibold capitalize block w-max mb-1.5 px-2 py-0.5 bg-amber-200/80 rounded-md'>
               {field}
            </span>

            <Select
               className='w-full capitalize text-sm'
               placeholder=''
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
            className={`hover:text-blue-500 mt-5 ${upActive ? 'text-blue-500' : 'text-gray-700'
               }`}
            onClick={filterUp}>
            <i className='fas fa-angle-up text-lg' />
         </Button>

         <Button
            disabled={downActive}
            className={`hover:text-blue-500 mt-5 ${downActive ? 'text-blue-500' : 'text-gray-700'
               }`}
            onClick={filterDown}>
            <i className='fas fa-angle-down text-lg' />

         </Button>

      </div>
   )
}

export default SelectFilter
