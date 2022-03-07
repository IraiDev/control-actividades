const Box = ({children, isBlock = false, className = 'mt-3 bg-zinc-100'}) => {
   if (isBlock) {
      return (
         <div className={`
            grid grid-cols-7 gap-3 items-center p-1 rounded-md
            ${className}
         `}>
            {children}
         </div>
      )
   }

   return (
      <div className='grid grid-cols-7 gap-3 items-center p-1 border-t'>
         {children}
      </div>
   )
}

export default Box