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
   padding = 'px-4 py-2',
   onBlur,
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
            onBlur={onBlur}
            disabled={disabled}
            onFocus={e => {
               e.target.select()
            }}
            type={type}
            className={`${padding} rounded-md bg-zinc-100 focus:bg-white text-slate-700 transition duration-200 focus:ring-2 focus:shadow-lg ${width}`}
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
