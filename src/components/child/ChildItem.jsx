import { useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActivityContext } from '../../context/ActivityContext'
import { Alert } from '../../helpers/alerts'
import Button from '../ui/Button'
import P from '../ui/P'
import Tag from '../ui/Tag'
import moment from 'moment'
import Numerator from '../ui/Numerator'
import CustomSelect from '../ui/CustomSelect'
import Modal from '../ui/Modal'
import TextArea from '../ui/TextArea'

const defaultPauses = [
   { id: 1112121, desc: 'Hora de colacion...' },
   { id: 1112223, desc: 'Para ver otra actividad...' },
   { id: 1112322, desc: 'Por reunion de trabajo...' },
   { id: 1112424, desc: 'Salida a terreno...' },
   { id: 1112425, desc: 'Fin jornada...' },
]

const ChildItem = (props) => {

   const { optionsArray } = useContext(ActivityContext)

   const navigate = useNavigate()

   const [modalPause, toggleModalPause] = useState(false)
   const [input, setInput] = useState('')

   const [options, setOptions] = useState({ value: 0, label: 'ninguno' })

   const isRuning = useMemo(() => props.pausas.length > 0 ? props.pausas[0].boton === 2 : false, [props.pausas])

   const handleShowDesc = () => {
      Alert({
         icon: 'none',
         title: `<span class='text-lg'>Descripción de la actividad <br /> ${props.actividad}, ${props.id_det}</span>`,
         content: `<p class='text-justify'>${props.func_objeto}</p>`,
         showCancelButton: false,
         confirmText: 'cerrar',
      })
   }

   const onCloseModals = () => {
      toggleModalPause(false)
   }

   const handlePauseActivity = ({ isDefaultPause = false, mensaje }) => {

      if (isDefaultPause) {

         if (options.value === 0) {
            Alert({
               icon: 'warn',
               title: 'Atención!',
               content: 'Debe seleccionar un tipo de pausa para pausar la actividad',
               showCancelButton: false,
            })
            return
         }

         props.onPause({ mensaje, id_actividad: props.id_det })
         onCloseModals()
         return
      }

      if (input === '' || options.value === 0) {
         Alert({
            icon: 'warn',
            title: 'Atención!',
            content: 'Debe ingresar una descripción y/o seleccionar un tipo de pausa para pausar la actividad',
            showCancelButton: false,
         })
         return
      }

      props.onPause({ mensaje, id_actividad: props.id_det })
      onCloseModals()

   }

   const handleNavigate = () => {
      props.hideChilds(false)
      navigate(`/detalle-actividad/${props.id_det}`, { replace: false })
   }

   const timeFormat = (time) => {

      let days = time._data.days
      const dayToHours = days * 24
      let hours = time._data.hours + dayToHours
      let minutes = time._data.minutes
      let seconds = time._data.seconds
      if (hours < 10) hours = '0' + hours
      if (minutes < 10) minutes = '0' + minutes
      if (seconds < 10) seconds = '0' + seconds

      return {
         complete: hours + ':' + minutes + ':' + seconds,
         section: {
            hours: time._data.hours + dayToHours,
            minutes: time._data.minutes,
            seconds: time._data.seconds,
         },
      }
   }

   return (

      <>

         <div
            className='gap-2 text-xs bg-white text-slate-700 rounded-lg shadow-md p-2.5 transition duration-200 transform hover:scale-[1.01]'
         >

            <header className='flex justify-between items-baseline gap-2'>

               <div className='flex gap-2 items-center mb-2 px-2 py-1 rounded-lg bg-zinc-100 w-max'>
                  <Numerator number={props.number} />
                  <h1 className='font-semibold text-base'>{props.nombre_proyecto} - {props.actividad}</h1>
               </div>

               <div className='grid grid-cols-3 gap-2 items-center w-80'>

                  <span
                     className={`
                           px-3 py-1.5 rounded-full font-semibold w-max text-sm flex items-center gap-2 col-span-2 justify-self-end
                           ${props.estado === 1 ? 'bg-yellow-100 text-yellow-500'
                           : props.estado === 2 ? 'text-blue-500 bg-blue-100'
                              : props.estado === 3 ? 'text-teal-500 bg-teal-100'
                                 : 'text-green-500 bg-green-100'
                        }
                     `}
                  >
                     <p className='font-bold'>Estado:</p>

                     {optionsArray?.status?.find(os => os.value === props.estado).label}

                     {props.estado === 1 ? <i className='fas fa-hourglass-start' />
                        : props.estado === 2 ? <i className='fas fa-user-clock' />
                           : props.estado === 3 ? <i className='fas fa-check' />
                              : <i className='fas fa-check-double' />
                     }
                  </span>

                  <Button
                     hidden={props.estado !== 1 && props.estado !== 2}
                     className='bg-black/5 hover:bg-indigo-100 hover:text-indigo-500 text-sm'
                     onClick={handleNavigate}
                  >
                     ver detalle
                  </Button>

               </div>


            </header>

            <div className='grid grid-cols-5 '>

               <section className='grid content-center gap-1'>

                  {/* <P tag='ID' value={props.id_det} /> */}
                  <span className='flex gap-1 max-w-max rounded'>
                     <strong>ID:</strong>
                     <p className={`
                  
                           px-1 rounded font-semibold
                           ${props.es_padre === 1 ? 'bg-orange-200/70 text-orange-500 font-semibold' : ''}
                        
                        `}
                     >
                        {props.id_det}
                     </p>
                  </span>
                  <P tag='ID Padre' value={props.id_det_padre} />
                  <P tag='proyecto' value={`${props.abrev} ${props.nombre_sub_proy ? ' / ' + props.nombre_sub_proy : ''}`} />

               </section>

               <section className='grid content-center gap-1'>

                  <P tag='Encargado' value={props.encargado_actividad} />
                  <P tag='solicita' value={props.user_solicita} />
                  <P tag='revisor' value={props.abrev_revisor || '--'} />

               </section>

               <section className='grid content-center gap-1'>

                  <P tag='creación' value={moment(props.fecha_tx).format('DD-MM-YY')} />

                  <span
                     className={`
                           px-3 py-0.5 rounded-full font-bold block w-max
                           ${props.prioridad_etiqueta === 1000 ? 'bg-slate-200 text-slate-600'
                           : props.prioridad_etiqueta === 600 ? 'text-green-700 bg-green-100'
                              : props.prioridad_etiqueta === 400 ? 'text-yellow-600 bg-yellow-100'
                                 : props.prioridad_etiqueta === 100 && 'text-red-500 bg-red-100'
                        }
                     `}
                  >
                     Prioridad: {props.num_prioridad}
                  </span>

                  <span
                     className='px-3 font-bold flex gap-2 items-baseline w-max'
                     title='Tiempo trabajado'
                  >
                     <i className='far fa-clock' />
                     {timeFormat(
                        moment.duration(
                           props.tiempoTotal,
                           'hours'
                        )
                     ).complete}
                  </span>

               </section>

               <section className='grid grid-cols-2 content-center'>

                  <div>
                     <Tag>
                        Tipo: {props.desc_tipo_actividad}
                     </Tag>

                     {props.notas.length > 0 &&
                        <Tag>
                           Tiene {props.notas.length} notas
                        </Tag>
                     }
                  </div>
                  {props.es_padre === 1 &&
                     <Tag>
                        <i className='fas fa-hat-cowboy' /> Es padre
                     </Tag>
                  }

               </section>

               <section className='flex justify-between px-10 gap-2 items-center'>

                  <Button
                     className='hover:bg-blue-100 text-blue-500 text-sm'
                     onClick={handleShowDesc}
                  >
                     ver descripción...
                  </Button>

                  {props.estado === 2 && props.id_tipo_actividad === 1 ?
                     <Button
                        className={
                           isRuning
                              ? 'text-red-400 bg-red-50 hover:bg-red-100'
                              : 'text-emerald-400 bg-emerald-50 hover:bg-emerald-100'
                        }
                        title={isRuning ? 'Pausar' : 'Reanudar' + ' (SOLO PARA ACTIVIDADES DE TIPO: NORMAL Y ESTADO: EN TRABAJO)'}
                        onClick={isRuning ? () => toggleModalPause(true) : () => props.onPlay()}
                     >
                        <i
                           className={
                              isRuning
                                 ? 'fas fa-pause fa-sm'
                                 : 'fas fa-play fa-sm'
                           }
                        />
                     </Button>
                     : <span />
                  }
               </section>

            </div>
         </div>

         {/* modal pause */}

         <Modal
            showModal={modalPause}
            isBlur={false}
            onClose={onCloseModals}
            className='max-w-2xl'
            padding='p-4 md:p-6'
            title={`Pausar actividad: ${props.actividad}, ${props.id_det}`}
         >

            <div className='grid gap-5'>
               <h5 className='text-sm'>Descripcion actividad: </h5>
               <p className='text-sm whitespace-pre-wrap max-h-44 overflow-custom p-1.5 rounded-lg bg-black/5'>
                  {props.func_objeto}
               </p>

               <CustomSelect
                  label='Tipo de pausa'
                  options={optionsArray?.pause_type}
                  isDefaultOptions
                  value={options}
                  onChange={(option) => setOptions(option)}
               />

               <h5 className='text-sm'>Pausas rapidas: </h5>

               <ul className='max-h-56 overflow-custom'>
                  {defaultPauses.map(pause => (
                     <li
                        key={pause.id}
                        className='flex items-center justify-between bg-black/5 rounded-lg py-1.5 px-3 mr-1.5 shadow-md shadow-gray-400/20 mb-1.5 hover:bg-black/10 transition duration-200'>
                        <p className='text-gray-600 text-sm'>
                           {pause.desc}
                        </p>
                        <button
                           className='ml-2 text-red-400 hover:text-red-600 transition duration-200 transform hover:hover:scale-125'
                           onClick={() => handlePauseActivity({ isDefaultPause: true, mensaje: pause.desc })}>
                           <i className='fas fa-pause fa-sm' />
                        </button>
                     </li>
                  ))}
               </ul>

               <TextArea
                  field='Mensaje pausa'
                  value={input}
                  onChange={e => setInput(e.target.value)}
               />
               <footer className='flex items-center justify-between'>
                  <Button
                     className='w-max text-blue-500 hover:bg-blue-100'
                     onClick={() => onCloseModals()}>
                     cancelar
                  </Button>
                  <Button
                     className='w-max text-red-500 hover:bg-red-100'
                     onClick={() => handlePauseActivity({ mensaje: input })}>
                     Pausar actividad
                  </Button>
               </footer>
            </div>

         </Modal>

      </>
   )
}

export default ChildItem