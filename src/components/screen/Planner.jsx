import { useContext, useEffect, useState } from 'react'
import { getFetch, updateFetchTask } from '../../helpers/fetchingGraph'
import { ActivityContext } from '../../context/ActivityContext'
import { UiContext } from '../../context/UiContext'
import { Alert } from '../../helpers/alerts'
import PlannerCard from '../card/PlannerCard'

const Planner = () => {
   const { addTaskToRA } = useContext(ActivityContext)
   const { setIsLoading } = useContext(UiContext)
   const [penddig, setPenddig] = useState(true)
   const [atWork, setAtwork] = useState(false)
   const [complete, setComplete] = useState(false)
   const [tasks, setTasks] = useState([])
   const [percentComplete, setPercentComplete] = useState(0)

   const handleAddTask = ({ title, description, idTask, plan, etag }) => {

      const action = async () => {

         const data = { title, description, id_todo: idTask, proyect: plan }
         const resp = await addTaskToRA(data)

         if (!resp) return

         setTasks(tasks.map(task => {
            if (task.id === idTask) {
               task.percentComplete = 50
            }
            return task
         }))

         await updateFetchTask(
            `planner/tasks/${idTask}`,
            { percentComplete: 50 },
            decodeURIComponent(Object.values(etag)[0])
         )

      }
      Alert({
         title: 'Crear Actividad',
         content: '¿Desea crear esta tarea como una actividad en el <b>Registro de Avance</b>?',
         cancelText: 'No, cancelar',
         confirmText: 'Si, crear',
         action
      })
   }

   useEffect(() => {
      setIsLoading(true)
      const getPlannerTask = () => {
         getFetch('/me/planner/tasks', '', 'details')
            .then(resp => {
               setTasks(resp.value)
               setIsLoading(false)
            })
            .catch(err => {
               console.log(err)
               setIsLoading(false)
            })
      }
      getPlannerTask()
      // eslint-disable-next-line
   }, [])

   useEffect(() => {
      if (!penddig && !atWork && !complete) {
         setPenddig(true)
         setPercentComplete(0)
      }
      penddig && setPercentComplete(0)
      atWork && setPercentComplete(50)
      complete && setPercentComplete(100)
      return null
   }, [penddig, atWork, complete])

   return (
      <>
         <header className='flex items-center justify-around bg-white p-4 m-5 rounded-lg border shadow-lg'>
            <label
               className={`flex items-center gap-3 capitalize cursor-pointer ${penddig && 'text-blue-400'}`}
               htmlFor="penddig">
               <input
                  id='penddig'
                  className='cursor-pointer'
                  type="checkbox"
                  checked={penddig}
                  onChange={() => {
                     setIsLoading(true)
                     setPenddig(!penddig)
                     setAtwork(false)
                     setComplete(false)
                     setTimeout(() => {
                        setIsLoading(false)
                     }, [1000])
                  }} />
               Pendientes
            </label>
            <label
               className={`flex items-center gap-3 capitalize cursor-pointer ${atWork && 'text-blue-400'}`}
               htmlFor="atWork">
               <input
                  id='atWork'
                  className='cursor-pointer'
                  type="checkbox"
                  checked={atWork}
                  onChange={() => {
                     setIsLoading(true)
                     setAtwork(!atWork)
                     setPenddig(false)
                     setComplete(false)
                     setTimeout(() => {
                        setIsLoading(false)
                     }, [1000])
                  }} />
               en trabajo
            </label>
            <label
               className={`flex items-center gap-3 capitalize cursor-pointer ${complete && 'text-blue-400'}`}
               htmlFor="complete">
               <input
                  id='complete'
                  className='cursor-pointer'
                  type="checkbox"
                  checked={complete}
                  onChange={() => {
                     setIsLoading(true)
                     setComplete(!complete)
                     setPenddig(false)
                     setAtwork(false)
                     setTimeout(() => {
                        setIsLoading(false)
                     }, [1000])
                  }} />
               completadas
            </label>
         </header>
         <section className='
            grid gap-4 pb-5 container mx-auto
            grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
         >
            {
               tasks.length > 0 ?
                  tasks.map(task => {
                     if (percentComplete === task.percentComplete) {
                        return (
                           <PlannerCard
                              onAddTask={handleAddTask}
                              key={task.id}
                              etag={task}
                              references={task.details.references}
                              description={task.details.description}
                              checklist={task.details.checklist}
                              {...task} />
                        )
                     }
                     else {
                        return null
                     }
                  }) : <div className='text-center col-span-4 text-slate-400'>No hay tareas...</div>
            }
         </section>
      </>
   )
}

export default Planner
