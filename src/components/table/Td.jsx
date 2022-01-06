
const Td = ({ children, align = 'text-center', isMultiLine = false, width = 'max-w-md', className, bgcolor }) => {
   return (
      <td
         className={`
            ${align} ${isMultiLine ? 'whitespace-pre-wrap' : 'truncate'} 
            ${className} ${width} ${bgcolor && 'bg-black/5'}
            animate__animated animate__fadeIn animate__faster 
            px-2 py-3
         `}
      >
         {children}
      </td>
   )
}

export default Td
