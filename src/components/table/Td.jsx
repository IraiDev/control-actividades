
const Td = ({ children, align = 'text-center', isMultiLine = true, width = 'max-w-md', className, bgcolor }) => {
   return (
      <td
         className={`
            ${align} ${isMultiLine ? 'truncate' : 'whitespace-pre-wrap'} 
            ${className} ${width} ${bgcolor && 'bg-black/5'}
            animate__animated animate__slideInLeft animate__faster 
            z-10 px-2 py-3.5
         `}
      >
         {children}
      </td>
   )
}

export default Td
