const MarkActivity = ({
   children, 
   color = 'bg-amber-200/80', 
   title, 
   position = 'absolute -top-3 right-1/2 transform translate-x-1/2',
   hidden = false
}) => {

   if (hidden) return null

   return (
      <div className={`bg-white rounded-md ${position}`}>
         <span 
            className={`
               flex items-center gap-2 text-amber-600 font-bold px-2 py-1 rounded-md shadow-md text-xs
               ${color}
            `}
            title={title}
         >
            {children}
         </span>
      </div>
   )
}

export default MarkActivity