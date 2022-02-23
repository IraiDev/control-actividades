import { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ActivityContext } from '../../context/ActivityContext'
import { useToggle } from '../../hooks/useToggle'
import { useForm } from '../../hooks/useForm'
import { useDetail } from '../../hooks/useDetail'
import { routes } from '../../types/types'
import { useNotify } from '../../hooks/useNotify'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import { fetchToken } from '../../helpers/fetch'
import Button from './Button'
import NavMenu from './NavMenu'
import SideBar from './SideBar'
import TimerUsers from '../timer/TimerUsers'
import Modal from './Modal'
import CustomSelect from './CustomSelect'
import Input from './Input'
import TextArea from './TextArea'
import moment from 'moment'
import AlertBar from './AlertBar'
import queryString from 'query-string'

const env = process.env.REACT_APP_ENVIOREMENT

const initOptions = {
   pr: { label: 'ninguno', value: null },
   sp: { label: 'ninguno', value: null },
   us: { label: 'ninguno', value: null },
   ue: { label: 'ninguno', value: null },
   ur: { label: 'ninguno', value: null },
}

const EnvType = ({ env, isHide = false }) => (
   <>
      {env.length > 0 && (
         <h5
            className={`text-lg text-red-400 font-semibold ${
               isHide && 'hidden md:block'
            }`}>
            Serv: {env}
         </h5>
      )}
   </>
)

const { activity, home } = routes

const MenuContent = ({ content }) => {
   return (
      <div className='grid text-slate-700 max-w-[150px]'>
         <span className='text-xs'>
            <strong>Fecha:</strong>{' '}
            {moment(content.fecha_hora_crea).format('DD/MM/yyyy, HH:mm')}
         </span>
         <span className='text-xs truncate'>
            <strong>Desc.:</strong> {content.desc_nota}
         </span>
         <span className='text-xs'>
            <strong>Por:</strong> {content.user_crea_nota.abrev_user}
         </span>
      </div>
   )
}

const NavBar = () => {
   const { saveFilters, filters, optionsArray } = useContext(ActivityContext)

   const { notify, markNotifications } = useNotify()
   const { cloneActivity: createActivity } = useDetail(null)
   const { pathname, search } = useLocation()
   const { title_list = '', icon_list = '' } = queryString.parse(search)
   const [usersTimes, setUsersTimes] = useState([])

   const [isMenuOpen, toggleMenu] = useToggle(null)
   const [isSideBarOpen, toggleSideBar] = useToggle(null)
   const [modal, toggleModal] = useState(false)

   const [files, setFiles] = useState([])
   const [options, setOptions] = useState(initOptions)
   const [
      { title, ticket, priority, time, desc, gloss },
      onChangeValues,
      reset,
   ] = useForm({
      title: '',
      ticket: '',
      priority: '150',
      time: '',
      desc: '',
      gloss: '',
   })

   const validations = () => {
      const vTitle = title.trim() === ''
      const vDesc = desc.trim() === ''
      const vPriority = priority.trim() === ''
      const vTime = time.trim() === ''
      const vPr = options.pr.value === null
      const vUs = options.us.value === null
      const vUe = options.ue.value === null

      const onCreateValidation =
         vTitle || vDesc || vTime || vPriority || vPr || vUs || vUe
      return { isCreate: onCreateValidation }
   }

   const { projects, subProjects, users } = optionsArray

   const getTimes = async () => {
      try {
         const resp = await fetchToken('task/get-times')
         const body = await resp.json()

         if (body.ok) {
            setUsersTimes(body.tiempos)
         }
      } catch (error) {
         console.log('getTimes error: ', error)
      }
   }

   const onCreateActivity = async () => {
      const formData = new FormData()
      options?.pr && formData.append('proyecto', options.pr.value)
      options?.sp && formData.append('sub_proyecto', options.sp.value)
      options?.us && formData.append('solicita', options.us.label)
      options?.ue && formData.append('encargado', options.ue.label)
      options?.ur && formData.append('revisor', options.ur.id)
      formData.append('prioridad', priority)
      formData.append('ticket', ticket)
      formData.append('tiempo_estimado', time)
      formData.append('titulo', title)
      formData.append('descripcion', desc)
      formData.append('glosa', gloss)
      files && formData.append('archivos', files)

      const ok = await createActivity(formData)
      if (!ok) return
      onCloseModal()
      saveFilters({})
   }

   const onCloseModal = () => {
      reset()
      toggleModal(false)
      setOptions(initOptions)
   }

   const handleToggleShowActivities = () => {
      saveFilters({
         payload: {
            entrabajo: filters.entrabajo === 2 ? '' : 2,
            offset: 0,
         },
      })
      getTimes()
   }

   const handleRefresh = () => {
      getTimes()
      if (pathname === activity || pathname === home) {
         saveFilters({
            payload: {
               offset: 0,
               reload: !filters.reload,
            },
         })
      }
   }

   useEffect(() => {
      getTimes()
   }, [])

   return (
      <>
         <nav className='flex items-center justify-between bg-white shadow border h-16 px-2 lg:px-10 sticky z-20 top-0 text-slate-700'>
            {pathname === activity || pathname === home ? (
               <Button
                  className='bg-zinc-100 hover:bg-zinc-200'
                  isShadow
                  onClick={toggleSideBar}>
                  Filtros <i className='fas fa-filter' />
               </Button>
            ) : (
               <section className='font-semibold flex gap-2 items-baseline'>
                  <i className={icon_list} /> <h1>{title_list}</h1>
               </section>
            )}

            <EnvType env={env} />

            <TimerUsers data={usersTimes} />

            <EnvType env={env} isHide />

            <section className='bg-zinc-100 rounded-lg p-1 flex items-center'>
               <Button
                  hidden={pathname !== activity && pathname !== home}
                  title='Nueva actividad'
                  onClick={() => toggleModal(true)}>
                  <i className='fas fa-plus' />
               </Button>

               <Button
                  hidden={pathname !== activity && pathname !== home}
                  className={
                     filters.entrabajo === 2
                        ? ' text-blue-500'
                        : ' text-slate-700' && ' hover:bg-zinc-200'
                  }
                  onClick={handleToggleShowActivities}>
                  <i className='fas fa-user-clock' />
               </Button>

               <Button
                  className='hover:bg-zinc-200 hidden md:block'
                  title='Actualizar'
                  onClick={handleRefresh}>
                  <i className='fas fa-history' />
               </Button>

               <TimerUsers data={usersTimes} type='button' onClick={getTimes} />

               <Menu
                  direction='right'
                  overflow='auto'
                  position='anchor'
                  menuButton={
                     <MenuButton className='text-slate-700 hover:bg-zinc-200 rounded-lg h-9 px-2.5 transition duration-500 relative'>
                        <span
                           className={`h-4 min-w-[16px] bg-red-400 text-white rounded-full 
                              absolute top-0 right-0 text-xs ${
                                 notify.length < 1 && 'hidden'
                              }
                           `}>
                           {notify.length}
                        </span>
                        <i className='fas fa-bell' />
                     </MenuButton>
                  }>
                  {notify.length > 0 ? (
                     notify.map((noti, i) => (
                        <MenuItem
                           key={noti.id_nota}
                           className='text-transparent hover:text-slate-800 flex items-center justify-between'>
                           <MenuContent content={noti} />
                           <Button
                              className='outline-none focus:outline-none hover:text-red-500'
                              type='icon'
                              icon='fas fa-eye-slash fa-sm'
                              onClick={() =>
                                 markNotifications({ id_nota: noti.id_nota })
                              }
                           />
                        </MenuItem>
                     ))
                  ) : (
                     <MenuItem>No hay notificaciones...</MenuItem>
                  )}
                  <MenuItem
                     disabled={notify.length < 1}
                     className={`flex justify-between items-center ${
                        notify.length > 0 && 'hover:text-red-500'
                     }`}
                     onClick={markNotifications}>
                     Marcar como vistas <i className='fas fa-eye-slash fa-sm' />
                  </MenuItem>
               </Menu>

               <Button hidden onClick={toggleMenu}>
                  <i className='fas fa-history' />
               </Button>

               <Button onClick={toggleMenu}>
                  <i className='fas fa-bars' />
               </Button>
            </section>
         </nav>

         <NavMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
         <SideBar isOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />

         {/* modal new activity */}
         <Modal
            showModal={modal}
            isBlur={false}
            onClose={onCloseModal}
            padding='p-4 md:p-6'
            title='Nueva actividad'>
            <AlertBar validation={validations().isCreate} />
            <div className='grid gap-5'>
               <header className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <aside className='grid gap-1'>
                     <CustomSelect
                        label='proyecto (*)'
                        options={projects}
                        value={options.pr}
                        onChange={option =>
                           setOptions({ ...options, pr: option })
                        }
                     />
                     <CustomSelect
                        label='Sub proyecto'
                        options={
                           options.pr?.value
                              ? subProjects?.filter(
                                   s => s.id === options.pr?.value
                                )
                              : subProjects
                        }
                        value={options.sp}
                        onChange={option =>
                           setOptions({ ...options, sp: option })
                        }
                     />
                     <CustomSelect
                        label='Solicitante (*)'
                        options={users}
                        value={options.us}
                        onChange={option =>
                           setOptions({ ...options, us: option })
                        }
                     />
                     <CustomSelect
                        label='encargado (*)'
                        options={users}
                        value={options.ue}
                        onChange={option =>
                           setOptions({ ...options, ue: option })
                        }
                     />
                     <CustomSelect
                        label='revisor'
                        options={users}
                        value={options.ur}
                        onChange={option =>
                           setOptions({ ...options, ur: option })
                        }
                     />
                  </aside>

                  <aside className='mt-0.5'>
                     <Input
                        field='titulo (*)'
                        name='title'
                        value={title}
                        onChange={onChangeValues}
                     />
                     <Input
                        field='ticket'
                        name='ticket'
                        value={ticket}
                        onChange={onChangeValues}
                        isNumber
                     />
                     <Input
                        field='prioridad (*)'
                        name='priority'
                        value={priority}
                        onChange={onChangeValues}
                        isNumber
                     />
                     <Input
                        field='T. estimado (*)'
                        name='time'
                        isNumber
                        value={time}
                        onChange={onChangeValues}
                     />
                  </aside>
               </header>

               <section className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <TextArea
                     field='descripccion (*)'
                     name='desc'
                     value={desc}
                     onChange={onChangeValues}
                  />
                  <TextArea
                     field='glosa'
                     name='gloss'
                     value={gloss}
                     onChange={onChangeValues}
                  />
               </section>

               <footer className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-10'>
                  <input
                     className='
                        file:rounded-full file:bg-blue-50 file:py-2 file:px-4 file:text-sm
                        file:hover:bg-blue-100 file:text-blue-400 file:border-none
                        file:transition file:duration-500 file:cursor-pointer file:font-semibold
                        text-slate-400 text-sm file:mt-5 max-w-max'
                     type='file'
                     name='file'
                     onChange={e => setFiles(e.target.files[0])}
                  />
                  <div className='place-self-end flex justify-between'>
                     <Button
                        className='text-red-500 hover:bg-red-100'
                        onClick={onCloseModal}>
                        cancelar
                     </Button>
                     <Button
                        disabled={validations().isCreate}
                        className='text-emerald-500 hover:bg-emerald-100 disabled:hover:bg-transparent'
                        onClick={onCreateActivity}>
                        crear actividad
                     </Button>
                  </div>
               </footer>
            </div>
         </Modal>
      </>
   )
}

export default NavBar
