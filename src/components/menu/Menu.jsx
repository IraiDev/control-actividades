import React, { useState } from 'react'
import OnOutsiceClick from 'react-outclick'

const Menu = ({ menuButton, children }) => {
  const [showMenu, toggleMenu] = useState(false)
  return (
    <OnOutsiceClick onOutsideClick={() => toggleMenu(false)}>
      <div className='bg-green-400'>
        <button
          className='h-7 w-7 rounded-lg hover:bg-gray-500 hover:bg-opacity-10 transition duration-500'
          onClick={() => toggleMenu(!showMenu)}
        >
          {menuButton}
        </button>
        <section
          onClick={() => toggleMenu(false)}
          className={`
          fixed animate__animated animate__faster
          ${showMenu ? 'animate__fadeIn' : 'hidden'}
          `}
        >
          {children}
        </section>
      </div>
    </OnOutsiceClick >
  )
}

export default Menu
