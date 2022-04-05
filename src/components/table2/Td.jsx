
const Td = props => {
   const {
      children,
      align = 'text-center',
      isMultiLine = false,
      width = 'max-w-sm',
      highlight = false,
      isStickyLeft = false,
      isStickyRight = false,
   } = props

   return (
      <>
         <td
            className={`

               animate__animated animate__fadeIn animate__faster px-2 py-2.5
               border-b border-zinc-400
               ${isMultiLine ? 'whitespace-pre-wrap' : 'truncate'} 
               ${align}
               ${width}
               ${highlight ? 'font-bold' : 'font-normal'}
               ${isStickyLeft ? 'sticky left-0 odd:bg-slate-600 even:bg-slate-700' : isStickyRight ? 'sticky right-0 odd:bg-zinc-200/70 even:bg-zinc-200/70' : ' odd:bg-black/0 even:bg-black/5'}
            
            `}
            onDoubleClick={props.onDoubleClick}
         >
            {children}
         </td>
      </>
   )
}

export default Td
