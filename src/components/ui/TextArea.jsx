import React from 'react'
const TextArea = ({
   type = 'text',
   name,
   value,
   onChange,
   placeholder = 'Escriba aqui',
   field = 'campo',
   rows = 7,
   ref
   // chartLimit = 500
}) => {
   return (
      <div>
         <p className="px-4 py-1 capitalize text-xs">{field}</p>
         <textarea
            // maxLength={chartLimit}
            name={name}
            rows={rows}
            value={value}
            onChange={onChange}
            type={type}
            className="scroll-row px-4 py-2 text-justify rounded-md bg-gray-100 focus:bg-white w-full resize-none transition duration-500 focus:ring-2 focus:shadow-lg"
            placeholder={placeholder}></textarea>
         {/* {value &&
            <label className={`ml-4 ${value.length === chartLimit ? 'text-red-600' : 'text-gray-500'}`}>
               {value.length}/{chartLimit}
               <strong className='ml-2'>Caracteres max.</strong>
            </label>
         } */}
      </div>
   )
}

export default TextArea
