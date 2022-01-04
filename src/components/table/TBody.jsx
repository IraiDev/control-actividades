import React from 'react'

const TBody = ({ children, className }) => {
   return (
      <tbody className={className}>
         {children}
      </tbody>
   )
}

export default TBody
