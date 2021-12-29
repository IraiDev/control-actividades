import { useEffect, useState } from 'react'
import { Person } from '@microsoft/mgt-react'
import moment from 'moment'
import { getFetch } from '../../helpers/fetchingGraph'
import Button from '../ui/Button'

let state = ''

const PlannerCard = ({
  id,
  planId,
  title,
  description,
  assignments,
  createdBy,
  createdDateTime,
  references,
  percentComplete,
  etag,
  onAddTask
}) => {
  const [plan, setPlan] = useState('')

  switch (percentComplete) {
    case 0:
      state = 'Pendiente'
      break
    case 50:
      state = 'En trabajo'
      break
    case 100:
      state = 'Completada'
      break
    default:
      state = 'Desconocido'
      break;
  }

  useEffect(() => {
    getFetch(`/planner/plans/${planId}`, 'title')
      .then(resp => {
        setPlan(resp.title)
      })
  }, [planId])

  return (
    <div
      className='
      relative transition duration-300 w-full gap-2 p-4 bg-white
      rounded-lg shadow-lg border hover:shadow-xl hover:scale-95 transform
      text-sm hover:border-gray-400
    '>
      <h1 className='font-semibold capitalize mb-1 text-base'>{title}</h1>
      <header className='grid grid-cols-2 '>
        <section>
          <p>
            <span className='font-semibold capitalize mr-1'>
              plan:
            </span>
            {plan}
          </p>
          <p>
            <span className='font-semibold capitalize mr-1'>
              fecha:
            </span>
            {moment(createdDateTime).format('DD-MM-yyyy')}
          </p>
          <p>
            <span className='font-semibold capitalize mr-1'>
              estado:
            </span>
            {state}
          </p>
        </section>
        <section className='flex text-gray-500 text-center  gap-4 place-self-end'>
          <div>
            <h5 className='mb-2 capitalize'>
              {Object.keys(assignments).length > 1 ? 'encargados' : 'encargado'}
            </h5>
            {
              Object.keys(assignments).length > 0 &&
              Object.keys(assignments).map(obj => (
                <Person className='rounded-full p-0.5 shadow-md' key={obj} userId={obj} />
              ))
            }
          </div>
          <div>
            <h5 className='mb-2'>
              Solicita
            </h5>
            <Person className='rounded-full p-0.5 shadow-md' userId={createdBy.user.id} />
          </div>
        </section>
      </header>
      <section className='bg-black bg-opacity-5 p-1.5 my-2 rounded-md'>
        <h5 className='capitalize  font-semibold'>
          descripcion
        </h5>
        <p className={`
           px-2 mt-1 text-justify max-h-32 overflow-custom 
          ${description === '' && 'text-gray-400'}
        `}>
          {description === '' ? 'No hay descripcion...' : description}
        </p>
      </section>
      <ul className='w-full'>
        <h5 className=' capitalize font-semibold mb-1'>
          archivos
        </h5>
        {
          Object.entries(references).length > 0 ?
            Object.entries(references).map((r, i) => (
              <li className=' text-gray-600 pl-2 hover:text-blue-500 w-max' key={i}>
                <a
                  rel='noreferrer'
                  target='_blank'
                  href={decodeURIComponent(r[0])}>{decodeURIComponent(r[1].alias)}
                </a>
              </li>
            ))
            : <p className='text-gray-400 mb-1 pl-2'>No hay archivos...</p>
        }
      </ul>
      {
        percentComplete === 0 &&
        <Button
          className='h-8 w-8 hover:bg-gray-200 rounded-full absolute bottom-3 right-3'
          type='icon'
          icon='fas fa-reply'
          onClick={() => onAddTask({ title, description, idTask: id, plan, etag })} />
      }
    </div>
  )
}

export default PlannerCard
