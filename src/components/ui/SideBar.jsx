import React from 'react'
import Button from './Button'

const SideBar = ({ isOpen, toggleSideBar }) => {
   return (
      <nav className={`
         fixed top-0 left-0 border bg-white shadow-lg h-screen w-72
         animate__animated animate__faster z-30
         ${isOpen === null && 'hidden'}
         ${isOpen ? 'animate__slideInLeft' : 'animate__slideOutLeft'}
         `}>
         <header className='flex items-center justify-between p-5'>
            <h1 className='capitalize text-gray-500'>Filtrar</h1>
            <Button
               className='rounded-lg hover:bg-gray-100'
               type='icon'
               icon='fas fa-times'
               onClick={toggleSideBar} />
         </header>
      </nav>
   )
}

export default SideBar
