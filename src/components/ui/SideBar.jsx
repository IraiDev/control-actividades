import { useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ActivityContext } from '../../context/ActivityContext'
import { routes } from '../../types/types'
import { useForm } from '../../hooks/useForm'
import Button from './Button'
import InputFilter from '../filter/InputFilter'
import SelectFilter from '../filter/SelectFilter'

const { home, activity } = routes

const SideBar = ({ isOpen, toggleSideBar }) => {
   const { pathname } = useLocation()

   const { 
      optionsArray, 
      saveFilters, 
      setOrder, 
      order, 
      setPager, 
      pager 
   } = useContext(ActivityContext)
   
   const [userCheck, setUserCheck] = useState(false)
   
   const [options, setOptions] = useState({})
   const [{ 
      id, 
      title, 
      numPriority, 
      ticket, 
      desc 
   }, onChangeValues, reset] = useForm({
      id: '',
      title: '',
      numPriority: '',
      desc: '',
      ticket: ''
   })

   const { projects, subProjects, users, status, priorities } = optionsArray

   const onFilter = () => {
      const filters = {
         estado: options.st?.value || '',
         proyecto:
            options.pr?.length > 0 ? options.pr.map(item => item.value) : [],
         encargado:
            options.ue?.length > 0 ? options.ue.map(item => item.label) : [],
         solicitante:
            options.us?.length > 0 ? options.us.map(item => item.label) : [],
         revisor: 
            options.ur?.length > 0 ? options.ur.map(item => item.id) : [],
         subProy:
            options.sp?.length > 0 ? options.sp.map(item => item.value) : [],
         color: options.pi?.value || '',
         id_actividad: id,
         titulo: title,
         numero_ticket:ticket,
         descripcion: desc,
         prioridad_ra: numPriority,
         offset: 0,
      }

      setPager({ ...pager, page: 1 })

      saveFilters({ payload: filters })
   }

   const onClear = () => {
      saveFilters({ reset: true })
      setOptions({
         st: '',
         pr: [],
         ue: [],
         us: [],
         ur: [],
         sp: [],
         pi: '',
      })
      reset()
      setUserCheck(false)
      setOrder({})
   }

   const setActive = ({ param, value }) => {
      const k = Object.keys(order).some(k => k === param)
      const v = Object.values(order).some(v => v === value)
      return k && v
   }

   return (
      <nav
         className={`
         fixed top-0 left-0 border bg-white shadow-lg h-screen w-[310px]
         animate__animated animate__faster z-30 overflow-custom
         ${
            pathname !== activity &&
            pathname !== home &&
            'animate__slideOutLeft'
         }
         ${isOpen === null && 'hidden'}
         ${isOpen ? 'animate__slideInLeft' : 'animate__slideOutLeft'}
         `}>
         <header className='flex items-center justify-between p-5'>
            <h1 className='capitalize text-gray-500'>Filtros</h1>
            <Button onClick={toggleSideBar} className='hover:bg-zinc-100'>
               <i className='fas fa-times' />
            </Button>
         </header>

         <section>
            <InputFilter
               isNumber
               field='ID'
               name='id'
               value={id}
               onChange={onChangeValues}
               filterDown={() => setOrder({ orden_id: 'desc' })}
               filterUp={() => setOrder({ orden_id: 'asc' })}
               upActive={setActive({ param: 'orden_id', value: 'asc' })}
               downActive={setActive({ param: 'orden_id', value: 'desc' })}
            />

            <InputFilter
               field='ticket'
               name='ticket'
               value={ticket}
               onChange={onChangeValues}
               filterDown={() => setOrder({ orden_ticket: 'desc' })}
               filterUp={() => setOrder({ orden_ticket: 'asc' })}
               upActive={setActive({
                  param: 'orden_ticket',
                  value: 'asc',
               })}
               downActive={setActive({
                  param: 'orden_ticket',
                  value: 'desc',
               })}
            />

            <InputFilter
               field='titulo'
               name='title'
               value={title}
               onChange={onChangeValues}
               filterDown={() => setOrder({ orden_actividad: 'desc' })}
               filterUp={() => setOrder({ orden_actividad: 'asc' })}
               upActive={setActive({ param: 'orden_actividad', value: 'asc' })}
               downActive={setActive({
                  param: 'orden_actividad',
                  value: 'desc',
               })}
            />

            <InputFilter
               field='descripción'
               name='desc'
               value={desc}
               onChange={onChangeValues}
               filterDown={() => setOrder({ orden_descripcion: 'desc' })}
               filterUp={() => setOrder({ orden_descripcion: 'asc' })}
               upActive={setActive({
                  param: 'orden_descripcion',
                  value: 'asc',
               })}
               downActive={setActive({
                  param: 'orden_descripcion',
                  value: 'desc',
               })}
            />

            <InputFilter
               field='prioridad (RA)'
               name='numPriority'
               value={numPriority}
               onChange={onChangeValues}
               filterDown={() => setOrder({ orden_prioridad_ra: 'desc' })}
               filterUp={() => setOrder({ orden_prioridad_ra: 'asc' })}
               upActive={setActive({
                  param: 'orden_prioridad_ra',
                  value: 'asc',
               })}
               downActive={setActive({
                  param: 'orden_prioridad_ra',
                  value: 'desc',
               })}
            />
         </section>

         <hr className='mx-3 my-4' />

         <section className='grid gap-3'>

            <SelectFilter
               value={options.us}
               options={users}
               field='solicitante'
               isMulti
               onChange={option => setOptions({ ...options, us: option })}
               filterDown={() => setOrder({ orden_solicitante: 'desc' })}
               filterUp={() => setOrder({ orden_solicitante: 'asc' })}
               upActive={setActive({
                  param: 'orden_solicitante',
                  value: 'asc',
               })}
               downActive={setActive({
                  param: 'orden_solicitante',
                  value: 'desc',
               })}
            />

            <SelectFilter
               value={options.ue}
               options={users}
               field='encargado'
               isMulti
               onChange={option => setOptions({ ...options, ue: option })}
               filterDown={() => setOrder({ orden_encargado: 'desc' })}
               filterUp={() => setOrder({ orden_encargado: 'asc' })}
               upActive={setActive({ param: 'orden_encargado', value: 'asc' })}
               downActive={setActive({
                  param: 'orden_encargado',
                  value: 'desc',
               })}
            />
            <SelectFilter
               value={options.ur}
               options={users}
               field='revisor'
               isMulti
               onChange={option => setOptions({ ...options, ur: option })}
               filterDown={() => setOrder({ orden_revisor: 'desc' })}
               filterUp={() => setOrder({ orden_revisor: 'asc' })}
               upActive={setActive({
                  param: 'orden_revisor',
                  value: 'asc',
               })}
               downActive={setActive({
                  param: 'orden_revisor',
                  value: 'desc',
               })}
            />

            <SelectFilter
               value={options.pi}
               options={priorities}
               field='prioridad (to-do)'
               onChange={option => setOptions({ ...options, pi: option })}
               filterDown={() => setOrder({ orden_prioridad: 'desc' })}
               filterUp={() => setOrder({ orden_prioridad: 'asc' })}
               upActive={setActive({ param: 'orden_prioridad', value: 'asc' })}
               downActive={setActive({
                  param: 'orden_prioridad',
                  value: 'desc',
               })}
            />
            <SelectFilter
               value={options.st}
               options={status?.filter(s => s.value === 2 || s.value === 1)}
               field='estado'
               onChange={option => setOptions({ ...options, st: option })}
               filterDown={() => setOrder({ orden_estado: 'desc' })}
               filterUp={() => setOrder({ orden_estado: 'asc' })}
               upActive={setActive({ param: 'orden_estado', value: 'asc' })}
               downActive={setActive({ param: 'orden_estado', value: 'desc' })}
            />
            <SelectFilter
               value={options.pr}
               options={projects}
               field='proyecto'
               isMulti
               onChange={option => setOptions({ ...options, pr: option })}
               filterDown={() => setOrder({ orden_proyecto: 'desc' })}
               filterUp={() => setOrder({ orden_proyecto: 'asc' })}
               upActive={setActive({ param: 'orden_proyecto', value: 'asc' })}
               downActive={setActive({
                  param: 'orden_proyecto',
                  value: 'desc',
               })}
            />
            <SelectFilter
               value={options.sp}
               options={
                  options.pr?.length > 1
                     ? []
                     : options.pr?.length > 0
                     ? subProjects?.filter(s => s.id === options.pr[0]?.value)
                     : subProjects
               }
               field='sub proyecto'
               isMulti
               onChange={option => setOptions({ ...options, sp: option })}
               filterDown={() => setOrder({ orden_sub_proyecto: 'desc' })}
               filterUp={() => setOrder({ orden_sub_proyecto: 'asc' })}
               upActive={setActive({
                  param: 'orden_sub_proyecto',
                  value: 'asc',
               })}
               downActive={setActive({
                  param: 'orden_sub_proyecto',
                  value: 'desc',
               })}
            />
         </section>

         <footer className='pl-5 pr-3 mt-5'>
            <label htmlFor='iduserca' className='w-max cursor-pointer'>
               <input
                  id='iduserca'
                  type='checkbox'
                  className='mr-2 cursor-pointer'
                  checked={userCheck}
                  onChange={e => {
                     const { checked } = e.target
                     if (checked) {
                        setUserCheck(checked)
                        saveFilters({ payload: { usuario_no_mostrar: 'ca' } })
                     } else {
                        setUserCheck(checked)
                        saveFilters({ payload: { usuario_no_mostrar: '' } })
                     }
                  }}
               />
               Ocultar usuario: CA
            </label>
            <div className='flex justify-between mt-5 mb-28 px-4'>
               <Button
                  className='bg-zinc-100 hover:bg-zinc-200'
                  isShadow
                  onClick={onClear}>
                  Limpiar <i className='fas fa-eraser' />
               </Button>
               <Button
                  className='bg-blue-500 hover:bg-blue-600 text-white'
                  isShadow
                  onClick={() => {
                     onFilter()
                     toggleSideBar()
                  }}>
                  filtrar <i className='fas fa-filter' />
               </Button>
            </div>
         </footer>
      </nav>
   )
}

export default SideBar
