import { useEffect, useState, useContext } from 'react'
import NumberFormat from 'react-number-format'
import { ActivityContext } from '../../../context/ActivityContext'
import { Alert } from '../../../helpers/alerts'
import { useForm } from '../../../hooks/useForm'
import Button from '../../ui/Button'
import CustomSelect from '../../ui/CustomSelect'
import Input from '../../ui/Input'
import Modal from '../../ui/Modal'
import Numerator from '../../ui/Numerator'

const BoxHeader = ({ children, time, modTime }) => {
   return (
      <>
         <section className='flex gap-3 items-baseline w-full px-2 rounded-md mb-3'>
            <span className='block w-8 h-5' />

            <div className='grid grid-cols-6 gap-2 w-full'>
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
                     value={time} 
                     decimalScale={4} 
                     fixedDecimalScale={false}
                     displayType='text' 
                  /> 
                  /
                  <NumberFormat 
                     className={modTime < 0 ? 'text-red-500' : modTime === 0 ? 'text-green-500' : ''}
                     value={modTime} 
                     decimalScale={4} 
                     fixedDecimalScale={false}
                     displayType='text' 
                  />
               </div>
            </div>
         </section>
         <section className='flex gap-3 items-baseline w-full bg-zinc-100 px-2 rounded-md shadow-md'>
            <span className='block w-16 h-5' />

            <div className='grid grid-cols-6 gap-2 items-center'>
               {children}
            </div>
         </section>
      </>
   )
}

const BoxContent = ({ children, number }) => {
   return (
      <section className='flex gap-3 items-baseline w-full bg-zinc-100 px-2 rounded-md mb-2 shadow-md'>
         <Numerator number={number + 1} />

         <div className='grid grid-cols-6 gap-2 items-center'>{children}</div>
      </section>
   )
}

const TrPRControls = props => {
   const isReviwed = props.estado === 12

   const { optionsArray } = useContext(ActivityContext)

   const [options, setOptions] = useState({ st: { value: 3, label: 'P.R' } })
   const [modal, setModal] = useState(false)
   const [times, setTimes] = useState([])
   const [inputValues, setInputValues] = useState([])
   const [tr, setTr] = useState(props.tiempo_trabajado)

   const [{ time, gloss }, onChangeValues, reset] = useForm({
      time: '',
      gloss: '',
   })

   // destructuring
   const { products } = optionsArray

   const handleCreateTimes = () => {
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

   const handleUpdateTimes = id => {

      const newValues = inputValues.find(i => i.id === id)

      // setTr(props.tiempo_trabajado.toFixed(4) - inputValues.reduce((a, b) => Number(a) + Number(b.tiempo), 0))

      setTimes(
         times.map(dis => {
            if (dis.id_dist_tiempo_act === id) {
               return {
                  ...dis,
                  tiempo_dist_act: newValues.tiempo,
                  glosa_dist_tiempos_act: newValues.glosa,
                  id_producto: Number(newValues.producto.value),
               }
            }
            return dis
         })
      )
   }

   const handleDeleteTimes = id => {

      const filter = times.filter(dis => dis.id_dist_tiempo_act !== id)

      // setTr(props.tiempo_trabajado.toFixed(4) - filter.reduce((a, b) => Number(a) + Number(b.tiempo_dist_act), 0))

      setTimes(filter)

      // setInputValues(
      //    filter?.map(dis => {
      //       return {
      //          id: dis.id_dist_tiempo_act,
      //          tiempo: dis.tiempo_dist_act,
      //          glosa: dis.glosa_dist_tiempos_act,
      //          producto: products.find(p => Number(p.value) === dis.id_producto),
      //       }
      //    })
      // )
   }

   const handleOpenModal = () => {

      // setTr(props.tiempo_trabajado.toFixed(4) - times.reduce((a, b) => Number(a) + Number(b.tiempo_dist_act), 0))
      setModal(true)
   }

   const onCloseModal = () => {

      const action = () => {
         setTimes(props.tiempos_distribuidos)
         setInputValues([])
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
      props.callback(times)
      setInputValues([])
      setModal((false))
   }

   useEffect(() => {
      setTimes(props.tiempos_distribuidos)
      // eslint-disable-next-line
   }, [])

   useEffect(() => {
      setInputValues(
         times?.map(dis => {
            return {
               id: dis.id_dist_tiempo_act,
               tiempo: dis.tiempo_dist_act,
               glosa: dis.glosa_dist_tiempos_act,
               producto: products.find(p => Number(p.value) === dis.id_producto),
            }
         })
      )
      // eslint-disable-next-line
   }, [times])

   useEffect(() => {
      setTr(props.tiempo_trabajado.toFixed(4) - inputValues.reduce((a, b) => Number(a) + Number(b.tiempo), 0))

      // eslint-disable-next-line
   }, [inputValues])

   return (
      <>
         <tr
            className='text-[13px] text-gray-800 transition duration-300 cursor-pointer hover:bg-black/10'
            onDoubleClick={isReviwed ? () => handleOpenModal() : null}>
            {props.children}
         </tr>

         <Modal
            showModal={modal}
            isBlur={false}
            onClose={onCloseModal}
            className='max-w-3xl'
            padding='p-6'
            title='pasar a entregado'>
            <div className='mt-10'>
               <BoxHeader time={props.tiempo_trabajado} modTime={tr}>
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
                     className='pb-2 col-span-2'
                     name='gloss'
                     value={gloss}
                     onChange={onChangeValues}
                  />

                  <Input
                     className='pb-2 col-span-1'
                     placeholder='ej:1.5'
                     isNumber
                     name='time'
                     value={time}
                     onChange={onChangeValues}
                  />

                  <Button
                     className='bg-emerald-100 hover:bg-emerald-200 text-emerald-500 col-span-1 mx-auto'
                     onClick={handleCreateTimes}>
                     agregar
                  </Button>
               </BoxHeader>

               <h5 className='pl-4 text-sm my-5'>
                  Lista de distribucion de tiempos
               </h5>

               {times.length > 0 ? (
                  times.map((dis, i) => (
                     <BoxContent key={i} number={i}>
                        <section className='col-span-2'>
                           <CustomSelect
                              options={products}
                              value={inputValues[i]?.producto ?? {value: null, label: 'ninguno'}}
                              onChange={option => {
                                 setInputValues(inputValues.map(inp => {
                                    if (inp.id === dis.id_dist_tiempo_act) {
                                       return { ...inp, producto: option }
                                    }
                                    return inp
                                 }))
                              }}
                              menuHeight={150}
                           />
                        </section>

                        <Input
                           className='pb-2 col-span-2'
                           value={inputValues[i]?.glosa ?? ''}
                           onChange={e => {
                              setInputValues(inputValues.map(inp => {
                                 if (inp.id === dis.id_dist_tiempo_act) {
                                    return { ...inp, glosa: e.target.value }
                                 }
                                 return inp
                              }))
                           }}
                        />

                        <Input
                           className='pb-2 col-span-1'
                           placeholder='ej:1.5'
                           isNumber
                           value={inputValues[i]?.tiempo ?? ''}
                           onChange={e => {
                              setInputValues(inputValues.map(inp => {
                                 if (inp.id === dis.id_dist_tiempo_act) {
                                    return { ...inp, tiempo: e.target.value }
                                 }
                                 return inp
                              }))
                           }}
                        />

                        <section className='flex gap-2 justify-center col-span-1'>
                           <Button
                              className='bg-emerald-100 hover:bg-emerald-200 text-emerald-500'
                              onClick={() =>
                                 handleUpdateTimes(dis.id_dist_tiempo_act)
                              }>
                              <i className='fas fa-check' />
                           </Button>

                           <Button
                              className='bg-red-100 hover:bg-red-200 text-red-500'
                              onClick={() =>
                                 handleDeleteTimes(dis.id_dist_tiempo_act)
                              }>
                              <i className='fas fa-trash-alt' />
                           </Button>
                        </section>
                     </BoxContent>
                  ))
               ) : (
                  <span className='text-sm text-zinc-400 pl-8'>
                     No hay distribucion de tiempos...
                  </span>
               )}

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
