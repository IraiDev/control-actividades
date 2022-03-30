import Button from '../ui/Button'
import P from '../ui/P'
import Tag from '../ui/Tag'
import moment from 'moment'
import Numerator from '../ui/Numerator'
import { Alert } from '../../helpers/alerts'

const ChildItem = (props) => {


   const isRuning = props.estado_play_pausa === 2
   const pending = props.estado === 1

   const handleShowDesc = () => {
      Alert({
         icon: 'none',
         title: `<span class='text-lg'>Descripción de la actividad <br /> ${props.actividad}, ${props.id_det}</span>`,
         content: `<p class='text-justify'>${props.func_objeto}</p>`,
         showCancelButton: false,
         confirmText: 'cerrar',
      })
   }

   console.log(props)

   return (
      <div className='grid grid-cols-5 h-20 gap-2 text-xs bg-white rounded-lg shadow-md p-2.5 transition duration-200 transform hover:scale-[1.01]'>

         <section className='grid content-center gap-1'>

            <Numerator number={props.number} />
            <P tag='Actividad' value={props.actividad} />
            <P tag='ID' value={props.id_det} />

         </section>

         <section className='grid content-center gap-1'>

            <P tag='Encargado' value={props.encargado_actividad} />
            <P tag='solicita' value={props.user_solicita} />
            <P tag='revisor' value={props.abrev_revisor || '--'} />

         </section>

         <section className='grid content-center gap-1'>

            <P tag='creación' value={moment(props.fecha_tx).format('DD-MM-YY')} />
            <P tag='prioridad' value={props.num_prioridad} />
            <P tag='estado' value={pending ? ' pendiente' : ' en trabajo'} />

         </section>

         <section className='grid content-center'>

            <Tag>
               Tipo: {props.desc_tipo_actividad}
            </Tag>

            {props.notas.length > 0 &&
               <Tag>
                  Tiene {props.notas.length} notas
               </Tag>
            }

         </section>

         <section className='flex justify-around gap-2 items-center'>

            <Button
               className='bg-black/5 hover:bg-black/10'
               onClick={handleShowDesc}
            >
               ver descripción
            </Button>

            <Button
               className={
                  isRuning
                     ? 'text-red-400 bg-red-50 hover:bg-red-100'
                     : 'text-emerald-400 bg-emerald-50 hover:bg-emerald-100'
               }
               title={isRuning ? 'Pausar' : 'Reanudar'}
            // onClick={handleOnPlayPause}
            >
               <i
                  className={
                     isRuning
                        ? 'fas fa-pause fa-sm'
                        : 'fas fa-play fa-sm'
                  }
               />
            </Button>
         </section>

      </div>
   )
}

export default ChildItem