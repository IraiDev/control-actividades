import { useState } from 'react'
import Td from '../Td'
import TdControlDistribution from './TdControlDistribution'
import Button from '../../ui/Button'
import Modal from '../../ui/Modal'
import TextArea from '../../ui/TextArea'
import { useForm } from '../../../hooks/useForm'
import { Alert } from '../../../helpers/alerts'

const TdSwitch = (props) => {
   const { state, pausas, onPause, onPlay } = props

   const [modalPause, setModalPause] = useState(false)

   const [{ mensaje }, onChangeValues, reset] = useForm({ mensaje: '' })

   const isPaused = pausas.length > 0 ? pausas[0].boton === 1 : false

   const onCloseModal = () => {
      setModalPause(false)
      reset()
   }

   const openModalPause = () => {
      setModalPause(true)
   }

   const handlePauseActivity = () => {
      if (mensaje === '') {
         Alert({
            icon: 'warn',
            title: 'Atención!',
            content: 'Debe ingresar un mensaje para pausar la actividad.',
            showCancelButton: false,
         })
         return
      }

      onPause({ mensaje, tipo_pausa: 3 })
      onCloseModal()
   }

   if (state === 13 || state === 5 || state === 8) {
      return (
         <TdControlDistribution
            getId={(id_callback) => props.getId(id_callback)}
            callback={(times) =>
               props.onDistribution({
                  distribuciones: times,
                  id_actividad: props.id_det,
               })
            }
            isStickyRight
            isFather={props.isFather}
            isTicket={props.isTicket}
            {...props}
         />
      )
   }

   // if (state === 3) {
   //   return (
   //     <Td isStickyRight>
   //       <div className="flex justify-center gap-2">
   //         <Button
   //           className="border bg-emerald-100 hover:bg-emerald-200 text-emerald-500 border-emerald-300"
   //           onClick={() =>
   //             props.onChangeCheckedActivity({
   //               id: props.id_det,
   //               title: props.actividad,
   //               revisado: true,
   //               estado: props.estado,
   //               coorId: props.id_coordinacion,
   //             })
   //           }
   //         >
   //           <i className="fas fa-check" />
   //         </Button>

   //         <Button
   //           className="px-3 text-red-500 bg-red-100 border border-red-300 hover:bg-red-200"
   //           onClick={() =>
   //             props.onChangeCheckedActivity({
   //               id: props.id_det,
   //               title: props.actividad,
   //               revisado: false,
   //               estado: props.estado,
   //               coorId: props.id_coordinacion,
   //             })
   //           }
   //         >
   //           <i className="fas fa-times" />
   //         </Button>
   //       </div>
   //     </Td>
   //   );
   // }

   if (state === 12 || state === 3) {
      return (
         <>
            <Td isStickyRight>
               <div className="flex justify-center">
                  {isPaused ? (
                     <Button
                        // title="trabajar en la entrega de la actividad con el cliente"
                        onClick={onPlay}
                        className="text-green-500 bg-green-100 border border-green-300 hover:bg-green-200"
                     >
                        <i className="fas fa-truck fa-xs" />
                        <i className="fas fa-play fa-xs" />
                     </Button>
                  ) : (
                     <div className="flex gap-1.5">
                        <Button
                           //  title="pausar la entrega de la actividad"
                           onClick={openModalPause}
                           className="text-red-500 bg-red-100 border border-red-300 hover:bg-red-200"
                        >
                           <i className="fas fa-truck fa-xs" />
                           <i className="fas fa-pause fa-xs" />
                        </Button>

                        <Button
                           title="aprobar la actividad"
                           onClick={() =>
                              props.onChangeCheckedActivity({
                                 id: props.id_det,
                                 title: props.actividad,
                                 revisado: true,
                                 estado: props.estado,
                              })
                           }
                           className="border bg-emerald-100 hover:bg-emerald-200 text-emerald-500 border-emerald-300"
                        >
                           <i className="fas fa-check" />
                        </Button>

                        <Button
                           title="rechazar la actividad"
                           onClick={() =>
                              props.onChangeCheckedActivity({
                                 id: props.id_det,
                                 title: props.actividad,
                                 revisado: false,
                                 estado: props.estado,
                              })
                           }
                           className="text-red-500 bg-red-100 border border-red-300 hover:bg-red-200"
                        >
                           <i className="fas fa-times" />
                        </Button>
                     </div>
                  )}
               </div>
            </Td>

            {modalPause && (
               <Modal
                  showModal={modalPause}
                  onClose={onCloseModal}
                  isBlur={false}
                  className="max-w-md"
                  padding="p-5"
                  title={`Pausar actividad: ${props.actividad}, ${props.id_det}`}
               >
                  <div>
                     <h5 className="mb-5 text-sm">Descripción actividad: </h5>

                     <p className="text-xs text-zinc-600 p-1.5 rounded-md bg-zinc-100 mb-5">
                        {props.func_objeto}
                     </p>

                     <TextArea
                        field="Mensaje pausa"
                        name="mensaje"
                        value={mensaje}
                        onChange={onChangeValues}
                     />

                     <footer className="flex justify-between mt-5">
                        <Button
                           className="text-red-500 bg-red-100 hover:bg-red-200"
                           onClick={onCloseModal}
                        >
                           cancelar
                        </Button>

                        <Button
                           className="bg-emerald-100 hover:bg-emerald-200 text-emerald-500"
                           onClick={handlePauseActivity}
                        >
                           Pausar actividad
                        </Button>
                     </footer>
                  </div>
               </Modal>
            )}
         </>
      )
   }

   return null
}

export default TdSwitch
