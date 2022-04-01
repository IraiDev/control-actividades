import ChildItem from './ChildItem'
// import Select from 'react-select'
import P from '../ui/P';


const ChildContainer = (props) => {

   const { data } = props

   return (
      <section className='rounded-lg bg-zinc-100 border mb-8 relative'>

         <header className='flex items-center justify-between py-2 px-4 border-b bg-white rounded-t-lg'>

            <h5 className='font-semibold'>Actividades Hijas</h5>

            <P tag='ID Padre' value={props.id_det} />

            <P tag='Ticket' value={props.num_ticket_edit} />

            <span />

            {/* <div className='flex items-center gap-2 min-w-max'>
               Agrupar:
               <Select isDisabled className='w-48' placeholder='inactivo' />
            </div> */}

         </header>

         <div className='p-4 max-h-[60vh] overflow-custom flex-col space-y-2'>

            {
               data.length > 0 ?
                  data.map(data => (
                     <ChildItem
                        {...data}
                        key={data.id_det}
                        number={data.nivel}
                        onPlay={() => props.onPlay({ id_actividad: data.id_det })}
                        onPause={({ mensaje }) => props.onPause({ mensaje, id_actividad: data.id_det })}
                     />
                  ))
                  : <span className='block mx-auto text-zinc-600 text-sm'>No hay hijas para listar</span>
            }

         </div>

      </section>
   )
}

export default ChildContainer