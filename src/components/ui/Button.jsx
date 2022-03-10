const Button = ({
   children,
   onClick,
   disabled,
   block,
   size = 'w-max h-9',
   title,
   hidden = false,
   className = 'bg-transparent hover:bg-zinc-200',
   type = 'button',
   isShadow = false,
}) => {
   if (hidden) return null

   return (
      <button
         onClick={onClick}
         disabled={disabled}
         title={title}
         type={type}
         className={`
            px-2.5 font-semibold capitalize focus:outline-none 
            flex gap-2 items-center justify-center transition duration-300
            text-base rounded-md
            disabled:line-through
            ${isShadow && 'hover:shadow-lg'}
            ${className}
            ${block ? 'block' : 'inline-block'}
            ${size}
            ${disabled ? 'opacity-50' : ''}
       `}>
         {children}
      </button>
   )
}

export default Button
