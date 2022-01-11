import { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import TextArea from '../ui/TextArea'

const defaultPauses = [
   { id: 1112121, desc: 'Hora de colacion...' },
   { id: 1112223, desc: 'Para ver otra actividad...' },
   { id: 1112322, desc: 'Por reunion de trabajo...' },
   { id: 1112424, desc: 'Salida a terreno...' }
]

const Td = (props) => {

   const {
      children,
      align = 'text-center',
      isMultiLine = false,
      width = 'max-w-md',
      className,
      bgcolor,
      isModal = false,
      pauseActivity,
      playActivity
   } = props

   const [modalPause, toggleModalPause] = useState(false)
   const [{ desc }, onChangeValues, reset] = useForm({ desc: '' })

   const onCloseModal = () => {
      reset()
      toggleModalPause(false)
   }

   return (
      <>
         <td
            className={`
            ${align} ${isMultiLine ? 'whitespace-pre-wrap' : 'truncate'} 
            ${className} ${width} ${bgcolor && 'bg-black/5'}
            animate__animated animate__fadeIn animate__faster 
            px-2 py-2`}
         >
            {
               props.estado !== 1 && isModal ?
                  <button onClick={props.estado_play_pausa === 2 ? () => toggleModalPause(true) : () => playActivity({ id_actividad: props.id_det })}>
                     {props.estado_play_pausa === 2 ? <i className='fas fa-pause fa-sm' /> : <i className='fas fa-play fa-sm' />}
                  </button>
                  : <span />
            }
            {children}
         </td>

         {/* modal pause */}
         {isModal &&
            <Modal showModal={modalPause} isBlur={false} onClose={onCloseModal}
               className='max-w-2xl' padding='p-5'
            >
               <div className='grid gap-5'>
                  <h1 className='text-xl font-semibold capitalize'>
                     Pausar actividad: {props.actividad || 'Sin titulo'}, {props.id_det}
                  </h1>
                  <h5 className='text-sm'>Descripcion actividad: </h5>
                  <p className='text-sm whitespace-pre-wrap max-h-44 overflow-custom p-1.5 rounded-lg bg-black/5'>
                     {props.func_objeto}
                  </p>
                  <h5 className='text-sm'>Pausas rapidas: </h5>
                  <ul className='max-h-56 overflow-custom'>
                     {
                        defaultPauses.map(pause => (
                           <li
                              key={pause.id}
                              className='flex items-center justify-between bg-black/5 rounded-lg py-1.5 px-3 mr-1.5 shadow-md shadow-gray-400/20 mb-1.5 hover:bg-black/10 transition duration-200'
                           >
                              <p className='text-gray-600 text-sm'>{pause.desc}</p>
                              <button
                                 className='ml-2 text-red-400 hover:text-red-600 transition duration-200 transform hover:hover:scale-125'
                                 onClick={() => {
                                    pauseActivity({ flag: true, id_actividad: props.id_det, mensaje: pause.desc })
                                    onCloseModal()
                                 }}
                              >
                                 <i className='fas fa-pause fa-sm' />
                              </button>

                           </li>
                        ))
                     }
                  </ul>
                  <TextArea
                     field='Mensaje pausa'
                     name='desc'
                     value={desc}
                     onChange={onChangeValues}
                  />
                  <footer className='flex items-center justify-between'>
                     <Button
                        className='w-max border border-blue-400 text-blue-400 hover:text-white hover:bg-blue-400 hover:shadow-lg hover:shadow-blue-500/30 rounded-full'
                        name='cancelar'
                        onClick={() => onCloseModal()}
                     />
                     <Button
                        className='w-max border border-red-400 text-red-400 hover:text-white hover:bg-red-400 hover:shadow-lg hover:shadow-red-500/30 rounded-full'
                        name='Pausar actividad'
                        onClick={() => {
                           pauseActivity({ flag: false, id_actividad: props.id_det, mensaje: desc })
                           onCloseModal()
                        }}
                     />
                  </footer>
               </div>
            </Modal>
         }

      </>
   )
}

export default Td
