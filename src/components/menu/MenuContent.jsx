import React from 'react'

const MenuContent = ({ children, styles, className = '-top-2 right-36' }) => {
  return (
    <div className={`
      relative min-w-[150px] bg-red-400
      rounded-md shadow-2xl min-w-menu border z-30 
      ${styles} ${className}
    `}>
      {children}
    </div>
  )
}

export default MenuContent
