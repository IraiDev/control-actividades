import { useContext,useState } from 'react'
import { ActivityContext } from '../context/ActivityContext'
import { useActivityPr } from '../hooks/useActivityPr'
import StaticSelect from '../components/ui/StaticSelect'
import InputFilter from '../components/filter/InputFilter'
import SelectFilter from '../components/filter/SelectFilter'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import Numerator from '../components/ui/Numerator'
import FooterCounter from '../components/ui/FooterCounter'
import FooterPage from '../components/ui/FooterPage'
import Table from '../components/table2/Table'
import TBody from '../components/table2/TBody'
import Td from '../components/table2/Td'
import Th from '../components/table2/Th'
import THead from '../components/table2/THead'
import { useForm } from '../hooks/useForm'
import { Pagination } from '@mui/material'
import { useWindowSize } from '../hooks/useWindowSize'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import CustomSelect from '../components/ui/CustomSelect'
import { useEffect } from 'react'

const RA_STATES = [
   { value: 0, label: 'En Fila'},
   { value: 1, label: 'Pendiente'},
   { value: 2, label: 'En Trabajo'},
   { value: 3, label: 'Para Revision'},
   { value: 5, label: 'Terminado'},
   { value: 8, label: 'Para Facturar'},
   { value: 10, label: 'Pausa'},
   { value: 11, label: 'Entregado'}
]

const PRODUCT_ZIONIT = [
   { value: '1', label: 'Desarrollador A'},
   { value: '2', label: 'Desarrollador B'},
   { value: '3', label: 'Investigación'},
   { value: '4', label: 'Diseño'},
]

const CheckBox = ({ checked, onChange, id }) => {
   return (
      <label
         htmlFor={id}
         className={`flex gap-2 justify-center ${
            checked ? 'text-blue-500' : ''
         }`}>
         <input id={id} type='checkbox' checked={checked} onChange={onChange} />
         Revisado
      </label>
   )
}

const BoxHeader = ({children}) => {
   return (
      <>
         <section className='flex gap-3 items-baseline w-full px-2 rounded-md mb-3'>

            <span className='block w-16 h-5' />

            <div className='grid grid-cols-6 gap-2 w-full'>

               <h3 className='font-semibold text-sm col-span-2'>Producto Zionit</h3>

               <h3 className='font-semibold text-sm col-span-2'>Glosa explicativa</h3>

               <h3 className='font-semibold text-sm col-span-1'>Tiempo (hrs)</h3>

               {/* <span /> */}

            </div>
         </section>
         <section className='flex gap-3 items-baseline w-full bg-zinc-100 px-2 rounded-md'>

            <span className='block w-16 h-5' />

            <div className='grid grid-cols-6 gap-2 items-center'>

               {children}

            </div>
         </section>
      </>
   )
}

const BoxContent = ({children}) => {
   return (
      <section className='flex gap-3 items-baseline w-full bg-zinc-100 px-2 rounded-md'>

         <Numerator number={1} />

         <div className='grid grid-cols-6 gap-2 items-center'>

            {children}
           
         </div>
      </section>
   )
}

const Revision = () => {
   const { 
      activitiesPR, 
      total 
   } = useActivityPr()

   // context
   const { 
      savePRFilters,
      prPager,
      setPRPager,
      setPROrder,
      prOrder,
      optionsArray
   } = useContext(ActivityContext)

   // states
   const [multiline, setMultiline] = useState(false)
   const [values, setValues] = useState({ reviewed: false })
   const [options, setOptions] = useState({})
   const [modal, setModal] = useState(false)
   const [distributionTime, setDistributionTime] = useState([])

   // hooks
   const size = useWindowSize()
   const [{ 
      id, 
      title, 
      desc, 
      ticket,
      time,
      gloss
   }, onChangeValues, reset] =
   useForm({
      id: '',
      title: '',
      desc: '',
      ticket: '',
      time: '',
      gloss: '',
   })

   // destructuring
   const { projects, subProjects, users } = optionsArray

   // functions
   const onFilter = () => {
      const filters = {
         estado: 
            options.st?.length > 0 ? options.st.map(item => item.value) : [],
         proyecto:
            options.pr?.length > 0 ? options.pr.map(item => item.value) : [],
         encargado:
            options.ue?.length > 0 ? options.ue.map(item => item.label) : [],
         solicitante:
            options.us?.length > 0 ? options.us.map(item => item.label) : [],
         subProy:
            options.sp?.length > 0 ? options.sp.map(item => item.value) : [],
         id_actividad: id,
         titulo: title,
         descripcion: desc,
         offset: 0,
      }

      setPRPager({ ...prPager, page: 1 })

      savePRFilters({ payload: filters })
   }

   const onClear = () => {
      savePRFilters({ reset: true })
      setOptions({
         st: [],
         pr: [],
         ue: [],
         us: [],
         sp: [],
      })
      reset()
      setPROrder({})
   }

   const setActive = ({ param, value }) => {
      const k = Object.keys(prOrder).some(k => k === param)
      const v = Object.values(prOrder).some(v => v === value)
      return k && v
   }

   const onChangeSelect = e => {
      setPRPager({ page: 1, limit: e.target.value })
      savePRFilters({
         payload: { limit: e.target.value, offset: 0 },
      })
   }

   const onChangePage = (e, value) => {
      const offset = ((value - 1) * prPager.limit) % total
      setPRPager({ ...prPager, page: value })
      savePRFilters({ payload: { offset, limit: prPager.limit } })
   }

   const handleCreateDistributionTime = () => {
      setDistributionTime(distributionTime => [...distributionTime, {
         id: distributionTime.length + 1,
         product: options?.product?.value,
         time,
         gloss,
      }])
      setOptions({...options, product: {value: null, label: 'ninguno'}})
      reset()
   }

   useEffect(() => {
      console.log(distributionTime)
   }, [distributionTime])
 
   return (
      <>
      <Container type='table'>

         <Table>
            <THead>
               <tr className='text-center capitalize'>

                  <Th></Th>
                  <Th>
                     <InputFilter
                        type='table'
                        width='w-16'
                        isNumber
                        name='id'
                        value={id}
                        onChange={onChangeValues}
                        filterDown={() => setPROrder({ orden_id: 'desc' })}
                        filterUp={() => setPROrder({ orden_id: 'asc' })}
                        upActive={setActive({
                           param: 'orden_id',
                           value: 'asc',
                        })}
                        downActive={setActive({
                           param: 'orden_id',
                           value: 'desc',
                        })}
                     />
                  </Th>

                  <Th>
                     <InputFilter
                        type='table'
                        width='w-16'
                        name='ticket'
                        value={ticket}
                        onChange={onChangeValues}
                     />
                  </Th>

                  <Th>
                     <SelectFilter
                        type='table'
                        value={options.pr}
                        options={projects}
                        isMulti
                        onChange={option =>
                           setOptions({ ...options, pr: option })
                        }
                        filterDown={() =>
                           setPROrder({ orden_proyecto: 'desc' })
                        }
                        filterUp={() =>
                           setPROrder({ orden_proyecto: 'asc' })
                        }
                        upActive={setActive({
                           param: 'orden_proyecto',
                           value: 'asc',
                        })}
                        downActive={setActive({
                           param: 'orden_proyecto',
                           value: 'desc',
                        })}
                     />
                  </Th>

                  <Th>
                     <SelectFilter
                        type='table'
                        value={options.sp}
                        options={
                           options.pr?.length > 1
                              ? []
                              : options.pr?.length > 0
                              ? subProjects?.filter(
                                   s => s.id === options.pr[0]?.value
                                )
                              : subProjects
                        }
                        isMulti
                        isOrder={false}
                        onChange={option =>
                           setOptions({ ...options, sp: option })
                        }
                     />
                  </Th>

                  <Th>
                     <SelectFilter
                        type='table'
                        value={options.us}
                        options={users}
                        isMulti
                        onChange={option =>
                           setOptions({ ...options, us: option })
                        }
                        filterDown={() =>
                           setPROrder({ orden_solicitante: 'desc' })
                        }
                        filterUp={() =>
                           setPROrder({ orden_solicitante: 'asc' })
                        }
                        upActive={setActive({
                           param: 'orden_solicitante',
                           value: 'asc',
                        })}
                        downActive={setActive({
                           param: 'orden_solicitante',
                           value: 'desc',
                        })}
                     />
                  </Th>

                  <Th>
                     <SelectFilter
                        type='table'
                        value={options.ue}
                        options={users}
                        isMulti
                        onChange={option =>
                           setOptions({ ...options, ue: option })
                        }
                        filterDown={() =>
                           setPROrder({ orden_encargado: 'desc' })
                        }
                        filterUp={() =>
                           setPROrder({ orden_encargado: 'asc' })
                        }
                        upActive={setActive({
                           param: 'orden_encargado',
                           value: 'asc',
                        })}
                        downActive={setActive({
                           param: 'orden_encargado',
                           value: 'desc',
                        })}
                     />
                  </Th>

                  <Th>
                     <SelectFilter
                        type='table'
                        value={options.st}
                        options={RA_STATES}
                        isMulti
                        onChange={option =>
                           setOptions({ ...options, st: option })
                        }
                        filterDown={() =>
                           setPROrder({ orden_estado: 'desc' })
                        }
                        filterUp={() =>
                           setPROrder({ orden_estado: 'asc' })
                        }
                        upActive={setActive({
                           param: 'orden_estado',
                           value: 'asc',
                        })}
                        downActive={setActive({
                           param: 'orden_estado',
                           value: 'desc',
                        })}
                     />
                  </Th>

                  <Th>
                     <InputFilter
                        type='table'
                        width='w-28'
                        name='title'
                        value={title}
                        onChange={onChangeValues}
                        filterDown={() =>
                           setPROrder({ orden_actividad: 'desc' })
                        }
                        filterUp={() =>
                           setPROrder({ orden_actividad: 'asc' })
                        }
                        upActive={setActive({
                           param: 'orden_actividad',
                           value: 'asc',
                        })}
                        downActive={setActive({
                           param: 'orden_actividad',
                           value: 'desc',
                        })}
                     />
                  </Th>

                  <Th>
                     <InputFilter
                        type='table'
                        width='w-96'
                        name='desc'
                        value={desc}
                        onChange={onChangeValues}
                        isOrder={false}
                     />

                  </Th>

                  <Th>
                     <div className='flex justify-around pt-3 gap-2'>
                        <Button
                           className='hover:bg-black/10 bg-black/5'
                           title='Limpiar filtros'
                           isShadow
                           onClick={onClear}
                        >
                           <i className='fas fa-eraser' />
                        </Button>
                        <Button
                           className='bg-blue-600 hover:bg-blue-500 text-white'
                           isShadow
                           onClick={onFilter}
                        >
                           filtrar <i className='fas fa-filter' />
                        </Button>
                     </div>
                  </Th>

               </tr>

               <tr className='text-center capitalize'>
                  <Th primary >Nᵒ</Th>
                  <Th primary >ID</Th>
                  <Th primary >ticket</Th>
                  <Th primary >proyecto</Th>
                  <Th primary >sub proyecto</Th>
                  <Th primary >solicitante</Th>
                  <Th primary >encargado</Th>
                  <Th primary >estado</Th>
                  <Th primary >
                     <div className='flex items-baseline justify-center gap-2'>
                        actividad
                        <Button
                           className='hover:bg-white/5'
                           onClick={() => setMultiline(!multiline)}>
                           <i
                              className={
                                 multiline
                                    ? 'fas fa-angle-up'
                                    : 'fas fa-angle-down'
                              }
                           />
                        </Button>
                     </div>
                  </Th>
                  <Th primary >
                     <div className='flex items-baseline justify-center gap-2'>
                        descripcion
                        <Button
                           className='hover:bg-white/5'
                           onClick={() => setMultiline(!multiline)}>
                           <i
                              className={
                                 multiline
                                    ? 'fas fa-angle-up'
                                    : 'fas fa-angle-down'
                              }
                           />
                        </Button>
                     </div>
                  </Th>
                  <Th primary ><i className='fas fa-check' /></Th>
               </tr>
            </THead>
            <TBody>
               {activitiesPR.length > 0 &&
                  activitiesPR.map((act, i) => (
                     <tr
                        key={act.id_det}
                        className='text-[13px] text-gray-800 transition duration-300 cursor-pointer hover:bg-black/10'
                        onDoubleClick={() => setModal(true)}
                     >
                           
                        <Td><Numerator number={i + 1} /></Td>

                        <Td>{act.id_det}</Td>

                        <Td>{act.num_ticket_edit || '--'}</Td>

                        <Td>{act.abrev}</Td>

                        <Td>{act.nombre_sub_proy ?? '--'}</Td>

                        <Td>{act.user_solicita}</Td>

                        <Td>{act.encargado_actividad}</Td>

                        <Td>{RA_STATES.find(s => s.value === act.estado).label}</Td>

                        <Td
                           isMultiLine={multiline}
                           width='max-w-[150px]'
                           align='text-left'
                        >
                           {act.actividad || 'Sin Titulo'}
                        </Td>

                        <Td isMultiLine={multiline} align='text-left'>
                           {act.func_objeto}
                        </Td>
                        <Td>
                           <CheckBox
                              id={i}
                              checked={values.reviewed}
                              onChange={e =>
                                 setValues({
                                    ...values,
                                    reviewed: e.target.checked,
                                 })
                              }
                           />
                        </Td>
                     </tr>
                  ))}
            </TBody>
         </Table>

      </Container>

      <FooterPage>

         <FooterCounter count={activitiesPR.length} />

         <Pagination
            siblingCount={size.width < 480 ? 0 : 1}
            boundaryCount={size.width < 480 ? 0 : 1}
            size='small'
            count={
               prPager.limit === ''
                  ? 1
                  : Math.ceil(Number(total) / Number(prPager.limit))
            }
            color='primary'
            onChange={onChangePage}
            page={prPager.page}
         />
         
         <StaticSelect value={prPager.limit} onChange={onChangeSelect} />

      </FooterPage>

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
                        options={PRODUCT_ZIONIT}
                        value={options?.product}
                        onChange={option => setOptions({ ...options, product: option })}
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
                     onClick={handleCreateDistributionTime}
                  >
                     agregar
                  </Button>
               </BoxHeader>
 
               <h5 className='pl-4 text-sm my-5'>Distribucion de tiempo</h5>

               <BoxContent>
                  <section className='col-span-2'>
                     <CustomSelect />
                  </section>

                  <Input className='pb-2 col-span-2' />

                  <Input 
                     className='pb-2 col-span-1'
                     placeholder='ej:1.5' 
                     isNumber 
                  />

                  <section className='flex gap-2 justify-center col-span-1'>

                     <Button className='bg-emerald-100 hover:bg-emerald-200 text-emerald-500'>
                        <i className='fas fa-check' />
                     </Button>

                     <Button className='bg-red-100 hover:bg-red-200 text-red-500'>
                        <i className='fas fa-trash-alt' />
                     </Button>

                  </section>
               </BoxContent>

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

export default Revision
