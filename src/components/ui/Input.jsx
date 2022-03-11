import React from 'react'

const Input = ({
   type = 'text',
   id,
   name,
   value,
   onChange,
   placeholder = 'Escriba aqui',
   field,
   width = 'w-full',
   disabled = false,
   tooltip,
   isNumber = false,
   className,
   padding = 'px-4 py-1.5',
   onBlur,
   isRequired = false,
   highlight = false
}) => {
   return (
      <div className={className}>
         {field &&
            <span className={`
               flex gap-2 items-baseline font-semibold text-sm capitalize w-max mb-1.5 py-0.5
               ${highlight ? 'px-2 bg-amber-200/80 rounded-md' : ''}
               `}
            >
               {field}
               {isRequired && <span className='text-red-600 font-semibold'>(*)</span>}
            </span>
         }
         <input
            id={id}
            name={name}
            title={tooltip}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            onFocus={e => {
               e.target.select()
            }}
            type={type}
            className={`${padding} rounded-md bg-white text-slate-700 border border-zinc-300/70 transition duration-200 focus:ring-2 focus:shadow-lg ${width}`}
            placeholder={placeholder}
            onKeyPress={event => {
               if (!isNumber) return
               if (!/[\d.]/.test(event.key)) {
                  event.preventDefault()
               }
            }}
         />
      </div>
   )
}

export default Input
