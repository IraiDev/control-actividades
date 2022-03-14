import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
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

const TrPRControls = props => {
   const isReviwed = props.estado === 5

   const navigate = useNavigate()

   const { optionsArray } = useContext(ActivityContext)

   const [options, setOptions] = useState()
   const [modal, setModal] = useState(false)
   const [times, setTimes] = useState([])
   const [tr, setTr] = useState(props.tiempo_trabajado)

   const [{ time, gloss }, onChangeValues, reset] = useForm({
      time: 0,
      gloss: '',
   })

   // destructuring
   const { products } = optionsArray

   const handleCreateTimes = () => {

      if (Number(time) > Number(tr.toFixed(2))) {
         Alert({
            icon: 'warn',
            title: 'Atención',
            content: 'El tiempo ingresado es mayor al tiempo restante, por favor modifique el valor y vuelva a intentarlo',
            showCancelButton: false, 
         })

         return
      }

      if (gloss === '' || options.product.value === undefined) {
         Alert({
            icon: 'warn',
            title: 'Atención',
            content: 'Por favor complete todos los campos',
            showCancelButton: false,
         })

         return
      }

      if (time === 0) {
         Alert({
            icon: 'warn',
            title: 'Atención',
            content: 'No puedes crear una distribucion de tiempo con 0 horas',
            showCancelButton: false,
         })

         return
      }

      setTimes(times => [
         ...times,
         {
            id: times.length + 1,
            id_producto: Number(options?.product?.value),
            tiempo_dist_act: time,
            glosa_dist_tiempos_act: gloss,
         },
      ])
      setOptions({ ...options, product: { value: null, label: 'ninguno' } })
      reset()
   }

   const handleDeleteTimes = id => {

      const filter = times.filter(dis => dis.id_dist_tiempo_act !== id)

      setTimes(filter)
   }

   const handleOpenModal = () => {
      props.getId(props.id_det)
      setModal(true)
   }

   const onCloseModal = () => {

      const action = () => {
         setTimes(props.tiempos_distribuidos)
         setModal(false)
      }

      Alert({
         icon: 'warn',
         title: 'Atención',
         content: 'Al cancelar perdera todas las modificaciones realizadas',
         cancelText: 'No, volver',
         confirmText: 'Si, cancelar',
         action
      })
      
   }

   const handleApplyChanges = () => {

      const some = times.some(dis => Number(dis.tiempo_dist_act) === 0)

      if (tr < 0) {
         Alert({
            icon: 'warn',
            title: 'Atención',
            content: 'El tiempo restante no puede ser menor a 0, por favor ajuste los valores de la distribucion de tiempos',
            showCancelButton: false,
         })
         return
      }

      if (some) {
         Alert({
            icon: 'warn',
            title: 'Atención',
            content: 'Algunos tiempos son 0, por favor modifique los valores y vuelva a intentarlo',
            showCancelButton: false,
         })
         return
      }

      props.callback(times)
      setModal(false)
      reset()
   }

   const onDoubleClick = () => {
      if (isReviwed) {
         handleOpenModal()
         return
      }

      navigate(`actividad-pr-detalle/${props.id_det}?type_detail=pr`) 
   }

   useEffect(() => {
      setTimes(props.tiempos_distribuidos)
      // eslint-disable-next-line
   }, [])

   useEffect(() => {
      const total = props.tiempo_cliente.toFixed(2)
      setTr(Number(total) - times.reduce((a, b) => Number(a) + Number(b?.tiempo_dist_act), 0).toFixed(2))

      // eslint-disable-next-line
   }, [times])

   return (
      <>
         <tr
            className={`text-[13px] text-gray-800 transition duration-300 cursor-pointer hover:bg-black/10 ${props.className}`}
            onDoubleClick={onDoubleClick}>
            {props.children}
         </tr>

         <Modal
            showModal={modal}
            isBlur={false}
            onClose={onCloseModal}
            className='max-w-4xl'
            padding='p-6'
            title='pasar a entregado'
         >

            <div className='mt-5'>

               <section className='p-3.5 mb-5 bg-zinc-100 rounded-md'>

                  <h1 className='first-letter:capitalize mb-2'>
                     <span className='font-semibold mr-2'>
                        Titulo:
                     </span>  
                     {props.actividad}, {props.id_det}
                  </h1>

                  <h1 className='capitalize font-semibold text-sm'>descripción</h1>

                  <p className='text-zinc-500 text-xs'>{props.func_objeto}</p>

               </section>

               <Box className='bg-white' isBlock >
                  
                  <span className='col-span-1' />

                  <span className='col-span-2' />

                  <span className='col-span-2' />

                  <span className='col-span-1' />

                  <div className='font-semibold text-sm col-span-1 flex justify-between'>
                     <span className='py-1 px-2.5 text-yellow-600 bg-yellow-100 rounded-md' title='Tiempo total'>T.T</span>
                     <span className='py-1 px-2.5 text-emerald-600 bg-emerald-100 rounded-md' title='Tiempo restante'>T.R</span>
                  </div>
               </Box>

               <Box isBlock >

                  <h3 className='font-semibold text-sm col-span-1 py-2 text-center'>
                     Nº
                  </h3>
                  
                  <h3 className='font-semibold text-sm col-span-2 text-center'>
                     Producto Zionit
                  </h3>

                  <h3 className='font-semibold text-sm col-span-2 text-center'>
                     Glosa explicativa
                  </h3>

                  <h3 className='font-semibold text-sm col-span-1 text-center'>
                     Tiempo (hrs)
                  </h3>

                  <div className='font-semibold text-sm col-span-1 flex items-baseline gap-2 justify-center'>
                     <NumberFormat 
                        className='text-yellow-500'
                        value={props.tiempo_cliente} 
                        decimalScale={2} 
                        fixedDecimalScale={false}
                        displayType='text' 
                     /> 
                     /
                     <NumberFormat 
                        className={tr < 0 ? 'text-red-500' : 'text-emerald-500'}
                        value={tr} 
                        decimalScale={2} 
                        fixedDecimalScale={false}
                        displayType='text' 
                     />
                  </div>
               </Box>

               <Box isBlock >

                  <span className='col-span-1 py-6' />

                  <section className='col-span-2'>
                     <CustomSelect
                        options={products}
                        value={options?.product}
                        onChange={option =>
                           setOptions({ ...options, product: option })
                        }
                        menuHeight={150}
                     />
                  </section>

                  <Input
                     className='col-span-2'
                     name='gloss'
                     value={gloss}
                     onChange={onChangeValues}
                  />

                  <Input
                     className='col-span-1'
                     placeholder='ej:1.5'
                     isNumber
                     name='time'
                     value={time}
                     onChange={onChangeValues}
                  />

                  <Button
                     disabled={Number(tr) <= 0}
                     className='bg-emerald-100 hover:bg-emerald-200 text-emerald-500 col-span-1 mx-auto disabled:hover:bg-emerald-200/50'
                     onClick={handleCreateTimes}>
                     agregar
                  </Button>
               </Box>

               <h5 className='pl-4 text-sm my-5'>
                  Lista de distribucion de tiempos
               </h5>

               {times.length > 0 ?
                  times.map((dis, i) => (

                     <Box key={i} isBlock>

                        <Numerator className='mx-auto' number={i + 1} />

                        <section className='col-span-2 py-1'>
                           <CustomSelect
                              options={products}
                              value={products.find(p => Number(times[i]?.id_producto) === Number(p.value)) ?? {value: null, label: 'ninguno'}}
                              onChange={option => {
                                 setTimes(times.map(inp => {
                                    if (inp.id_dist_tiempo_act === dis.id_dist_tiempo_act) {
                                       return { ...inp, id_producto: Number(option.value) }
                                    }
                                    return inp
                                 }))
                              }}
                              menuHeight={150}
                           />
                        </section>

                        <Input
                           className='col-span-2'
                           value={times[i]?.glosa_dist_tiempos_act ?? ''}
                           onChange={e => {
                              setTimes(times.map(inp => {
                                 if (inp.id_dist_tiempo_act === dis.id_dist_tiempo_act) {
                                    return { ...inp, glosa_dist_tiempos_act: e.target.value }
                                 }
                                 return inp
                              }))
                           }}
                        />

                        <Input
                           className='col-span-1'
                           placeholder='ej:1.5'
                           isNumber
                           value={times[i]?.tiempo_dist_act ?? ''}
                           onChange={e => {
                              setTimes(times.map(inp => {
                                 if (inp.id_dist_tiempo_act === dis.id_dist_tiempo_act) {
                                    return { ...inp, tiempo_dist_act: e.target.value }
                                 }
                                 return inp
                              }))
                           }}
                        />

                        <Button
                           className='hover:bg-red-100 text-red-500 mx-auto'
                           onClick={() =>
                              handleDeleteTimes(dis.id_dist_tiempo_act)
                           }>
                           <i className='fas fa-trash-alt' />
                        </Button>

                     </Box>
                     
                  ))
                : 
                  <span className='text-sm text-zinc-400 pl-8'>
                     No hay distribucion de tiempos...
                  </span>
               }

               <footer className='flex justify-between mt-10'>
                  <Button 
                     className='bg-red-100 hover:bg-red-200 text-red-500'
                     onClick={onCloseModal}
                  >
                     cancelar
                  </Button>

                  <Button 
                     className='bg-emerald-100 hover:bg-emerald-200 text-emerald-500'
                     onClick={handleApplyChanges}
                     title='Esto guardara las modificaciones realizadas en la Base de datos'
                  >
                     aplicar cambios
                  </Button>
               </footer>
            </div>
         </Modal>
      </>
   )
}

export default TrPRControls
