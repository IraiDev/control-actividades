import { useContext, useEffect, useState } from 'react'
import { ActivityContext } from '../../context/ActivityContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDetail } from '../../hooks/useDetail'
import { Alert } from '../../helpers/alerts'
import Button from '../ui/Button'
import MarkActivity from '../ui/MarkActivity'
import Modal from '../ui/Modal'
import Switch from '../ui/Switch'
import CustomSelect from '../ui/CustomSelect'
import Numerator from '../ui/Numerator'
import Box from '../ui/Box'
import queryString from 'query-string'
import moment from 'moment'

const initOptions = {
   act: {value: null, label: 'niguno'},
   cond: {value: null, label: 'niguno'},
   acci: {value: null, label: 'niguno'},
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

const View = props => {

   const { 
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
      isPR,
      validateMod,
      callback,
      pausas
   } = props

   const navigate = useNavigate()
   const {search} = useLocation()
   const { type_detail = '' } = queryString.parse(search)

   const {optionsArray} = useContext(ActivityContext)

   const {updatePredecessor, getPredecessor} = useDetail(id, props.num_ticket_edit)

   const [showModal, setShowModal] = useState(false)
   const [sw, setSw] = useState(initSw)
   const [restrinccions, setRestrictions] = useState([])

   const [options, setOptions] = useState(initOptions)
   const [arrOptions, setArrOptions] = useState([])
   const [lastDetention, setLastDetention] = useState(null)

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

      const find = sw.isHigh.status ? 1 : 0

      setRestrictions([...restrinccions, {
         id_predecesoras: restrinccions.length + 1,
         id_det: id,
         id_det_condicion: options?.act.value,
         estado_condicion: options?.cond.value,
         estado_accion: options?.acci.value,
         restriccion: find,
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
         action: () => setRestrictions(restrinccions.filter(r => r.id_predecesoras !== id))
      })
      setOptions(initOptions)
      setSw(initSw)
   }

   const pushPredecessor = () => {
      updatePredecessor({predecesoras: restrinccions})
      setShowModal(false)
      setOptions(initOptions)
      setSw(initSw)
   }

   const openModal = () => {

      const validate = validateMod()

      const action = async () => {

         if(validate) await callback()

         const { list, activities } = await getPredecessor({id_actividad: id, id_ticket: props.num_ticket_edit})

         setRestrictions(list)
         setArrOptions(activities?.map(a => ({value: a.id_det, label: a.descripcion_actividad, tooltip: a.actividad})))

         setShowModal(true)

      }

      if(validate) {
         Alert({
            title: '¡Atención!',
            content: 'Se han realizado modificaciones que no han sido guardadas, ¿Desea guardar antes de continuar?',
            confirmText: 'Si, Guardar y continuar',
            calcelText: 'Cancelar',
            action
         })

         return
      }

      action()
   }

   const onCloseModal = () => {
      Alert({
         icon: 'warn',
         title: 'Atención',
         content: 'Cerrar o cancelar haras que se pierdan todos los cambios no aplicados, ¿Esta seguro de cancelar?',
         cancelText: 'No, cancelar',
         confirmText: 'Si, cancelar',
         action: () => {
            setShowModal(false)
            setOptions(initOptions)
            setSw(initSw)
         }
      })
   }

   const handleBack = () => {

      const validate = validateMod()

      const action = async () => {
         
         navigate(type_detail === 'pr' ? '/revision-actividades' : '/actividades', { replace: true })

      }

      if(validate) {
         Alert({
            title: '¡Atención!',
            content: 'Se han realizado modificaciones que no han sido guardadas, si continua estas se perderan, ¿Desea continuar?',
            confirmText: 'Si y continuar',
            cancelText: 'Volver',
            action
         })

         return 
      }

      action()

   }
   
   useEffect(() => {

      if(pausas.length <= 0) return

      const last = pausas.filter(p => p.boton === 1)

      if (last.length > 0) {

         const date = `${last[0].fecha_detencion} ${last[0].hora_detencion}`

         setLastDetention(moment(date).format('DD-MM-yyyy, HH:MM') )
         
      }

   }, [pausas])
   

   return (
      <>
         <div className='relative bg-white p-4 sm:p-10 rounded-lg shadow-lg shadow-gray-600/10 border grid gap-3'>

            <header className='relative flex flex-wrap items-center justify-between'>
               <Button
                  className='hover:text-blue-500'
                  onClick={handleBack}
               >
                  <i className='fas fa-arrow-left fa-lg' />
               </Button>

               <Button 
                  hidden={isFather || isPR}
                  className='bg-amber-100/60 hover:bg-amber-100 text-amber-500 text-sm absolute left-1/2 transform -translate-x-1/2'
                  onClick={openModal}  
               >
                  <i className="fas fa-stream" />
                  asignar predecesora
               </Button>

               {!isPR &&
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
               }
            </header>

            <h1 
               className='text-xl text-center font-semibold capitalize truncate'
               title={title}
            >
               {title || 'Sin titulo'}
               <span 
                  className='text-zinc-500 font-normal text-base ml-2'
                  title='Ultima detención'
               >
                  [Ult. Det.: { lastDetention ? lastDetention : 'Sin detenciones' }]
               </span>
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
            onClose={onCloseModal}
            isBlur={false}
            padding='p-6'
            className='max-w-5xl'
            title='Seleccionar actividades predecesoras'
         >
            
            <div className='mt-10'>

               <Box colCount={10} isBlock>
                  <span className='col-span-1 text-center py-2' >Nº</span>
                  <span title='Acción que se desea realizar en actividad actual' className='col-span-2 text-center py-2 border-l' >Accion</span>
                  <span title='Predecesora y activiad con la cual se comparara la condicion' className='col-span-2 text-center py-2 border-l' >Actividad</span>
                  <span title='Estado con el cual se debe cumplir para realizar la accción' className='col-span-2 text-center py-2 border-l' >Condicion</span>
                  <span title='Nivel de restriccion para que se cumplan las condiciones: Alta = imperativo, Relajada = sugerencia' className='col-span-2 text-center py-2 border-l' >Restriccion</span>
               </Box>

               <Box colCount={10} isBlock>
                  
                  <span />

                  <CustomSelect 
                     className='col-span-2' 
                     options={optionsArray?.status?.filter(os => (os.value === 2 || os.value === 1) && os.value !== props.estado)}
                     width='w-full' 
                     onChange={(option) => setOptions({ ...options, acci: option})}
                     value={options.acci}
                  />

                  <CustomSelect 
                     showTooltip
                     className='col-span-2' 
                     options={arrOptions} 
                     width='w-full'
                     onChange={(option) => setOptions({ ...options, act: option})}
                     value={options.act}
                  />

                  <CustomSelect 
                     className='col-span-2' 
                     options={optionsArray?.status?.filter(os => os.value !== 0 && os.value !== 10 && os.value !== 8 && os.value !== 11)}
                     width='w-full' 
                     onChange={(option) => setOptions({ ...options, cond: option})}
                     value={options.cond}
                  />

                  <div className='col-span-2'>
                     <Switch hidden name='Alta' value={sw.isHigh.status} onChange={(value) => setSw({isHigh: {...sw.isHigh, status: value}, isLow: {...sw.isLow, status: false}})} />
                     
                     <Switch name='Relajada' value={sw.isLow.status} onChange={(value) => setSw({isLow: {...sw.isLow, status: value}, isHigh: {...sw.isHigh, status: false}})} />
                  </div>

                  <Button 
                     className='bg-emerald-100 hover:bg-emerald-200 text-emerald-500 mx-auto'
                     onClick={handleAddRestriction}
                  >
                     Agregar
                  </Button>
                  
               </Box>

               <div className='mt-5'>
                  
                  {restrinccions.length > 0 ?
                     restrinccions.map((res, i) => (

                        <Box colCount={10} key={res.id_predecesoras}>

                           <Numerator className='mx-auto' number={1 + i} />

                           <span className='col-span-2 text-center'>
                              {optionsArray?.status.find(({value}) => value === res.estado_accion).label}
                           </span>

                           <span className='col-span-2 text-center'>{res.id_det_condicion}</span>

                           <span className='col-span-2 text-center'>
                              {optionsArray?.status.find(({value}) => value === res.estado_condicion).label}
                           </span>
                           <span className='col-span-2 text-center'>
                              {res.restriccion === 1 ? 'Alta' : 'Relajada'}
                           </span>

                           <Button 
                                 className='hover:bg-red-100 text-red-500'
                                 onClick={() => handleDeleteRestriction(res.id_predecesoras)}
                              >
                                 <i className="fas fa-trash-alt" />
                           </Button>
                           
                        </Box>

                     ))
                     : 
                     <span className='text-sm pl-4 text-zinc-400'>
                        No hay restricciones...
                     </span>
                  }

               </div>

               <footer className='flex justify-between gap-2 mt-10'>

                  <Button
                     className='bg-red-100 hover:bg-red-200 text-red-500'
                     onClick={onCloseModal}
                  >
                     cancelar
                  </Button>

                  <Button
                     className='bg-emerald-100 hover:bg-emerald-200 text-emerald-500'
                     onClick={pushPredecessor}
                  >
                     Aplicar cambios
                  </Button>

               </footer>

            </div>

         </Modal>

      </>
   )
}

export default View
