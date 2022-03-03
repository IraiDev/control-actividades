const TextArea = ({
   type = 'text',
   name,
   value,
   onChange,
   placeholder = 'Escriba aqui',
   field,
   disabled = false,
   isRequired = false,
}) => {
   return (
      <div>
         <label className='flex gap-2 items-baseline pl-4 pb-2 text-xs capitalize'>
            {field}
            {isRequired && <span className='text-red-600 font-semibold'>(*)</span>}
         </label>
         <textarea
            disabled={disabled}
            name={name}
            value={value}
            onChange={onChange}
            type={type}
            className='scroll-row px-4 text-sm h-40 overflow-custom py-2 text-justify rounded-md bg-white w-full resize-none transition duration-200 focus:ring-2 focus:shadow-lg border border-zinc-300/70 text-slate-700'
            placeholder={placeholder}
         >      
         </textarea>
      </div>
   )
}

export default TextArea
