const TextArea = ({
   type = 'text',
   name,
   value,
   onChange,
   placeholder = 'Escriba aqui',
   field,
   disabled = false,
   isRequired = false,
   highlight = false,
}) => {
   return (
      <div>
         <span className={`
               flex gap-2 items-baseline font-semibold text-sm capitalize w-max mb-1.5 py-0.5
               ${highlight ? 'px-2 bg-amber-200/80 rounded-md' : ''}
               `}
            >
               {field}
               {isRequired && <span className='text-red-600 font-semibold'>(*)</span>}
            </span>

         <textarea
            disabled={disabled}
            name={name}
            value={value}
            onChange={onChange}
            type={type}
            className='disabled:bg-zinc-100 disabled:text-slate-400 scroll-row px-4 text-sm h-40 overflow-custom py-2 text-justify rounded-md bg-white w-full resize-none transition duration-200 focus:ring-2 focus:shadow-lg border border-zinc-300/70 text-slate-700'
            placeholder={disabled ? '' : placeholder}
         >      
         </textarea>
      </div>
   )
}

export default TextArea
