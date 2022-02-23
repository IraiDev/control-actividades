import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
   deleteFetch,
   getFetch,
   postFetch,
   updateFetch,
} from '../helpers/fetchingGraph'
import { useToggle } from '../hooks/useToggle'
import { Alert } from '../helpers/alerts'
import { UiContext } from '../context/UiContext'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import TextArea from '../components/ui/TextArea'
import TodoCard from '../components/card/customCard/TodoCard'
import Container from '../components/ui/Container'
import FloatButton from '../components/ui/FloatButton'

const initForm = {
   title: '',
   desc: '',
   todo_id: null,
}

const Todo = () => {
   const { id } = useParams()
   const { setIsLoading } = useContext(UiContext)
   const [tasks, setTasks] = useState([])
   const [important, toggleImportant] = useToggle(false)
   const [newImportant, setNewImportant] = useState({
      select: false,
      value: 'normal',
   })
   const [showModalTodo, toggleModalTodo] = useToggle(false)
   const [values, setValues] = useState(initForm)

   const { title, desc, todo_id } = values

   const taskFetch = () => {
      getFetch(`/me/todo/lists/${id}/tasks`)
         .then(resp => {
            setTasks(
               important
                  ? resp.value.filter(task => task.importance === 'high')
                  : resp.value
            )
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
         desc: content,
      })
      setNewImportant({
         select: importance === 'high',
         value: importance,
      })
      toggleModalTodo()
   }

   const handleNewTodo = async () => {
      setIsLoading(true)
      const data = {
         title,
         importance: newImportant.value,
         body: { content: desc },
      }
      const ok = await postFetch(`todo/lists/${id}/tasks`, data)
      if (ok) {
         taskFetch()
      } else {
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
         body: { content: desc },
      }
      const endPoint = `todo/lists/${id}/tasks/${todo_id}`
      const ok = await updateFetch(endPoint, data)
      if (ok) {
         taskFetch()
      } else {
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
         if (ok) {
            taskFetch()
         } else {
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
         action,
      })
   }

   useEffect(() => {
      setIsLoading(true)
      setTasks([])
      taskFetch()
      // eslint-disable-next-line
   }, [id, important])

   return (
      <main className='relative'>
         <Container>
            {tasks.length > 0 ? (
               tasks.map(task => (
                  <TodoCard
                     key={task.id}
                     editTodo={() =>
                        openModalUpdateTodo({
                           idTodo: task.id,
                           title: task.title,
                           content: task.body.content,
                           importance: task.importance,
                        })
                     }
                     deleteTodo={() =>
                        handleDeleteTodo({
                           idTodo: task.id,
                           title: task.title,
                        })
                     }
                     {...task}
                  />
               ))
            ) : (
               <span className='text-center col-span-4 text-slate-400'>
                  No hay to-dos...
               </span>
            )}
         </Container>

         <FloatButton
            className={
               important
                  ? 'bg-yellow-500 hover:bg-yellow-400 text-white'
                  : 'bg-white hover:bg-zinc-100 text-slate-700'
            }
            tooltip={important ? 'Mostrar todos' : 'Mostrar importantes'}
            size='h-10 w-10'
            position='bottom-32 right-8'
            onClick={toggleImportant}>
            <i className='fas fa-star' />
         </FloatButton>

         <FloatButton onClick={toggleModalTodo} tooltip='nuevo to-do'>
            <i className='fas fa-plus' />
         </FloatButton>

         {/* modal new/update to-do */}
         <Modal
            showModal={showModalTodo}
            onClose={closeModalTodo}
            isBlur={false}
            className='max-w-2xl text-sm'
            padding='p-4 md:p-6'
            title={todo_id ? 'Actualizar to-do' : 'Nuevo to-do'}>
            <div className='grid gap-6'>
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
                           e.target.checked
                              ? setNewImportant({
                                   select: e.target.checked,
                                   value: 'high',
                                })
                              : setNewImportant({
                                   select: e.target.checked,
                                   value: 'normal',
                                })
                        }}
                     />
                     <i
                        className={`
                        transition duration-500 cursor-pointer fa-lg hover:text-yellow-400
                        ${
                           newImportant.select
                              ? 'fas fa-star text-yellow-500'
                              : 'far fa-star'
                        }
                     `}></i>
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
                     className='text-blue-500 hover:bg-blue-100 place-self-end'
                     type='submit'
                     onClick={todo_id ? handleUpdateTodo : handleNewTodo}>
                     {todo_id ? 'actualizar to-do' : 'crear to-do'}
                  </Button>
               </footer>
            </div>
         </Modal>
      </main>
   )
}

export default Todo
