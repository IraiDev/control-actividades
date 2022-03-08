import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert } from '../../helpers/alerts'
import Button from '../ui/Button'
import MarkActivity from '../ui/MarkActivity'
import Modal from '../ui/Modal'
import Switch from '../ui/Switch'
import CustomSelect from '../ui/CustomSelect'
import Numerator from '../ui/Numerator'
import Box from '../ui/Box'

const arr = [
   {value: 1, label: 'actividad 1'},
   {value: 2, label: 'actividad 2'},
   {value: 3, label: 'actividad 3'},
   {value: 4, label: 'actividad 4'},
]

const initOptions = {
   act: {value: null, label: 'niguno'},
   cond: {value: null, label: 'niguno'},
}

const initSw = {
   isHigh: {status: false, name: 'Alta'},
   isLow: {status: false, name: 'Relajada'},
}

const PrioritySelector = ({
   onClick,
   color = 'bg-slate-400',
   disabled = false,
}) => {
   return (
      <button
         disabled={disabled}
         className={`h-5 w-5 rounded-full ${color} transition duration-200 transform
      ${disabled ? 'hidden' : 'hover:scale-125'}
    `}
         onClick={onClick}></button>
   )
}

const View = ({ 
   children, 
   title, 
   priority, 
   onHigh, 
   onMid, 
   onLow, 
   onNone,
   id,
   idFather,
   isChildren,
   isFather,
   isCoorActivity,
   isReviewedActivity,
   isChildrenAndChildren,
   isDeliveryActivity,
   isTicket,
}) => {
   const navigate = useNavigate()

   const [showModal, setShowModal] = useState(false)
   const [sw, setSw] = useState(initSw)
   const [restrinccions, setRestrictions] = useState([])

   const [options, setOptions] = useState(initOptions)

   const handleAddRestriction = () => {

      if (options.act.value === null || options.cond.value === null || (sw.isHigh.status === false && sw.isLow.status === false)) {
         Alert({
            icon: 'warn',
            title: 'Atención',
            content: 'seleccione todos los campos para añadir una restriccion',
            showCancelButton: false
         })

         return
      }

      const find = sw.isHigh.status ? 1 : 2

      setRestrictions([...restrinccions, {
         id: restrinccions.length,
         act: options?.act.label,
         cond: options?.cond.label,
         rest: find,
      }])

      setOptions(initOptions)
      setSw(initSw)
   }

   const handleDeleteRestriction = (id) => {
      Alert({
         icon: 'warn',
         title: 'Atención',
         content: '¿Esta seguro de eliminar esta restriccion?',
         cancelText: 'No, cancelar',
         confirmText: 'Si, eliminar',
         action: () => setRestrictions(restrinccions.filter(r => r.id !== id))
      })
   }

   return (
      <>
         <div className='relative bg-white p-4 sm:p-10 rounded-lg shadow-lg shadow-gray-600/10 border grid gap-3'>

            <header className='relative flex flex-wrap items-center justify-between'>
               <Button
                  className='hover:text-blue-500'
                  onClick={() => navigate('/actividades', { replace: true })}>
                  <i className='fas fa-arrow-left fa-lg' />
               </Button>

               <Button 
                  className='bg-amber-100/60 hover:bg-amber-100 text-amber-500 text-sm absolute left-1/2 transform -translate-x-1/2'
                  onClick={() => setShowModal(true)}  
               >
                  <i className="fas fa-stream" />
                  asignar predecesora
               </Button>

               <div className='flex gap-1.5 p-1.5 rounded-full bg-black/10'>
                  <PrioritySelector
                     disabled={priority === 1000}
                     onClick={onNone}
                  />
                  <PrioritySelector
                     disabled={priority === 600}
                     color='bg-green-500/70'
                     onClick={onLow}
                  />
                  <PrioritySelector
                     disabled={priority === 400}
                     color='bg-yellow-500/80'
                     onClick={onMid}
                  />
                  <PrioritySelector
                     disabled={priority === 100}
                     color='bg-red-500/70'
                     onClick={onHigh}
                  />
               </div>
            </header>

            <h1 className='text-xl text-center font-semibold capitalize truncate'>
               {title || 'Sin titulo'}
            </h1>
            {children}

            <MarkActivity 
               condicion={isTicket}
               position='absolute -top-3.5 left-1/2 transform -translate-x-1/2'
               hidden={!isChildren}
            >
               <i className='fas fa-child fa-lg' />
               {idFather}
            </MarkActivity>

            <MarkActivity 
               condicion={isTicket}
               position='absolute -top-3.5 left-1/2 transform -translate-x-1/2'
               hidden={!isFather}
            >
               <i className='fas fa-hat-cowboy fa-lg' />
               {id} 
            </MarkActivity>

            <MarkActivity 
               condicion={isTicket}
               position='absolute -top-3.5 left-1/2 transform -translate-x-1/2'
               hidden={!isCoorActivity}
            >
               <i className='far fa-calendar-alt fa-lg' />
               {idFather} 
            </MarkActivity>

            <MarkActivity 
               condicion={isTicket}
               position='absolute -top-3.5 left-1/2 transform -translate-x-1/2'
               hidden={!isReviewedActivity}
            >
               <i className='fas fa-calendar-check fa-lg' />
               {idFather} 
            </MarkActivity>

            <MarkActivity 
               condicion={isTicket}
               position='absolute -top-3.5 left-1/2 transform -translate-x-1/2'
               hidden={!isChildrenAndChildren}
            >
               <i className='fas fa-child' />
               <i className='fas fa-hat-cowboy' />
               {idFather} 
            </MarkActivity>

            <MarkActivity 
               condicion={isTicket}
               hidden={!isDeliveryActivity} 
            >
               <i className='fas fa-truck fa-lg' />
               {idFather} 
            </MarkActivity>

         </div>

         <Modal
            showModal={showModal}
            onClose={() => setShowModal(false)}
            isBlur={false}
            padding='p-6'
            className='max-w-3xl'
            title='Seleccionar actividades predecesoras'
         >
            
            <div className='my-10'>

               <Box isBlock>
                  <span className='col-span-1 text-center py-2' >Nº</span>
                  <span className='col-span-2 text-center py-2 border-l' >Actividad</span>
                  <span className='col-span-2 text-center py-2 border-l' >Condicion</span>
                  <span className='col-span-2 text-center py-2 border-l' >Restriccion</span>
               </Box>

               <Box isBlock>
                  
                  <Button 
                     className='bg-emerald-100 hover:bg-emerald-200 text-emerald-500 mx-auto'
                     onClick={handleAddRestriction}
                  >
                     Agregar
                  </Button>

                  <CustomSelect 
                     className='col-span-2' 
                     options={arr} 
                     width='w-full'
                     onChange={(option) => setOptions({ ...options, act: option})}
                     value={options.act}
                  />

                  <CustomSelect 
                     className='col-span-2' 
                     options={arr} 
                     width='w-full' 
                     onChange={(option) => setOptions({ ...options, cond: option})}
                     value={options.cond}
                  />

                  <div className='col-span-2'>
                     <Switch name='Alta' value={sw.isHigh.status} onChange={(value) => setSw({isHigh: {...sw.isHigh, status: value}, isLow: {...sw.isLow, status: false}})} />
                     
                     <Switch name='Relajada' value={sw.isLow.status} onChange={(value) => setSw({isLow: {...sw.isLow, status: value}, isHigh: {...sw.isHigh, status: false}})} />
                  </div>
                  
               </Box>

               <div className='mt-5'>
                  
                  {restrinccions.length > 0 ?
                     restrinccions.map((res, i) => (

                        <Box key={res.id}>

                           <Numerator number={1 + i} />

                           <span className='col-span-2 text-center'>{res.act}</span>

                           <span className='col-span-2 text-center'>{res.cond}</span>

                           <div className='flex items-center gap-2 justify-between col-span-2 px-3'>

                              <span>{res.rest}</span>

                              <Button 
                                 className='hover:bg-red-100 text-red-500'
                                 onClick={() => handleDeleteRestriction(res.id)}
                              >
                                 <i className="fas fa-trash-alt" />
                              </Button>

                           </div>
                           
                        </Box>

                     ))
                     : 
                     <span className='text-sm pl-4 text-zinc-400'>
                        No hay restricciones...
                     </span>
                  }

               </div>

            </div>

         </Modal>

      </>
   )
}

export default View
