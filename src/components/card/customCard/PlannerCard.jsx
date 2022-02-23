import { useEffect, useState } from 'react'
import { Person } from '@microsoft/mgt-react'
import { getFetch } from '../../../helpers/fetchingGraph'
import Button from '../../ui/Button'
import P from '../../ui/P'
import Card from '../Card'
import CardContent from '../CardContent'
import CardSection from '../CardSection'
import CardFooter from '../CardFooter'
import moment from 'moment'

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
   onAddTask,
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
         break
   }

   useEffect(() => {
      getFetch(`/planner/plans/${planId}`, 'title').then(resp => {
         setPlan(resp.title)
      })
   }, [planId])

   return (
      <Card>
         <CardContent title={title}>
            <CardSection colCount={2}>
               <aside>
                  <P tag='plan' value={plan} />
                  <P
                     tag='fecha'
                     value={moment(createdDateTime).format('DD-MM-yyyy')}
                  />
                  <P tag='estado' value={state} />
               </aside>

               <aside className='flex text-gray-500 text-center  gap-4 place-self-end'>
                  <div>
                     <h5 className='mb-2 capitalize'>
                        {Object.keys(assignments).length > 1
                           ? 'encargados'
                           : 'encargado'}
                     </h5>
                     {Object.keys(assignments).length > 0 &&
                        Object.keys(assignments).map(obj => (
                           <Person
                              className='rounded-full p-0.5 shadow-md'
                              key={obj}
                              userId={obj}
                           />
                        ))}
                  </div>
                  <div>
                     <h5 className='mb-2'>Solicita</h5>
                     <Person
                        className='rounded-full p-0.5 shadow-md'
                        userId={createdBy.user.id}
                     />
                  </div>
               </aside>
            </CardSection>

            <CardSection subtitle='descripción'>
               <p className='px-2 mt-1 text-justify max-h-32 overflow-custom'>
                  {description === '' ? 'No hay descripcion...' : description}
               </p>
            </CardSection>

            <CardSection subtitle='archivos'>
               <ul className='w-full overflow-custom max-h-20'>
                  {Object.entries(references).length > 0 ? (
                     Object.entries(references).map((r, i) => (
                        <li
                           className=' text-gray-600 pl-2 hover:text-blue-500 w-max'
                           key={i}>
                           <a
                              rel='noreferrer'
                              target='_blank'
                              href={decodeURIComponent(r[0])}>
                              {decodeURIComponent(r[1].alias)}
                           </a>
                        </li>
                     ))
                  ) : (
                     <li className='text-gray-400 mb-1 pl-2'>
                        No hay archivos...
                     </li>
                  )}
               </ul>
            </CardSection>
         </CardContent>

         <CardFooter>
            <span className='h-5 w-full block' />
            {percentComplete === 0 && (
               <Button
                  className='hover:bg-zinc-100 absolute bottom-3 right-3'
                  onClick={() =>
                     onAddTask({ title, description, idTask: id, plan, etag })
                  }>
                  <i className='fas fa-reply' />
               </Button>
            )}
         </CardFooter>
      </Card>
   )
}

export default PlannerCard
