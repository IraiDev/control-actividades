import { useContext, useEffect, useState } from 'react'
import { ActivityContext } from '../../context/ActivityContext'
import { UiContext } from '../../context/UiContext'
import { useLocation } from 'react-router-dom'
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
import Input from './Input'
import TextArea from './TextArea'
import moment from 'moment'
import AlertBar from './AlertBar'
import queryString from 'query-string'
import Select from 'react-select'

const env = process.env.REACT_APP_ENVIOREMENT

const initOptions = {
   pr: { label: 'ninguno', value: null },
   sp: { label: 'ninguno', value: null },
   us: { label: 'ninguno', value: null },
   ue: { label: 'ninguno', value: null },
   ur: { label: 'ninguno', value: null },
}

const { activity, home } = routes

const EnvType = ({ env, isHide = false }) => (
   <>
      {env.length > 0 ? (
         <h5
            className={`text-lg text-red-400 font-semibold ${isHide && 'hidden md:block'
               }`}>
            Serv: {env}
         </h5>
      ) : null}
   </>
)

const MenuContent = ({ content }) => {

   const {
      saveFilters,
      setPager,
      pager
   } = useContext(ActivityContext)

   const onFilter = () => {

      setPager({ ...pager, page: 1 })
      saveFilters({ payload: { id_actividad: content.id_det, offset: 0, } })
   }

   return (
      <div
         className='grid text-transparent hover:text-zinc-700 w-80 py-2'
         onClick={onFilter}
      >

         <section className='grid grid-cols-3 gap-2 text-zinc-700'>

            <span className='text-sm truncate col-span-2'>
               <strong>ID: {content.id_det}</strong>
            </span>

            <span className='text-xs text-zinc-500/80'>
               {moment(content.fecha_hora_tx).format('DD/MM/yyyy, HH:mm')}
            </span>

         </section>

         <section className='grid grid-cols-3 gap-2 mb-2 text-zinc-700'>

            <span className='text-xs col-span-2'>
               <strong>Lugar:</strong> {content.lugar}
            </span>

            <span className='text-xs'>
               <strong>Por:</strong> {content.abrev_user_crea}
            </span>

         </section>

         <h5 className='text-xs font-bold text-zinc-700'>Descipción</h5>

         <p className='text-xs text-zinc-500/80'>{content.descripcion}</p>

      </div>
   )
}

const CloneSelect = ({ options, value, onChange, field, isRequired = false, isDefaultOptions = true }) => {
   return (
      <div className='capitalize text-xs mb-2'>
         <span className='flex gap-2 items-baseline font-semibold text-sm px-2 w-max mb-2 py-0.5 bg-amber-200/80 rounded-md'>
            {field}
            {isRequired && <span className='text-red-600 font-semibold'>(*)</span>}
         </span>

         <Select
            maxMenuHeight={170}
            className='capitalize text-sm'
            placeholder='Seleccione'
            options={isDefaultOptions ? [{ value: null, label: 'ninguna' }].concat(options) : options}
            value={value}
            onChange={onChange}
         />
      </div>
   )
}

const NavBar = () => {
   const { saveFilters, filters, optionsArray, pager, setPager } = useContext(ActivityContext)
   const { view } = useContext(UiContext)

   const { notify, markNotifications, fetchNotify } = useNotify()
   const { cloneActivity: createActivity } = useDetail(null)
   const { pathname, search } = useLocation()
   const { title_list = '', icon_list = '' } = queryString.parse(search)
   const [usersTimes, setUsersTimes] = useState([])

   const [isMenuOpen, toggleMenu] = useToggle(null)
   const [isSideBarOpen, toggleSideBar] = useToggle(null)
   const [modal, toggleModal] = useState(false)

   const [files, setFiles] = useState(null)
   const [options, setOptions] = useState(initOptions)
   const [
      { title, priority, time, desc, gloss },
      onChangeValues,
      reset,
   ] = useForm({
      title: '',
      priority: '150',
      time: '1',
      desc: '',
      gloss: '',
   })

   const { projects, subProjects, users } = optionsArray

   const validations = () => {

      const vTitle = title.trim() === ''
      const vDesc = desc.trim() === ''
      const vPriority = priority.trim() === ''
      const vTime = time.trim() === ''
      const vPr = options.pr.value === null
      const vUs = options.us.value === null
      const vUe = options.ue.value === null
      const vUr = options.ur.value === null
      const vUrDisUe = options.ur.id === options.ue.id

      const onCreateValidation = vTitle || vDesc || vTime || vPriority || vPr || vUs || vUe || vUr || vUrDisUe

      const arrlabel = [
         { label: 'Título', value: vTitle },
         { label: 'Descripción', value: vDesc },
         { label: 'Prioridad', value: vPriority },
         { label: 'Tiempo', value: vTime },
         { label: 'Proyecto', value: vPr },
         { label: 'Solicita', value: vUs },
         { label: 'Encargado', value: vUe },
         { label: 'Revisor', value: vUr }
      ]

      const filter = arrlabel.filter(item => item.value)

      return { isCreate: onCreateValidation, saveValue: filter, }
   }

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
      formData.append('ticket', 0)
      formData.append('tiempo_estimado', time)
      formData.append('titulo', title)
      formData.append('descripcion', desc)
      formData.append('glosa', gloss)
      files !== null && formData.append('archivos', files)

      const ok = await createActivity(formData)
      if (!ok) return
      onCloseModal()
      saveFilters({
         payload: {
            offset: 0,
            reload: !filters.reload,
         },
      })
   }

   const onCloseModal = () => {
      reset()
      toggleModal(false)
      setOptions(initOptions)
      setFiles(null)
   }

   const handleToggleShowActivities = () => {
      saveFilters({
         payload: {
            entrabajo: filters.entrabajo === 2 ? '' : 2,
            offset: 0,
         },
      })
      setPager({ ...pager, page: 1 })
      getTimes()
   }

   const handleRefresh = () => {
      getTimes()
      fetchNotify()

      if (pathname === activity || pathname === home) {
         saveFilters({
            payload: {
               reload: !filters.reload,
            },
         })
      }

   }

   const handleOnlyFathers = () => {
      getTimes()
      fetchNotify()

      if (pathname === activity || pathname === home) {
         saveFilters({
            payload: {
               solo_padres: !filters.solo_padres,
               offset: 0,
            },
         })

         setPager({ ...pager, page: 1 })
      }

   }

   useEffect(() => {
      getTimes()
   }, [])

   return (
      <>
         <nav className='flex items-center justify-between bg-white shadow border h-16 px-2 lg:px-10 sticky z-20 top-0 text-slate-700'>
            {pathname === activity || pathname === home ?
               <>
                  {view ?
                     <Button
                        className='bg-zinc-100 hover:bg-zinc-200'
                        isShadow
                        onClick={toggleSideBar}
                     >
                        Filtros <i className='fas fa-filter' />
                     </Button>
                     : <span />
                  }
               </>
               :
               <section className='font-semibold flex gap-2 items-baseline'>
                  <i className={icon_list} />
                  <h1>{title_list}</h1>
               </section>
            }

            <EnvType env={env} />

            <TimerUsers data={usersTimes} />

            <EnvType env={env} isHide />

            <section className='bg-zinc-100 rounded-lg p-1 flex items-center'>
               <Button
                  hidden={pathname !== activity && pathname !== home}
                  title='Nueva actividad'
                  onClick={() => toggleModal(true)}
               >
                  <i className='fas fa-plus' />
               </Button>

               <Button
                  hidden={pathname !== activity && pathname !== home}
                  title='Solo padres'
                  className={
                     filters.solo_padres
                        ? ' text-blue-500'
                        : ' text-slate-700' && ' hover:bg-zinc-200'
                  }
                  onClick={handleOnlyFathers}
               >
                  <i className='fas fa-hat-cowboy' />
               </Button>

               <Button
                  hidden={pathname !== activity && pathname !== home}
                  className={
                     filters.entrabajo === 2
                        ? ' text-blue-500'
                        : ' text-slate-700' && ' hover:bg-zinc-200'
                  }
                  onClick={handleToggleShowActivities}
               >
                  <i className='fas fa-user-clock' />
               </Button>

               <Button
                  hidden={pathname !== activity && pathname !== home}
                  className='hover:bg-zinc-200 hidden md:block'
                  title='Actualizar'
                  onClick={handleRefresh}
               >
                  <i className='fas fa-history' />
               </Button>

               <TimerUsers data={usersTimes} type='button' onClick={getTimes} />

               <Menu
                  direction='bottom'
                  overflow='auto'
                  position='auto'
                  menuButton={

                     <MenuButton className='text-slate-700 hover:bg-zinc-200 rounded-lg h-9 px-2.5 transition duration-500 relative'>
                        <span
                           className={`
                              h-[18px] w-[18px] bg-red-400 text-white rounded-full 
                              absolute top-0 right-0 text-xs flex justify-center items-center
                              ${notify.length < 1 && 'hidden'}
                        `}>
                           {notify.length > 9 ? '+9' : notify.length}
                        </span>
                        <i className='fas fa-bell' />
                     </MenuButton>

                  }>

                  {notify.length > 0 ?
                     notify.map((noti, i) => (

                        <MenuItem

                           key={noti.id_notificacion}
                           className={`
                              text-transparent hover:text-slate-800 hover:bg-zinc-200/80 relative px-4
                              ${i % 2 === 0 && 'bg-zinc-100'}
                           `}
                        >

                           <MenuContent content={noti} />

                           <Button
                              className='hover:text-red-500 absolute top-7 right-2'
                              onClick={() => markNotifications({ id_notificacion: noti.id_notificacion })}
                           >
                              <i className='fas fa-eye-slash fa-sm' />
                           </Button>

                        </MenuItem>

                     ))
                     : <MenuItem>No hay notificaciones...</MenuItem>
                  }

                  <MenuItem
                     disabled={notify.length < 1}
                     className={`flex justify-between items-center space-x-2 pl-4
                        ${notify.length > 0 && 'hover:text-red-500'}
                     `}
                     onClick={markNotifications}
                  >
                     Marcar como vistas
                     <i className='fas fa-eye-slash fa-sm' />
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

            <AlertBar
               validation={validations().isCreate}
               isCustom={options?.ur?.id !== options?.ue?.id}
               customMsg='Revisor y Encargado no pueden ser asignados a la misma persona'
               fields={validations().saveValue}
            />

            <div className='grid gap-5'>

               <header className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <aside className='grid gap-1'>

                     <CloneSelect
                        isRequired
                        field='proyecto'
                        options={projects}
                        value={options.pr}
                        onChange={option =>
                           setOptions({ ...options, pr: option })
                        }
                     />
                     <CloneSelect
                        field='Sub proyecto'
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
                     <CloneSelect
                        isRequired
                        field='Solicita'
                        options={users}
                        value={options.us}
                        onChange={option =>
                           setOptions({ ...options, us: option })
                        }
                     />
                     <CloneSelect
                        isRequired
                        field='Encargado'
                        options={users}
                        value={options.ue}
                        onChange={option =>
                           setOptions({ ...options, ue: option })
                        }
                     />
                     <CloneSelect
                        isRequired
                        field='Revisor'
                        options={users}
                        value={options.ur}
                        onChange={option =>
                           setOptions({ ...options, ur: option })
                        }
                     />
                  </aside>

                  <aside className='mt-0.5'>
                     <Input
                        className='mb-3'
                        highlight
                        isRequired
                        field='titulo'
                        name='title'
                        value={title}
                        onChange={onChangeValues}
                     />

                     <Input
                        className='mb-3'
                        highlight
                        isRequired
                        field='T. estimado'
                        name='time'
                        isNumber
                        value={time}
                        onChange={onChangeValues}
                     />

                     <Input
                        className='mb-3'
                        highlight
                        isRequired
                        field='prioridad'
                        name='priority'
                        value={priority}
                        onChange={onChangeValues}
                        isNumber
                     />

                  </aside>
               </header>

               <section className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <TextArea
                     highlight
                     isRequired
                     field='descripción'
                     name='desc'
                     value={desc}
                     onChange={onChangeValues}
                  />
                  <TextArea
                     highlight
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
