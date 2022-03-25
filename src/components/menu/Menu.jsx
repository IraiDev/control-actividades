import ReactDOM from 'react-dom'
import { useState } from 'react'
import OnOutsiceClick from 'react-outclick'

const portal = document.getElementById('menu-root')

const MenuContent = ({ children, showMenu, onClick }) => {
   return ReactDOM.createPortal(
      <section
         onClick={onClick}
         className={`
            absolute left-0 top-0 z-50 animate__animated animate__faster
            ${showMenu ? 'animate__fadeIn' : 'hidden'}
            `}>
         {children}
      </section>,
      portal
   )
}

const Menu = ({ menuButton, children }) => {

   const [showMenu, toggleMenu] = useState(false)

   return (
      <OnOutsiceClick onOutsideClick={() => toggleMenu(false)}>
         <div className='bg-green-400 relative'>
            <button
               className='h-7 w-7 rounded-lg hover:bg-gray-500 hover:bg-opacity-10 transition duration-500'
               onClick={() => toggleMenu(!showMenu)}>
               {menuButton}
            </button>
            <MenuContent showMenu={showMenu}>
               {children}
            </MenuContent>
         </div>
      </OnOutsiceClick>
   )
}

export default Menu
