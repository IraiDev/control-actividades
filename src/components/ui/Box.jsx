const Box = ({
   children, 
   isBlock = false, 
   className = 'mt-3 bg-zinc-100',
   colCount = 7,
   hidden = false
}) => {

   let cols = ''

   switch (colCount) {
      case 5:
         cols = 'grid-cols-5'
         break
      case 6:
         cols = 'grid-cols-6'
         break
      case 7:
         cols = 'grid-cols-7'
         break
      case 8:
         cols = 'grid-cols-8'
         break
      case 9:
         cols = 'grid-cols-9'
         break
      case 10:
         cols = 'grid-cols-10'
         break
      case 11:
         cols = 'grid-cols-11'
         break
      case 12:
         cols = 'grid-cols-12'
         break
      default:
         cols = 'grid-cols-7'
         break
   }

   if(hidden) return null

   if (isBlock) {
      return (
         <div className={`
            grid gap-3 items-center p-1 rounded-md
            ${cols}
            ${className}
         `}>
            {children}
         </div>
      )
   }

   return (
      <div className={`grid gap-3 items-center p-1 border-t
         ${cols}
      `}>
         {children}
      </div>
   )
}

export default Box