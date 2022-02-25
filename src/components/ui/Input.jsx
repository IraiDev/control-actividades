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
}) => {
   return (
      <div className={className}>
         <p className='px-4 py-1 capitalize text-xs'>{field}</p>
         <input
            id={id}
            name={name}
            title={tooltip}
            value={value}
            onChange={onChange}
            disabled={disabled}
            onFocus={e => {
               e.target.select()
            }}
            type={type}
            className={`px-4 py-2 rounded-md bg-black/5 focus:bg-white transition duration-200 focus:ring-2 focus:shadow-lg ${width}`}
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
