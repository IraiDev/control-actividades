import { useContext, useEffect, useState } from 'react'
import { getFetch, updateFetchTask } from '../helpers/fetchingGraph'
import { ActivityContext } from '../context/ActivityContext'
import { UiContext } from '../context/UiContext'
import { Alert } from '../helpers/alerts'
import PlannerCard from '../components/card/customCard/PlannerCard'

const CheckBox = ({ state, id, onChange, name }) => (
  <label
    className={`flex items-center gap-3 capitalize cursor-pointer ${
      state && 'text-blue-400'
    }`}
    htmlFor={id}
  >
    <input
      id={id}
      className='cursor-pointer'
      type='checkbox'
      checked={state}
      onChange={onChange}
    />
    {name}
  </label>
)

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

      setTasks(
        tasks.map(task => {
          if (task.id === idTask) {
            task.percentComplete = 50
          }
          return task
        })
      )

      await updateFetchTask(
        `planner/tasks/${idTask}`,
        { percentComplete: 50 },
        decodeURIComponent(Object.values(etag)[0])
      )
    }
    Alert({
      title: 'Crear Actividad',
      content:
        '¿Desea crear esta tarea como una actividad en el <b>Registro de Avance</b>?',
      cancelText: 'No, cancelar',
      confirmText: 'Si, crear',
      action,
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
      <header className='grid grid-cols-2 md:grid-cols-3 md:place-items-center bg-white p-4 m-2 rounded-lg border shadow-lg'>
        <CheckBox
          state={penddig}
          id='pending-id'
          name='Pendientes'
          onChange={() => {
            setIsLoading(true)
            setPenddig(!penddig)
            setAtwork(false)
            setComplete(false)
            setTimeout(() => {
              setIsLoading(false)
            }, [1000])
          }}
        />
        <CheckBox
          state={atWork}
          id='atWork-id'
          name='En trabajo'
          onChange={() => {
            setIsLoading(true)
            setPenddig(false)
            setAtwork(!atWork)
            setComplete(false)
            setTimeout(() => {
              setIsLoading(false)
            }, [1000])
          }}
        />
        <CheckBox
          state={complete}
          id='complete-id'
          name='Completadas'
          onChange={() => {
            setIsLoading(true)
            setPenddig(false)
            setAtwork(false)
            setComplete(!complete)
            setTimeout(() => {
              setIsLoading(false)
            }, [1000])
          }}
        />
      </header>
      <section
        className='
            grid gap-4 container mx-auto pb-10 px-2
            grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      >
        {tasks.length > 0 ? (
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
                  {...task}
                />
              )
            } else {
              return null
            }
          })
        ) : (
          <div className='text-center col-span-4 text-slate-400'>
            No hay tareas...
          </div>
        )}
      </section>
    </>
  )
}

export default Planner
