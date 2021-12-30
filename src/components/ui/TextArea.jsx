import React from 'react'
const TextArea = ({
   type = 'text',
   name,
   value,
   onChange,
   placeholder = 'Escriba aqui',
   field,
   rows = 7,
   disabled = false
}) => {
   return (
      <div>
         <p className='px-4 py-1 capitalize text-xs'>{field}</p>
         <textarea
            disabled={disabled}
            name={name}
            rows={rows}
            value={value}
            onChange={onChange}
            type={type}
            className='scroll-row px-4 text-sm h-min overflow-custom py-2 text-justify rounded-md bg-black/5 
             focus:bg-white w-full resize-none transition duration-200 focus:ring-2 focus:shadow-lg'
            placeholder={placeholder}>

         </textarea>
      </div>
   )
}

export default TextArea
