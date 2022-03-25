const MarkActivity = ({
   children, 
   // color = 'bg-amber-200/80', 
   title, 
   position = 'absolute -top-3 right-1/2 transform translate-x-1/2',
   hidden = false,
   condicion = false
}) => {

   if (hidden) return null

   return (
      <div className={`bg-white rounded-full ${position}`}>
         <span 
            className={`
               flex items-center gap-2 font-bold px-2 py-1 rounded-full shadow-md text-xs
               ${condicion ? 'bg-amber-200/80 text-amber-600': 'bg-indigo-100/80 text-indigo-500'}
            `}
            title={title}
         >
            {children}
         </span>
      </div>
   )
}

export default MarkActivity