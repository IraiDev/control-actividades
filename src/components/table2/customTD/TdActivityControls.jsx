import { useContext } from 'react'
import { useState } from 'react'
import { ActivityContext } from '../../../context/ActivityContext'
import { Alert } from '../../../helpers/alerts'
import { useForm } from '../../../hooks/useForm'
import Button from '../../ui/Button'
import CustomSelect from '../../ui/CustomSelect'
import Modal from '../../ui/Modal'
import TextArea from '../../ui/TextArea'

const defaultPauses = [
   { id: 1112121, desc: 'Hora de colacion...' },
   { id: 1112223, desc: 'Para ver otra actividad...' },
   { id: 1112322, desc: 'Por reunion de trabajo...' },
   { id: 1112424, desc: 'Salida a terreno...' },
]

const Icon = ({ isPause = false, condition }) => {
   if (isPause) {
      return <i className={condition ? 'fas fa-pause fa-sm' : 'fas fa-play fa-sm'} />
   }
   return (
      <>
         <i className="fas fa-hammer fa-sm" />
         <i className="fas fa-chevron-right fa-sm" />
      </>
   )
}

const TdActivityControls = (props) => {
   const {
      children,
      isMultiLine = false,
      width = 'max-w-sm',
      onPause,
      onPlay,
      callback,
      time,
      id_det,
      isStickyLeft = false,
      isStickyRight = true,
   } = props

   const { optionsArray } = useContext(ActivityContext)

   // conditions
   const ACT_STATE = props.estado === 1
   const PAUSE_STATE = props.estado_play_pausa === 2

   // states
   const [modal, setModal] = useState(false)
   const [options, setOptions] = useState({ value: null, label: 'ninguno' })

   // hooks
   const [{ desc }, onChangeValues, reset] = useForm({ desc: '' })

   const pausesList = (activityType) => {
      const list = optionsArray?.pause_type ?? []

      if (activityType === 1) {
         //tipo actividad normal
         return list.filter((item) => item.value === 1) //tipo pausa normal
      }

      if (activityType === 3) {
         //tipo actividad normal
         return list.filter((item) => item.value === 3) //tipo pausa entrega
      }
      //tipo actividad coordinacion
      return list //tipo pausa todas
   }

   // functions
   const onCloseModal = () => {
      setModal(false)
      reset()
   }

   const handleToggleState = () => {
      Alert({
         title: 'Atención',
         content: `La  actividad se pondra en trabajo con el siguiente tiempo: <strong>${time}</strong> hrs`,
         confirmText: 'Si, aceptar',
         cancelText: 'No, cancelar',
         action: callback,
      })
   }

   // const handlePause = (flag, mensaje) => {

   //    onPause({
   //       id_actividad: id_det,
   //       flag,
   //       mensaje,
   //    })
   //    onCloseModal()
   // }

   const handlePauseActivity = ({ isDefaultPause, mensaje }) => {
      if (options.value === null) {
         Alert({
            icon: 'warn',
            title: 'Atención',
            content: 'Debe seleccionar un tipo de pausa',
            showCancelButton: false,
         })
         return
      }

      onPause({
         flag: isDefaultPause,
         id_actividad: props.id_det,
         mensaje: isDefaultPause ? mensaje : desc,
         tipo_pausa: options.value,
      })

      onCloseModal()
   }

   return (
      <>
         <td
            className={`

               animate__animated animate__fadeIn animate__faster px-2 py-2.5
               odd:bg-black/5 even:bg-black/0 border-b border-zinc-400
               ${isMultiLine ? 'whitespace-pre-wrap' : 'truncate'}
               ${width}
               ${
                  isStickyLeft
                     ? 'sticky left-0 odd:bg-zinc-200/80 even:bg-zinc-200/80'
                     : isStickyRight
                     ? 'sticky right-0 odd:bg-zinc-200/80 even:bg-zinc-200/80'
                     : ' odd:bg-black/0 even:bg-black/5'
               }
            `}
         >
            <div className="flex items-center justify-between gap-2">
               {ACT_STATE ? (
                  <Button
                     className="hover:bg-black/5"
                     size="w-11 h-7"
                     title="pasa actividad a E.T"
                     onClick={handleToggleState}
                  >
                     <Icon />
                  </Button>
               ) : (
                  <Button
                     className="hover:bg-black/5"
                     size="w-7 h-7"
                     onClick={
                        PAUSE_STATE
                           ? () => setModal(true)
                           : () => onPlay({ id_actividad: id_det })
                     }
                  >
                     <Icon isPause condition={PAUSE_STATE} />
                  </Button>
               )}

               {children}
            </div>
         </td>

         {/* modal pause */}
         <Modal
            showModal={modal}
            isBlur={false}
            onClose={onCloseModal}
            className="max-w-2xl"
            padding="p-6"
         >
            <div className="grid gap-5">
               <h1 className="flex gap-2 text-xl font-semibold capitalize">
                  Pausar actividad:
                  {props.actividad || 'Sin titulo'},{id_det}
               </h1>

               <h5 className="text-sm">Descripcion actividad:</h5>

               <p className="text-sm whitespace-pre-wrap max-h-44 overflow-custom p-1.5 rounded-lg bg-black/5">
                  {props.func_objeto}
               </p>

               <CustomSelect
                  label="Tipo de pausa"
                  options={pausesList(props?.id_tipo_actividad)}
                  isDefaultOptions
                  value={options}
                  onChange={(option) => setOptions(option)}
               />

               <h5 className="text-sm">Pausas rapidas: </h5>

               <ul className="max-h-56 overflow-custom">
                  {defaultPauses.map((pause) => (
                     <li
                        key={pause.id}
                        className="flex items-center justify-between bg-black/5 rounded-lg py-1.5 px-3 mr-1.5 shadow-md shadow-gray-400/20 mb-1.5 hover:bg-black/10 transition duration-200"
                     >
                        <p className="text-sm text-gray-600">{pause.desc}</p>

                        <button
                           className="ml-2 text-red-400 transition duration-200 transform hover:text-red-600 hover:hover:scale-125"
                           onClick={() =>
                              handlePauseActivity({
                                 isDefaultPause: true,
                                 mensaje: pause.desc,
                              })
                           }
                        >
                           <i className="fas fa-pause fa-sm" />
                        </button>
                     </li>
                  ))}
               </ul>

               <TextArea
                  field="Mensaje pausa"
                  name="desc"
                  value={desc}
                  onChange={onChangeValues}
               />

               <footer className="flex items-center justify-between">
                  <Button
                     className="text-blue-400 hover:bg-blue-100"
                     name="cancelar"
                     onClick={() => onCloseModal()}
                  >
                     cancelar
                  </Button>
                  <Button
                     className="text-red-500 hover:bg-red-100"
                     onClick={() =>
                        handlePauseActivity({
                           isDefaultPause: true,
                           mensaje: desc,
                        })
                     }
                  >
                     Pausar actividad
                  </Button>
               </footer>
            </div>
         </Modal>
      </>
   )
}

export default TdActivityControls
