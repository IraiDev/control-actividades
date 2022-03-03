import { useEffect, useState, useContext } from 'react'
import { ActivityContext } from '../../../context/ActivityContext'
import { useForm } from '../../../hooks/useForm'
import Button from '../../ui/Button'
import CustomSelect from '../../ui/CustomSelect'
import Input from '../../ui/Input'
import Modal from '../../ui/Modal'
import Numerator from '../../ui/Numerator'

const BoxHeader = ({children}) => {
   return (
      <>
         <section className='flex gap-3 items-baseline w-full px-2 rounded-md mb-3'>

            <span className='block w-8 h-5' />

            <div className='grid grid-cols-6 gap-2 w-full'>

               <h3 className='font-semibold text-sm col-span-2 text-center'>Producto Zionit</h3>

               <h3 className='font-semibold text-sm col-span-2 text-center'>Glosa explicativa</h3>

               <h3 className='font-semibold text-sm col-span-1 text-center'>Tiempo (hrs)</h3>

               <h3 className='font-semibold text-sm col-span-1 text-center'>20</h3>

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

const BoxContent = ({children, number}) => {
   return (
      <section className='flex gap-3 items-baseline w-full bg-zinc-100 px-2 rounded-md mb-2 shadow-md'>

         <Numerator number={number + 1} />

         <div className='grid grid-cols-6 gap-2 items-center'>

            {children}
           
         </div>
      </section>
   )
}

const TrPRControls = (props) => {
   
   const isReviwed = props.estado === 11

   const { optionsArray } = useContext(ActivityContext)
   
   const [options, setOptions] = useState({st: { value: 3, label: 'P.R'}})
   const [modal, setModal] = useState(false)
   const [times, setTimes] = useState([])
   const [inputValues, setInputValues] = useState([])

   const [{ 
      time,
      gloss
   }, onChangeValues, reset] = useForm({
      time: '',
      gloss: '',
   })

   // destructuring
   const { products } = optionsArray

   const handleCreateTimes = () => {
      setTimes(times => [...times, {
         id: times.length + 1,
         product: options?.product,
         time,
         gloss,
      }])
      setOptions({...options, product: {value: null, label: 'ninguno'}})
      reset()
   }

   const handleUpdateTimes = (id) => {
      setTimes(times.map(dis => {
         const newValues = inputValues.find(i => i.id === dis.id)
         if (dis.id === id) {
            return {
               ...dis,
               time: newValues[`time${id}`],
               gloss: newValues[`gloss${id}`],
            }
         }
         return dis
      }))
   }

   const handleDeleteTimes = (id) => {
      setTimes(times.filter(dis => dis.id !== id))
   }

   const handleOpenModal = () => {
      setInputValues(times?.map(dis => {
         return {
            id: dis.id,
            [`time${dis.id}`]: dis.time,
            [`gloss${dis.id}`]: dis.gloss,
         }
      }))

      setModal(true)
   }

   useEffect(() => {
      setInputValues(times?.map(dis => {
         return {
            id: dis.id,
            [`time${dis.id}`]: dis.time,
            [`gloss${dis.id}`]: dis.gloss,
         }
      }))
   }, [times])

  return (
   <>
      <tr
         className='text-[13px] text-gray-800 transition duration-300 cursor-pointer hover:bg-black/10'
         onDoubleClick={isReviwed ? () => handleOpenModal() : null} 
      >
         {props.children}
      </tr>


      <Modal 
         showModal={modal} 
         isBlur={false} 
         onClose={() => setModal(false)}
         className='max-w-3xl'
         padding='p-6'
         title='pasar a entregado'
      >
         <div className='mt-10'>

            <BoxHeader>
               <section className='col-span-2'>
                  <CustomSelect
                     options={products}
                     value={options?.product}
                     onChange={option => setOptions({ ...options, product: option })}
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
                  onClick={handleCreateTimes}
               >
                  agregar
               </Button>
            </BoxHeader>

            <h5 className='pl-4 text-sm my-5'>Lista de distribucion de tiempos</h5>

            {times.length > 0 ?
               times.map((dis, i) => (

               <BoxContent key={i} number={i}>
                  <section className='col-span-2'>
                     <CustomSelect
                        options={products}
                        value={dis.product}
                        onChange={option => setTimes(times.map(d => d.id === dis.id ? { ...d, product: option } : d))}
                        menuHeight={150}
                     />
                  </section>

                  <Input 
                     className='pb-2 col-span-2'
                     value={inputValues[i]?.[`gloss${dis.id}`] || ''}
                     onChange={e => setInputValues(inputValues.map(i => i.id === dis.id ? { ...i, [`gloss${dis.id}`]: e.target.value } : i))}
                     />

                  <Input 
                     className='pb-2 col-span-1'
                     placeholder='ej:1.5' 
                     isNumber
                     value={inputValues[i]?.[`time${dis.id}`] || ''}
                     onChange={e => setInputValues(inputValues.map(i => i.id === dis.id ? { ...i, [`time${dis.id}`]: e.target.value } : i))}
                  />

                  <section className='flex gap-2 justify-center col-span-1'>

                     <Button 
                        className='bg-emerald-100 hover:bg-emerald-200 text-emerald-500'
                        onClick={() => handleUpdateTimes(dis.id)}
                     >
                        <i className='fas fa-check' />
                     </Button>

                     <Button 
                        className='bg-red-100 hover:bg-red-200 text-red-500'
                        onClick={() => handleDeleteTimes(dis.id)}   
                     >
                        <i className='fas fa-trash-alt' />
                     </Button>

                  </section>
               </BoxContent>

               ))
               : 
               <span className='text-sm text-zinc-400 pl-8'>
                  No hay distribucion de tiempos...
               </span>
            }

            <footer className='flex justify-between mt-10'>
               <Button 
                  className='bg-red-100 hover:bg-red-200 text-red-500'
               >
                  cancelar
               </Button>

               <Button 
                  className='bg-emerald-100 hover:bg-emerald-200 text-emerald-500'
               >
                  Guardar
               </Button>
            </footer>
         </div>
      </Modal>

   </>
  )
}

export default TrPRControls