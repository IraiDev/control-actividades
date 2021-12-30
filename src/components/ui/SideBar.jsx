import React, { useContext, useState } from 'react'
import Button from './Button'
import { useForm } from '../../hooks/useForm'
import InputFilter from '../filter/InputFilter'
import SelectFilter from '../filter/SelectFilter'
import { ActivityContext } from '../../context/ActivityContext'

const SideBar = ({ isOpen, toggleSideBar }) => {

   const { optionsArray, saveFilters, filters } = useContext(ActivityContext)

   const [options, setOptions] = useState({
      pr: { label: 'todos', value: null },
      sp: { label: 'todos', value: null },
      us: { label: 'todos', value: null },
      ue: { label: 'todos', value: null },
      st: { label: 'todos', value: null },
      pi: { label: 'todos', value: null },
   })
   const [{
      id,
      title,
      numPriority
   }, onChangeValues] = useForm({
      id: '',
      title: '',
      numPriority: ''
   })

   const { projects, subProjects, users, status, priorities } = optionsArray

   const onFilters = () => {

      const filters = {
         options: {
            status: [1, 2, 3],
            projects: [],
            usersE: [],
            usersS: [],
            subProjects: [],
            priorities: [3, 2, 1],
         },
         inputs: {
            id: 'hola',
            title: '',
            numPriority: ''
         }
      }

      saveFilters({ payload: filters })
   }

   console.log('mirando filtros: ', filters)

   return (
      <nav className={`
         fixed top-0 left-0 border bg-white shadow-lg h-screen w-[310px]
         animate__animated animate__faster z-30 overflow-custom
         ${isOpen === null && 'hidden'}
         ${isOpen ? 'animate__slideInLeft' : 'animate__slideOutLeft'}
         `}>
         <header className='flex items-center justify-between p-5'>
            <h1 className='capitalize text-gray-500'>Filtros</h1>
            <Button
               className='rounded-lg hover:bg-slate-200 text-slate-700'
               type='icon'
               icon='fas fa-times'
               onClick={toggleSideBar} />
         </header>
         <section>
            <InputFilter
               isNumber
               field='ID'
               name='id'
               value={id}
               onChange={onChangeValues}
            />
            <InputFilter
               field='titulo'
               name='title'
               value={title}
               onChange={onChangeValues}
            />
            <InputFilter
               field='prioridad (RA)'
               name='numPriority'
               value={numPriority}
               onChange={onChangeValues}
            />
         </section>
         <hr className='mx-3 my-4' />
         <section className='grid gap-3'>
            <SelectFilter
               value={options.ue}
               options={users}
               field='encargado'
               onChange={option => setOptions({ ...options, ue: option })}
            />
            <SelectFilter
               value={options.pi}
               options={priorities}
               field='prioridad (to-do)'
               onChange={option => setOptions({ ...options, pi: option })}
            />
            <SelectFilter
               value={options.st}
               options={status}
               field='estado'
               onChange={option => setOptions({ ...options, st: option })}
            />
            <SelectFilter
               value={options.pr}
               options={projects}
               field='proyecto'
               onChange={option => setOptions({ ...options, pr: option })}
            />
            <SelectFilter
               value={options.sp}
               options={options.pr.value ? subProjects?.filter(s => s.id === options.pr?.value) : subProjects}
               field='sub proyecto'
               onChange={option => setOptions({ ...options, sp: option })}
            />
            <SelectFilter
               value={options.us}
               options={users}
               field='soliccitante'
               onChange={option => setOptions({ ...options, us: option })}
            />
         </section>
         <footer className='pl-5 pr-3 mt-5'>
            <label htmlFor='iduserca' className='block' >
               <input
                  id='iduserca'
                  type='checkbox'
                  className='mr-2'
                  onChange={e => {
                     const { checked } = e.target
                     checked ? console.log('no mostrar ca') : console.log('mostrar ca')
                  }} />
               Ocultar usuario: CA
            </label>
            <div className='flex justify-between mt-5 mb-28'>
               <Button
                  className='rounded-full bg-slate-100 hover:bg-slate-200 hover:shadow-lg
                hover:shadow-slate-400/30 shadow text-slate-700'
                  type='iconText'
                  name='limpiar'
                  icon='fas fa-eraser'
               />
               <Button
                  className='rounded-full bg-blue-500 hover:bg-blue-600 hover:shadow-lg
                hover:shadow-blue-400/40 shadow text-white'
                  type='iconText'
                  name='filtrar'
                  icon='fas fa-filter'
                  onClick={onFilters}
               />
            </div>
         </footer>
      </nav>
   )
}

export default SideBar
