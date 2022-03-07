
const Th = ({ 
   children, 
   primary = false,
   isStickyLeft = false,
   isStickyRight = false,
}) => {

   if (primary) {
      return (
         <th className={`px-1 py-1 odd:bg-slate-600 even:bg-slate-700 text-white
            ${isStickyLeft ? 'sticky left-0' : isStickyRight ? 'sticky right-0' : ''}
         `}>
            {children}
         </th>
      )
   }

   return (
      <th className={`px-1 pb-2 text-slate-700 odd:bg-zinc-100 even:bg-zinc-50
         ${isStickyLeft ? 'sticky left-0' : isStickyRight ? 'sticky right-0' : ''}
      `}>
         {children}
      </th>
   )
}

export default Th
