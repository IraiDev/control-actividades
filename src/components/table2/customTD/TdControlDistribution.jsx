import { useEffect, useState, useContext } from 'react'
import { ActivityContext } from '../../../context/ActivityContext'
import { Alert } from '../../../helpers/alerts'
import { useForm } from '../../../hooks/useForm'
import Button from '../../ui/Button'
import CustomSelect from '../../ui/CustomSelect'
import Input from '../../ui/Input'
import Modal from '../../ui/Modal'
import Numerator from '../../ui/Numerator'
import NumberFormat from 'react-number-format'
import Box from '../../ui/Box'
import DistributionForm from '../../forms/DistributionForm'

const initOptions = {
   product: { value: null, label: 'ninguno' },
}

const TdControlDistribution = props => {

   const {
      align = 'text-center',
      isMultiLine = false,
      width = 'max-w-sm',
      highlight = false,
      isStickyLeft = false,
      isStickyRight = false,
   } = props

   const [modal, setModal] = useState(false)

   const onCloseModal = () => {
      setModal(false)
   }

   const calculateTime = (act) => {

      const te = Number(act?.tiempo_cliente?.toFixed(4))

      const time = te - Number(act?.tiempos_distribuidos?.reduce((a, b) => Number(a.toFixed(4)) + Number(b?.tiempo_dist_act?.toFixed(4)), 0).toFixed(4))
      const length = act?.tiempos_distribuidos?.length

      return {
         time: Number(time.toFixed(4)),
         length
      }
   }

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
               title='tiempo restante para distribuir'
               className={`

                  px-2 py-1 font-bold rounded-full text-sm transition duration-300
                     ${calculateTime(props).time === 0 ? 'text-green-500 bg-green-200 hover:bg-green-300'
                     : calculateTime(props).length === 0 ? 'text-red-500 bg-red-200 hover:bg-red-300'
                        : calculateTime(props).length > 0 ? 'text-amber-500 bg-amber-200 hover:bg-amber-300' : ''}
                  
               `}
            >
               {
                  <>
                     <i className='fas fa-clock mr-3' />
                     {calculateTime(props).time}
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
            title='pasar a entregado'
         >
            <DistributionForm {...props} isFather={props.isFather} onClose={onCloseModal} callback={(data) => props.callback(data)} />
         </Modal>
      </>
   )
}

export default TdControlDistribution
