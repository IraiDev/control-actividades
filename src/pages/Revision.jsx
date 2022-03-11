import { useContext, useEffect, useState } from 'react'
import { ActivityContext } from '../context/ActivityContext'
import { useActivityPr } from '../hooks/useActivityPr'
import { useForm } from '../hooks/useForm'
import { useWindowSize } from '../hooks/useWindowSize'
import { Pagination } from '@mui/material'
import { Alert } from '../helpers/alerts'
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
import TrPRControls from '../components/table2/customTR/TrPRControls'
import Modal from '../components/ui/Modal'
import TextArea from '../components/ui/TextArea'
import MarkActivity from '../components/ui/MarkActivity'

const Revision = () => {
   const { 
      activitiesPR, 
      total,
      toggleCheckActivity,
      onDistribution
   } = useActivityPr()

   // context
   const { 
      savePRFilters,
      prPager,
      setPRPager,
      setPROrder,
      prOrder,
      optionsArray,
      prFilters
   } = useContext(ActivityContext)

   // states
   const [multiline, setMultiline] = useState(false)
   const [activityData, setActivityData] = useState({ id: null })
   const [isActive, setIsActive] = useState(null)
   const [options, setOptions] = useState({})
   const [modalReject, toggleModalReject] = useState(false)
   const [soloPadre, setSoloPadre] = useState(false)

   // hooks
   const size = useWindowSize()
   const [{ 
      id, 
      title, 
      desc, 
      ticket,
      reject_gloss,
   }, onChangeValues, reset] = useForm({
      id: '',
      title: '',
      desc: '',
      ticket: '',
      reject_gloss: '',
   })

   // destructuring
   const { projects, subProjects, users, status, activity_type } = optionsArray

   // functions
   const onFilter = () => {
      const filters = {
         estado: 
            options.st ? [options?.st?.value] : [],
         proyecto:
            options.pr?.length > 0 ? options.pr.map(item => item.value) : [],
         encargado:
            options.ue?.length > 0 ? options.ue.map(item => item.label) : [],
         solicitante:
            options.us?.length > 0 ? options.us.map(item => item.label) : [],
         subProy:
            options.sp?.length > 0 ? options.sp.map(item => item.value) : [],
         revisor:
            options.ur?.length > 0 ? options.ur.map(item => item.id) : [],
         id_tipo_actividad: 
            options.ita?.length > 0 ? options.ita.map(item => item.value) : [],
         id_actividad: id,
         titulo: title,
         numero_ticket: ticket,
         descripcion: desc,
         offset: 0,
         solo_padres: soloPadre,
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

   const openModalReject = (id, estado) => { 
      setActivityData({...activityData, id, estado})
      toggleModalReject(true)
   }

   const onCloseModal = () => {
      toggleModalReject(false)
      reset()
   }

   const onChangeCheckedActivity = ({id, title, estado, revisado}) => {

      Alert({
         title: 'Atención',
         content: `${revisado ? 'Aprobar':'Rechazar'} revisión de la siguiente actividad: <strong>${title}</strong>, <strong>${id}</strong>`,
         confirmText: `${revisado ? 'Si, Aprobar':'Si, Rechazar'}`,
         cancelText: 'No, cancelar',
         action: () => {revisado ?
            toggleCheckActivity({id_actividad: id, estado, revisado})
            : openModalReject(id, estado)
         }
      })
   }

   const handleToggleRejectActivity = () => {
      toggleCheckActivity({id_actividad: activityData.id, estado: activityData.estado, revisado: false, glosa_rechazo: reject_gloss})
      onCloseModal()
   }

   const calculateTime = (act) => {
      const time = Number(act?.tiempo_cliente.toFixed(2)) - act?.tiempos_distribuidos?.reduce((a, b) => Number(a) + Number(b?.tiempo_dist_act), 0).toFixed(2)
      const length = act?.tiempos_distribuidos?.length

      return {
         time,
         length
      }
   }

   useEffect(() => {
      setOptions({st: optionsArray?.status?.find(os => os.value === prFilters.estado[0])})

      // eslint-disable-next-line
   }, [optionsArray])

   return (
      <>
         <Container type='table'>

            <Table>

               <THead>

                  <tr className='text-center capitalize'>

                     <Th>
                        <label 
                           htmlFor='solo_padres'
                           className='flex gap-2 items-center mt-2 px-2 py-1 mx-auto w-max font-normal rounded-full bg-zinc-200 cursor-pointer'
                        >
                           Solo padres
                           <input 
                              className='mt-1 cursor-pointer'
                              id='solo_padres' 
                              type="checkbox"
                              value={soloPadre} 
                              onChange={e => setSoloPadre(e.target.checked)}
                           />
                          
                        </label>
                     </Th>

                     <Th>
                        <SelectFilter
                           className='w-[182px]'
                           placeholder='tipo actividad'
                           type='table'
                           value={options.ita}
                           options={activity_type}
                           isMulti
                           onChange={option =>
                              setOptions({ ...options, ita: option })
                           }
                           filterDown={() =>
                              setPROrder({ orden_tipo_actividad: 'desc' })
                           }
                           filterUp={() =>
                              setPROrder({ orden_tipo_actividad: 'asc' })
                           }
                           upActive={setActive({
                              param: 'orden_tipo_actividad',
                              value: 'asc',
                           })}
                           downActive={setActive({
                              param: 'orden_tipo_actividad',
                              value: 'desc',
                           })}
                        />
                     </Th>

                     {/* id */}
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

                     {/* ticket */}
                     <Th>
                        <InputFilter
                           type='table'
                           width='w-16'
                           name='ticket'
                           value={ticket}
                           onChange={onChangeValues}
                           filterDown={() => setPROrder({ orden_ticket: 'desc' })}
                           filterUp={() => setPROrder({ orden_ticket: 'asc' })}
                           upActive={setActive({
                              param: 'orden_ticket',
                              value: 'asc',
                           })}
                           downActive={setActive({
                              param: 'orden_ticket',
                              value: 'desc',
                           })}
                        />
                     </Th>

                     {/* proyecto */}
                     <Th>
                        <SelectFilter
                           className='w-40'
                           type='table'
                           value={options.pr}
                           options={projects}
                           isMulti
                           showTooltip
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

                     {/* subproyecto */}
                     <Th>
                        <SelectFilter
                           className='w-36'
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

                     {/* solicitante */}
                     <Th>
                        <SelectFilter
                           className='w-[153px]'
                           showTooltip
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

                     {/* encargado */}
                     <Th>
                        <SelectFilter
                           className='w-[153px]'
                           showTooltip
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

                     {/* revisor */}
                     <Th>
                        <SelectFilter
                           className='w-[153px]'
                           showTooltip
                           type='table'
                           value={options.ur}
                           options={users}
                           isMulti
                           onChange={option =>
                              setOptions({ ...options, ur: option })
                           }
                           filterDown={() =>
                              setPROrder({ orden_revisor: 'desc' })
                           }
                           filterUp={() =>
                              setPROrder({ orden_revisor: 'asc' })
                           }
                           upActive={setActive({
                              param: 'orden_revisor',
                              value: 'asc',
                           })}
                           downActive={setActive({
                              param: 'orden_revisor',
                              value: 'desc',
                           })}
                        />
                     </Th>

                     {/* estado */}
                     <Th>
                        <SelectFilter
                           className='w-[200px]'
                           type='table'
                           value={options.st}
                           options={status?.filter(s => s.value === 12 || s.value === 3 || s.value === 5)}
                           placeholder='Seleccione'
                           defaultOptions
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

                     {/* titulo */}
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

                     {/* descripcion */}
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

                     {/* actions */}
                     <Th isStickyRight >
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
                     <Th primary >Tipo actividad</Th>
                     <Th primary >ID</Th>
                     <Th primary >ticket</Th>
                     <Th primary >proyecto</Th>
                     <Th primary >sub proyecto</Th>
                     <Th primary >solicitante</Th>
                     <Th primary >encargado</Th>
                     <Th primary >revisor</Th>
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

                     <Th primary isStickyRight ><i className='fas fa-check' /></Th>
                  </tr>

               </THead>

               <TBody>
                  {activitiesPR.length > 0 &&
                     activitiesPR.map((act, i) => (
                        <TrPRControls
                           key={act.id_det}
                           className={act.id_det === isActive ? 'bg-purple-100' : ''}
                           getId={(id_callback) =>setIsActive(id_callback)}
                           callback={(times) => onDistribution({distribuciones: times, id_actividad: act.id_det})}
                           {...act}
                        >
                              
                           <Td><Numerator className='mx-auto' number={i + 1} /></Td>

                           <Td>
                              <span className={`
                                    px-2 py-0.5 font-bold rounded-md text-sm mt-2 block w-max mx-auto capitalize
                                    ${
                                       act.id_tipo_actividad === 1 ? 'bg-indigo-200 text-indigo-500' 
                                          : act.id_tipo_actividad === 2 ? 'bg-emerald-200 text-emerald-500' 
                                          : act.id_tipo_actividad === 3 ? 'bg-red-200 text-red-500' 
                                          : act.id_tipo_actividad === 4 ? 'bg-orange-200 text-orange-500' 
                                          : 'bg-zinc-100 text-black'
                                    }
                                 `}
                              >
                                 {act.desc_tipo_actividad}
                              </span>
                           </Td>

                           <Td>
                              <div className='relative'> 
                                 {act.id_det}
                                 <MarkActivity 
                                    position='absolute top-0 left-0'
                                    condicion={act.num_ticket_edit > 0}
                                    hidden={!(act.es_padre === 1 && act.es_hijo === 0)} 
                                 >
                                    <i className='fas fa-hat-cowboy fa-lg' />
                                 </MarkActivity>
                              </div>
                           </Td>

                           <Td>{act.num_ticket_edit || '--'}</Td>

                           <Td>{act.abrev}</Td>

                           <Td>{act.nombre_sub_proy ?? '--'}</Td>

                           <Td>{act.user_solicita}</Td>

                           <Td>{act.encargado_actividad}</Td>

                           <Td>{act.abrev_revisor || '--'}</Td>

                           <Td>{status?.find(s => s.value === act.estado).label}</Td>

                           <Td
                              isMultiLine={multiline}
                              width='max-w-[150px]'
                              align='text-left'
                           >
                              {act.actividad || 'Sin Titulo'}
                           </Td>

                           <Td 
                              isMultiLine={multiline} 
                              align='text-left'
                           >
                              {act.func_objeto}
                           </Td>

                           <Td isStickyRight >
                                 
                              { act.estado !== 5 ?
                                 <div className='flex gap-2 justify-center'>
                                    <Button 
                                       className='bg-emerald-100 hover:bg-emerald-200 text-emerald-500 border border-emerald-300'
                                       onClick={() => onChangeCheckedActivity({id: act.id_det, title: act.actividad, revisado: true, estado: act.estado})}
                                    >
                                       <i className='fas fa-check' />
                                    </Button>

                                    <Button 
                                       className='bg-red-100 hover:bg-red-200 text-red-500 border border-red-300 px-3'
                                       onClick={() => onChangeCheckedActivity({id: act.id_det, title: act.actividad, revisado: false, estado: act.estado})}  
                                    >
                                       <i className='fas fa-times' />
                                    </Button>
                                 </div>

                              : 
                              <span className={`

                                    px-2 py-1 font-bold rounded-full text-sm
                                       ${calculateTime(act).time === 0 ? 'text-green-500 bg-green-200' 
                                          : calculateTime(act).length === 0 ? 'text-amber-500 bg-amber-200'
                                             : 'text-red-500 bg-red-200'}
                                    
                                 `}
                              >
                                 {
                                    <>
                                       <i className='fas fa-clock mr-3' />
                                       {calculateTime(act).time}
                                    </>
                                 }
                              </span>
                              }

                           </Td>
                        </TrPRControls>
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
            showModal={modalReject}
            onClose={onCloseModal}
            isBlur={false}
            className='max-w-md'
            padding='p-6'
            title='Motivo rechazo revisión'
         >
            <TextArea 
               field='descripción'
               name='reject_gloss'
               value={reject_gloss}
               onChange={onChangeValues}
            />

            <footer className='flex justify-between mt-7'>
               
               <Button 
                  className='bg-red-100 hover:bg-red-200 text-red-500'
                  onClick={() => {
                     toggleModalReject(false)
                     reset()
                  }}
               >
                  cancelar
               </Button>

               <Button 
                  className='bg-yellow-100 hover:bg-yellow-200 text-yellow-500'
                  onClick={handleToggleRejectActivity}
               >
                  rechazar
               </Button>

            </footer>

         </Modal>

      </>
   )
}

export default Revision
