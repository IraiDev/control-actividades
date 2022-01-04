import React from 'react'

const THead = ({ children, className = 'sticky top-0' }) => {
   return (
      <thead className={`${className} z-20`}>
         {children}
      </thead>
   )
}

export default THead
