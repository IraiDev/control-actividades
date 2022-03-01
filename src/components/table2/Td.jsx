
const Td = props => {
   const {
      children,
      align = 'text-center',
      isMultiLine = false,
      width = 'max-w-sm',
   } = props

   return (
      <>
         <td
            className={`

               animate__animated animate__fadeIn animate__faster px-2 py-2.5
               odd:bg-black/5 even:bg-black/0 border-b border-zinc-400
               ${isMultiLine ? 'whitespace-pre-wrap' : 'truncate'} 
               ${align}
               ${width}
               
            
            `}>
            {children}
         </td>
      </>
   )
}

export default Td
