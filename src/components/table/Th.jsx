import React from 'react'

const Th = ({ children, className, width }) => {
   return (
      <th className={`px-2 py-3 ${className} ${width}`}>
         {children}
      </th>
   )
}

export default Th