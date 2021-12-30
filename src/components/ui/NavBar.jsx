import { useToggle } from '../../hooks/useToggle'
import UserIndicator from '../timer/UserIndicator'
import Button from './Button'
import NavMenu from './NavMenu'
import SideBar from './SideBar'


const NavBar = () => {
   const [isMenuOpen, toggleMenu] = useToggle(null)
   const [isSideBarOpen, toggleSideBar] = useToggle(null)

   return (
      <>
         <nav className='flex items-center justify-between bg-white shadow-md border h-16 px-10 sticky z-20 top-0'>
            <Button
               className='rounded-full bg-slate-100 hover:bg-slate-200 hover:shadow-lg
               hover:shadow-slate-400/30 shadow'
               type='iconText'
               name='Filtros'
               onClick={toggleSideBar}
            />
            <section className='hidden md:flex gap-2 hover:bg-gray-100 p-2 rounded-full transition duration-500'>
               <UserIndicator user="IA" />
               <UserIndicator user="SA" />
               <UserIndicator user="RD" />
               <UserIndicator user="FM" state />
               <UserIndicator user="CA" state />
            </section>
            <section className='bg-black/5 rounded-lg p-1'>
               <Button
                  className='hover:bg-slate-200 rounded-lg text-slate-700'
                  type='icon'
                  icon='fas fa-user-clock'
                  onClick={toggleMenu} />
               <Button
                  className='hover:bg-slate-200 rounded-lg text-slate-700'
                  type='icon'
                  icon='fas fa-sync-alt'
                  onClick={toggleMenu} />
               <Button
                  className='hover:bg-slate-200 rounded-lg text-slate-700'
                  type='icon'
                  icon='fas fa-bell'
                  onClick={toggleMenu} />
               <Button
                  className='hover:bg-slate-200 rounded-lg text-slate-700'
                  type='icon'
                  icon='fas fa-paint-brush'
                  onClick={toggleMenu} />
               <Button
                  className='hover:bg-slate-200 rounded-lg text-slate-700'
                  type='icon'
                  onClick={toggleMenu} />
            </section>
         </nav>

         <NavMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
         <SideBar isOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
      </>
   )
}

export default NavBar
