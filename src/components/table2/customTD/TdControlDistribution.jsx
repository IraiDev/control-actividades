import { useState, useCallback } from 'react'
import Modal from '../../ui/Modal'
import DistributionForm from '../../forms/DistributionForm'

const TdControlDistribution = props => {

   const {
      align = 'text-center',
      isMultiLine = false,
      width = 'max-w-sm',
      highlight = false,
      isStickyLeft = false,
      isStickyRight = false,
      padre_original_terminado,
      padre_original_facturado
   } = props

   const [modal, setModal] = useState(false)

   const onCloseModal = () => {
      setModal(false)
   }

   const calculateTime = useCallback((trabajado, distribuido) => {

      const time = trabajado - Number(distribuido?.reduce((a, b) => Number(a.toFixed(4)) + Number(b?.tiempo_dist_act?.toFixed(4)), 0).toFixed(4))
      const length = distribuido?.length
      return {
         time: Number(time.toFixed(4)),
         length
      }
   }, [props.tiempos_distribuidos])

   const handleOpenModal = () => {
      setModal(true)
   }

   return (
      <>
         <td
            className={`

               animate__animated animate__fadeIn animate__faster px-2 py-2.5
               border-b border-zinc-400
               ${isMultiLine ? 'whitespace-pre-wrap' : 'truncate'} 
               ${align}
               ${width}
               ${highlight ? 'font-bold' : 'font-normal'}
               ${isStickyLeft ? 'sticky left-0 odd:bg-slate-600 even:bg-slate-700' : isStickyRight ? 'sticky right-0 odd:bg-zinc-200/70 even:bg-zinc-200/70' : ' odd:bg-black/0 even:bg-black/5'}
            
            `}>
            <span
               onClick={handleOpenModal}
               // title='tiempo restante para distribuir'
               className={`

                  px-2 py-1 font-bold rounded-full text-sm transition duration-300
                     ${calculateTime(props?.tiempo_trabajado, props?.tiempos_distribuidos).time === 0 ? 'text-green-500 bg-green-200 hover:bg-green-300'
                     : calculateTime(props?.tiempo_trabajado, props?.tiempos_distribuidos).length === 0 ? 'text-red-500 bg-red-200 hover:bg-red-300'
                        : calculateTime(props?.tiempo_trabajado, props?.tiempos_distribuidos).length > 0 ? 'text-amber-500 bg-amber-200 hover:bg-amber-300' : ''}
                  
               `}
            >
               {
                  <>
                     <i className='fas fa-clock mr-3' />
                     {calculateTime(props?.tiempo_trabajado, props?.tiempos_distribuidos).time}
                  </>
               }
            </span>
         </td>

         <Modal
            showModal={modal}
            isBlur={false}
            onClose={onCloseModal}
            className='max-w-7xl'
            padding='p-6'
            title='Distribución de tiempos'
         >
            {padre_original_terminado &&
               <span className='bg-red-100 text-red-500 rounded-lg px-2 py-1 w-max mx-auto block font-semibold'>

                  El padre original de este ticket se encuentra en estado terminado, por ende, no se puede distribuir el tiempo.

               </span>
            }

            {padre_original_facturado &&
               <span className='bg-amber-100 text-amber-500 rounded-lg px-2 py-1 w-max mx-auto block font-semibold'>

                  El padre original de este ticket se encuentra en estado para facturar, por ende, la modificacion de esstos tiempos afectaran las del padre.

               </span>
            }

            <DistributionForm
               {...props}
               isFather={props.isFather}
               onClose={onCloseModal}
               callback={(data) => props.callback(data)}
               isTicket={props.isTicket}
            />
         </Modal>
      </>
   )
}

export default TdControlDistribution
