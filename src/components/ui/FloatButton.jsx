import React from 'react'

const FloatButton = ({
   onClick,
   children,
   size = 'h-16 w-16',
   position = 'bottom-10 right-5',
   className = 'text-slate-700 bg-white hover:bg-zinc-200',
   tooltip,
}) => {
   return (
      <button
         className={`shadow-lg fixed z-20
            rounded-full transition duration-300
            ${size} ${position} ${className}
            `}
         title={tooltip}
         onClick={onClick}>
         {children}
      </button>
   )
}

export default FloatButton
