import { useContext, useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { deleteFetch, getFetch, postFetch, updateFetch } from '../../helpers/fetchingGraph'
import { useToggle } from '../../hooks/useToggle'
import { Alert } from '../../helpers/alerts'
import { UiContext } from '../../context/UiContext'
import queryString from 'query-string'
import TodoCard from '../card/TodoCard'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import TextArea from '../ui/TextArea'

const initForm = {
   title: '',
   desc: '',
   todo_id: null,
}

const Todo = () => {
   const { id } = useParams()
   const { search } = useLocation()
   const { title_list = '', icon_list = '' } = queryString.parse(search)
   const { setIsLoading } = useContext(UiContext)
   const [tasks, setTasks] = useState([])
   const [important, setImportant] = useState({ select: false, value: '' })
   const [newImportant, setNewImportant] = useState({ select: false, value: 'normal' })
   const [showModalTodo, toggleModalTodo] = useToggle(false)
   const [values, setValues] = useState(initForm)

   const { title, desc, todo_id } = values

   const taskFetch = () => {
      getFetch(`/me/todo/lists/${id}/tasks`)
         .then(resp => {
            setTasks(resp.value)
            setIsLoading(false)
         })
         .catch(err => {
            console.log(err)
            setIsLoading(false)
         })
   }

   const closeModalTodo = () => {
      setNewImportant({ select: false, value: 'normal' })
      toggleModalTodo()
      setValues(initForm)
   }

   const openModalUpdateTodo = ({ idTodo, title, content, importance }) => {
      setValues({
         todo_id: idTodo,
         title,
         desc: content
      })
      setNewImportant({
         select: importance === 'high',
         value: importance
      })
      toggleModalTodo()
   }

   const handleNewTodo = async () => {
      setIsLoading(true)
      const data = {
         title,
         importance: newImportant.value,
         body: { content: desc }
      }
      const ok = await postFetch(`todo/lists/${id}/tasks`, data)
      if (ok) { taskFetch() }
      else {
         Alert({
            title: 'Error',
            icon: 'error',
            content: 'error al crear la to-do',
            showCancelButton: false,
         })
         setIsLoading(false)
      }
      closeModalTodo()
   }

   const handleUpdateTodo = async () => {
      setIsLoading(true)
      const data = {
         title,
         importance: newImportant.value,
         body: { content: desc }
      }
      const endPoint = `todo/lists/${id}/tasks/${todo_id}`
      const ok = await updateFetch(endPoint, data)
      if (ok) { taskFetch() }
      else {
         Alert({
            title: 'Error',
            icon: 'error',
            content: 'error al actualizar la to-do',
            showCancelButton: false,
         })
         setIsLoading(false)
      }
      closeModalTodo()
   }

   const handleDeleteTodo = ({ idTodo, title }) => {
      const action = async () => {
         setIsLoading(true)
         const endPoint = `todo/lists/${id}/tasks/${idTodo}`
         const ok = await deleteFetch(endPoint)
         if (ok) { taskFetch() }
         else {
            Alert({
               title: 'Error',
               icon: 'error',
               content: 'error al eliminar la to-do',
               showCancelButton: false,
            })
            setIsLoading(false)
         }
      }

      Alert({
         title: 'Eliminar to-do',
         icon: 'warning',
         content: `¿Estás seguro de eliminar el siguiente to-do: <strong>${title}?</strong>`,
         cancelButton: 'No, cancelar',
         confirmButton: 'Si, eliminar',
         action
      })
   }

   useEffect(() => {
      setIsLoading(true)
      setTasks([])
      taskFetch()
      // eslint-disable-next-line
   }, [id])

   return (
      <>
         <header
            className='flex items-center justify-between bg-white p-4 m-5 rounded-lg border shadow-lg'
         >
            <div className='flex items-center gap-2'>
               <h1 className='text-lg font-semibold text-gray-800'>
                  <i className={icon_list}></i> {title_list}
               </h1>
               <label htmlFor='importance'>
                  <input
                     className='hidden'
                     type='checkbox'
                     id='importance'
                     checked={important.select}
                     onChange={e => {
                        e.target.checked ? setImportant({ select: e.target.checked, value: 'high' })
                           : setImportant({ select: e.target.checked, value: '' })
                     }} />
                  <i className={`
                     transition duration-500 cursor-pointer fa-lg hover:text-yellow-400
                      ${important.select ? 'fas fa-star text-yellow-500' : 'far fa-star'}
                  `}
                  ></i>
               </label>
            </div>
            <Button
               className='bg-blue-400 hover:bg-blue-500 text-white rounded-full'
               name='nuevo to-do'
               onClick={toggleModalTodo}
            />
         </header>
         <section
            className='grid gap-4 px-10 pb-5 2xl:mx-36
            grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
         '>
            {
               tasks.length > 0 ?
                  tasks.map(task => {
                     let condition
                     if (important.select) condition = task.importance === important.value
                     else condition = true
                     if (condition) {
                        return (
                           <TodoCard
                              key={task.id}
                              editTodo={() => openModalUpdateTodo({
                                 idTodo: task.id,
                                 title: task.title,
                                 content: task.body.content,
                                 importance: task.importance
                              })}
                              deleteTodo={() => handleDeleteTodo({ idTodo: task.id, title: task.title })}
                              {...task} />
                        )
                     }
                     else {
                        return null
                     }
                  }) : <div className='text-center col-span-4 text-slate-400'>No hay to-dos...</div>
            }
         </section>

         {/* modal new/update to-do */}
         <Modal showModal={showModalTodo} onClose={closeModalTodo} isBlur={false}
            className='max-w-2xl text-sm' padding='p-7'
         >
            <div className='grid gap-6'>
               <h1 className='text-lg font-semibold'>
                  {todo_id ? 'Actualizar to-do' : 'Nuevo to-do'}
               </h1>
               <section className='flex items-center justify-between gap-4'>
                  <Input
                     className='w-full'
                     field='titulo'
                     value={title}
                     onChange={e => {
                        setValues({ ...values, title: e.target.value })
                     }}
                  />
                  <label htmlFor='newImprotant' className='pt-6'>
                     <input
                        className='hidden'
                        type='checkbox'
                        id='newImprotant'
                        checked={newImportant.select}
                        onChange={e => {
                           e.target.checked ? setNewImportant({ select: e.target.checked, value: 'high' })
                              : setNewImportant({ select: e.target.checked, value: 'normal' })
                        }} />
                     <i className={`
                        transition duration-500 cursor-pointer fa-lg hover:text-yellow-400
                        ${newImportant.select ? 'fas fa-star text-yellow-500' : 'far fa-star'}
                     `}>
                     </i>
                  </label>
               </section>
               <TextArea
                  field='descripcion'
                  value={desc}
                  onChange={e => {
                     setValues({ ...values, desc: e.target.value })
                  }}
               />
               <footer className='grid place-self-end'>
                  <Button
                     className='w-max text-blue-500 hover:bg-blue-100 rounded-full text-base place-self-end'
                     type='submit'
                     name={todo_id ? 'actualizar to-do' : 'crear to-do'}
                     onClick={todo_id ? handleUpdateTodo : handleNewTodo}
                  />
               </footer>
            </div>
         </Modal>

      </>
   )
}

export default Todo
