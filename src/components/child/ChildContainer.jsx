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

            {/* <div className='flex items-center gap-2 min-w-max'>
               Agrupar:
               <Select isDisabled className='w-48' placeholder='inactivo' />
            </div> */}

         </header>

         <div className='p-4 max-h-[60vh] overflow-custom flex-col space-y-2'>

            {
               data.length > 0 &&
               data.map(data => (
                  <ChildItem key={data.id_det} {...data} number={data.nivel} />
               ))
            }

         </div>

      </section>
   )
}

export default ChildContainer