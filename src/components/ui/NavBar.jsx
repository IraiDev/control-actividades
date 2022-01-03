import { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { ActivityContext } from '../../context/ActivityContext'
import { useToggle } from '../../hooks/useToggle'
import UserIndicator from '../timer/UserIndicator'
import Button from './Button'
import NavMenu from './NavMenu'
import SideBar from './SideBar'
import { routes } from '../../types/types'
import { useNotify } from '../../hooks/useNotify'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import moment from 'moment'

const { activity } = routes

const NavBar = () => {

   const { notify, markNotifications } = useNotify()
   const { pathname } = useLocation()
   const { saveFilters, filters } = useContext(ActivityContext)
   const [isMenuOpen, toggleMenu] = useToggle(null)
   const [isSideBarOpen, toggleSideBar] = useToggle(null)

   return (
      <>
         <nav className='flex items-center justify-between bg-white shadow-md border h-16 px-10 sticky z-20 top-0'>
            {
               pathname === activity ?
                  <Button
                     className='rounded-full bg-slate-100 hover:bg-slate-200 hover:shadow-lg
                        hover:shadow-slate-400/30 shadow'
                     type='iconText'
                     name='Filtros'
                     onClick={toggleSideBar}
                  />
                  : <span />
            }
            <section className='hidden md:flex gap-2 hover:bg-gray-100 p-2 rounded-full transition duration-500'>
               <UserIndicator user='IA' />
               <UserIndicator user='SA' />
               <UserIndicator user='RD' />
               <UserIndicator user='FM' state />
               <UserIndicator user='CA' state />
            </section>
            <section className='bg-black/5 rounded-lg p-1 flex items-center'>
               <Button
                  disabled={pathname !== activity}
                  className={`hover:bg-slate-200 rounded-lg ${filters.entrabajo === 2 ? 'text-blue-500' : 'text-slate-700'} `}
                  type='icon'
                  icon='fas fa-user-clock'
                  onClick={() => saveFilters({ payload: { entrabajo: filters.entrabajo === 2 ? '' : 2 } })} />
               {/* <Button
                  className='hover:bg-slate-200 rounded-lg text-slate-700'
                  type='icon'
                  icon='fas fa-sync-alt'
                  onClick={() => saveFilters({ reset: true })} /> */}
               <Menu
                  direction='right'
                  overflow='auto'
                  position='anchor'
                  menuButton={
                     <MenuButton
                        className='text-slate-700 hover:bg-slate-200 rounded-lg h-8 w-8 transition duration-500 relative'
                     >
                        <span
                           className={`h-4 min-w-[16px] bg-red-400 text-white rounded-full 
                              absolute top-0 right-0 text-xs ${notify.length < 1 && 'hidden'}
                           `}
                        >
                           {notify.length}
                        </span>
                        <i className='fas fa-bell' />
                     </MenuButton>
                  }
               >
                  {notify.length > 0 ?
                     notify.map((noti, i) => (
                        <MenuItem
                           key={noti.id_nota}
                           className='text-transparent hover:text-slate-800 flex items-center justify-between'
                        >
                           <div className='grid text-slate-800 max-w-[150px]'>
                              <span className='text-xs'><strong>Fecha:</strong> {moment(noti.fecha_hora_crea).format('DD/MM/yyyy, HH:mm')}</span>
                              <span className='text-xs truncate'><strong>Desc.:</strong> {noti.desc_nota}</span>
                              <span className='text-xs'><strong>Por:</strong> {noti.user_crea_nota.abrev_user}</span>
                           </div>
                           <Button
                              className="outline-none focus:outline-none hover:text-red-500"
                              type="icon"
                              icon="fas fa-eye-slash fa-sm"
                              onClick={() => markNotifications({ id_nota: noti.id_nota })}
                           />
                        </MenuItem>
                     ))
                     : <MenuItem>No hay notificaciones...</MenuItem>
                  }
                  <MenuItem
                     className='flex justify-between items-center hover:text-red-500'
                     onClick={markNotifications}
                  >
                     Marcar como vistas <i className='fas fa-eye-slash fa-sm' />
                  </MenuItem>
               </Menu>
               <Button
                  disabled
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
