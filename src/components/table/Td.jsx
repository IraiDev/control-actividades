import { useState } from 'react'
import { Alert } from '../../helpers/alerts'
import { useForm } from '../../hooks/useForm'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import TextArea from '../ui/TextArea'

const defaultPauses = [
   { id: 1112121, desc: 'Hora de colacion...' },
   { id: 1112223, desc: 'Para ver otra actividad...' },
   { id: 1112322, desc: 'Por reunion de trabajo...' },
   { id: 1112424, desc: 'Salida a terreno...' },
]

const Td = props => {
   const {
      children,
      align = 'text-center',
      isMultiLine = false,
      width = 'max-w-sm',
      className,
      bgcolor,
      isModal = false,
      pauseActivity,
      playActivity,
      callback,
      time,
   } = props

   const [modalPause, toggleModalPause] = useState(false)
   const [{ desc }, onChangeValues, reset] = useForm({ desc: '' })

   const onCloseModal = () => {
      reset()
      toggleModalPause(false)
   }

   const handleToggleStsate = () => {
      Alert({
         title: 'Atención',
         content: `La  actividad se pondra en trabajo con el siguiente tiempo: <strong>${time}</strong> hrs`,
         confirmText: 'Si, aceptar',
         cancelText: 'No, cancelar',
         action: callback,
      })
   }

   return (
      <>
         <td
            className={`
            ${align} ${isMultiLine ? 'whitespace-pre-wrap' : 'truncate'} 
            ${className} ${width} ${bgcolor && 'bg-black/5'}
            animate__animated animate__fadeIn animate__faster 
            px-2 py-2`}>
            {isModal && (
               <>
                  {props.estado === 1 ? (
                     <Button
                        size='w-11 h-7'
                        title='pasa actividad a E.T'
                        className='hover:bg-black/5'
                        onClick={handleToggleStsate}>
                        <i className='fas fa-hammer fa-sm' />
                        <i className='fas fa-chevron-right fa-sm' />
                     </Button>
                  ) : (
                     <Button
                        className='hover:bg-black/5'
                        size='w-7 h-7'
                        onClick={
                           props.estado_play_pausa === 2
                              ? () => toggleModalPause(true)
                              : () =>
                                   playActivity({ id_actividad: props.id_det })
                        }>
                        <i
                           className={
                              props.estado_play_pausa === 2
                                 ? 'fas fa-pause fa-sm'
                                 : 'fas fa-play fa-sm'
                           }
                        />
                     </Button>
                  )}
               </>
            )}
            {children}
         </td>

         {/* modal pause */}
         {isModal && (
            <Modal
               showModal={modalPause}
               isBlur={false}
               onClose={onCloseModal}
               className='max-w-2xl'
               padding='p-5'>
               <div className='grid gap-5'>
                  <h1 className='text-xl font-semibold capitalize'>
                     Pausar actividad: {props.actividad || 'Sin titulo'},{' '}
                     {props.id_det}
                  </h1>
                  <h5 className='text-sm'>Descripcion actividad: </h5>
                  <p className='text-sm whitespace-pre-wrap max-h-44 overflow-custom p-1.5 rounded-lg bg-black/5'>
                     {props.func_objeto}
                  </p>
                  <h5 className='text-sm'>Pausas rapidas: </h5>
                  <ul className='max-h-56 overflow-custom'>
                     {defaultPauses.map(pause => (
                        <li
                           key={pause.id}
                           className='flex items-center justify-between bg-black/5 rounded-lg py-1.5 px-3 mr-1.5 shadow-md shadow-gray-400/20 mb-1.5 hover:bg-black/10 transition duration-200'>
                           <p className='text-gray-600 text-sm'>{pause.desc}</p>
                           <button
                              className='ml-2 text-red-400 hover:text-red-600 transition duration-200 transform hover:hover:scale-125'
                              onClick={() => {
                                 pauseActivity({
                                    flag: true,
                                    id_actividad: props.id_det,
                                    mensaje: pause.desc,
                                 })
                                 onCloseModal()
                              }}>
                              <i className='fas fa-pause fa-sm' />
                           </button>
                        </li>
                     ))}
                  </ul>
                  <TextArea
                     field='Mensaje pausa'
                     name='desc'
                     value={desc}
                     onChange={onChangeValues}
                  />
                  <footer className='flex items-center justify-between'>
                     <Button
                        className='text-blue-400 hover:bg-blue-100'
                        name='cancelar'
                        onClick={() => onCloseModal()}>
                        cancelar
                     </Button>
                     <Button
                        className='text-red-500 hover:bg-red-100'
                        onClick={() => {
                           pauseActivity({
                              flag: false,
                              id_actividad: props.id_det,
                              mensaje: desc,
                           })
                           onCloseModal()
                        }}>
                        Pausar actividad
                     </Button>
                  </footer>
               </div>
            </Modal>
         )}
      </>
   )
}

export default Td
