import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import Modal from '../components/ui/Modal'
import TextArea from '../components/ui/TextArea'
import MarkActivity from '../components/ui/MarkActivity'
import SpanFilter from '../components/filter/SpanFilter'
import moment from 'moment'
import TdSwitch from '../components/table2/customTD/TdSwitch'

const Revision = () => {
   const {
      activitiesPR,
      total,
      toggleCheckActivity,
      onDistribution,
      onPlayPause
   } = useActivityPr()

   // context
   const {
      savePRFilters,
      prPager,
      setPRPager,
      setPROrder,
      prOrder,
      optionsArray,
      prFilters,
      activityRunning
   } = useContext(ActivityContext)

   const navigate = useNavigate()

   // states
   const [multiline, setMultiline] = useState(false)
   const [activityData, setActivityData] = useState({ id: null })
   const [isActive, setIsActive] = useState(null)
   const [options, setOptions] = useState({})
   const [modalReject, toggleModalReject] = useState(false)
   const [soloPadre, setSoloPadre] = useState(prFilters.solo_padres)

   // hooks
   const size = useWindowSize()
   const [{
      id,
      title,
      desc,
      ticket,
      reject_gloss,
   }, onChangeValues, reset, onPreset] = useForm({
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
            options.st?.length > 0 && options.st.some(o => o.value !== null) ? options.st.map(item => item.value) : [],
         proyecto:
            options.pr?.length > 0 && options.pr.some(o => o.value !== null) ? options.pr.map(item => item.value) : [],
         encargado:
            options.ue?.length > 0 && options.ue.some(o => o.value !== null) ? options.ue.map(item => item.label) : [],
         solicitante:
            options.us?.length > 0 && options.us.some(o => o.value !== null) ? options.us.map(item => item.label) : [],
         subProy:
            options.sp?.length > 0 && options.sp.some(o => o.value !== null) ? options.sp.map(item => item.value) : [],
         revisor:
            options.ur?.length > 0 && options.ur.some(o => o.value !== null) ? options.ur.map(item => item.id) : [],
         id_tipo_actividad:
            options.ita?.length > 0 && options.ita.some(o => o.value !== null) ? options.ita.map(item => item.value) : [],
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
         st: [{ value: 3, label: 'PARA REVISION' }],
         pr: [],
         ue: [],
         us: [],
         sp: [],
         ita: [],
      })
      reset()
      setSoloPadre(false)
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
      setActivityData({ ...activityData, id, estado })
      toggleModalReject(true)
   }

   const onCloseModal = () => {
      toggleModalReject(false)
      reset()
   }

   const onChangeCheckedActivity = ({ id, title, estado, revisado }) => {

      Alert({
         title: 'Atención',
         content: `${revisado ? 'Aprobar' : 'Rechazar'} revisión de la siguiente actividad: <strong>${title}</strong>, <strong>${id}</strong>`,
         confirmText: `${revisado ? 'Si, Aprobar' : 'Si, Rechazar'}`,
         cancelText: 'No, cancelar',
         action: () => {
            revisado ?
               toggleCheckActivity({ id_actividad: id, estado, revisado })
               : openModalReject(id, estado)
         }
      })
   }

   const handleToggleRejectActivity = () => {
      toggleCheckActivity({ id_actividad: activityData.id, estado: activityData.estado, revisado: false, glosa_rechazo: reject_gloss })
      onCloseModal()
   }

   const onPlay = ({ id_actividad }) => {

      onPlayPause({ id_actividad, tipo_pausa: 3 })

   }

   const onPause = ({ mensaje, tipo_pausa, id_actividad }) => {
      onPlayPause({ mensaje, tipo_pausa, id_actividad })
   }

   useEffect(() => {

      setOptions({
         st: !options?.st?.some(o => o.value === null) ? optionsArray?.status?.filter(os => {
            return prFilters.estado.includes(os.value)
         }) : [{ value: null, label: 'Todos' }],

         pr: !options?.pr?.some(o => o.value === null) ? optionsArray?.projects?.filter(op => {
            return prFilters.proyecto.includes(op.value)
         }) : [{ value: null, label: 'Todos' }],

         ue: !options?.ue?.some(o => o.value === null) ? optionsArray?.users?.filter(ou => {
            return prFilters.encargado.includes(ou.value)
         }) : [{ value: null, label: 'Todos' }],

         us: !options?.us?.some(o => o.value === null) ? optionsArray?.users?.filter(ou => {
            return prFilters.solicitante.includes(ou.value)
         }) : [{ value: null, label: 'Todos' }],

         ur: !options?.ur?.some(o => o.value === null) ? optionsArray?.users?.filter(ou => {
            return prFilters.revisor.includes(ou.id)
         }) : [{ value: null, label: 'Todos' }],

         sp: !options?.sp?.some(o => o.value === null) ? optionsArray?.subProjects?.filter(os => {
            return prFilters.subProy.includes(os.value)
         }) : [{ value: null, label: 'Todos' }],

         ita: !options?.ita?.some(o => o.value === null) ? optionsArray?.activity_type?.filter(oi => {
            return prFilters.id_tipo_actividad.includes(oi.value)
         }) : [{ value: null, label: 'Todos' }],
      })

      onPreset({
         id: prFilters.id_actividad,
         title: prFilters.titulo,
         desc: prFilters.descripcion,
         ticket: prFilters.numero_ticket
      })


      // eslint-disable-next-line
   }, [optionsArray, prFilters])

   useEffect(() => {
      console.log('filtros pr', prFilters)
   }, [prFilters])


   return (
      <>
         <Container type='table'>

            <Table>

               <THead>

                  <tr className='text-center capitalize'>

                     <Th>
                        <label
                           htmlFor='solo_padres'
                           className='flex gap-2 items-center text-sm font-semibold mt-2 px-2 py-1 mx-auto w-max rounded-full bg-zinc-200 cursor-pointer'
                        >
                           Solo padres
                           <input
                              className='mt-1 cursor-pointer'
                              id='solo_padres'
                              type="checkbox"
                              checked={soloPadre}
                              onChange={e => setSoloPadre(e.target.checked)}
                           />

                        </label>
                     </Th>

                     <Th>
                        <SelectFilter
                           className='w-[182px]'
                           type='table'
                           value={options.ita}
                           options={activity_type}
                           isMulti
                           defaultOptions
                           height='auto'
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
                           defaultOptions
                           height={400}
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
                           height={400}
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
                           defaultOptions
                           isOrder={false}
                           onChange={option =>
                              setOptions({ ...options, sp: option })
                           }
                        />
                     </Th>

                     <Th></Th>

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

                     {/* estado */}
                     <Th>
                        <SelectFilter
                           className='w-[200px]'
                           type='table'
                           value={options.st}
                           options={status}
                           placeholder='Seleccione'
                           isMulti
                           height='auto'
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

                     {/* solicitante */}
                     <Th>
                        <SelectFilter
                           className='w-[153px]'
                           showTooltip
                           type='table'
                           value={options.us}
                           options={users}
                           isMulti
                           defaultOptions
                           height='auto'
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
                           defaultOptions
                           height='auto'
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
                           defaultOptions
                           height='auto'
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

                     <Th></Th>

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
                     <Th primary >
                        Nᵒ
                     </Th>
                     <Th primary >
                        <SpanFilter condition={prFilters.id_tipo_actividad.length > 0}>
                           Tipo actividad
                        </SpanFilter>
                     </Th>
                     <Th primary >
                        <SpanFilter condition={prFilters.id_actividad.length > 0}>
                           ID
                        </SpanFilter>
                     </Th>
                     <Th primary >
                        <SpanFilter condition={prFilters.numero_ticket.length > 0}>
                           ticket
                        </SpanFilter>
                     </Th>
                     <Th primary >
                        <SpanFilter condition={prFilters.proyecto.length > 0}>
                           proyecto
                        </SpanFilter>
                     </Th>
                     <Th primary >
                        <SpanFilter condition={prFilters.subProy.length > 0}>
                           sub proyecto
                        </SpanFilter>
                     </Th>
                     <Th primary >
                        Tiempo (hrs)
                     </Th>
                     <Th primary >
                        <div className='flex items-baseline justify-center gap-2'>
                           <SpanFilter condition={prFilters.titulo.length > 0}>
                              actividad
                           </SpanFilter>
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
                           <SpanFilter condition={prFilters.descripcion.length > 0}>
                              descripcion
                           </SpanFilter>
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
                        <SpanFilter condition={prFilters.estado.length > 0}>
                           estado
                        </SpanFilter>
                     </Th>
                     <Th primary >
                        <SpanFilter condition={prFilters.solicitante.length > 0}>
                           solicita
                        </SpanFilter>
                     </Th>
                     <Th primary >
                        <SpanFilter condition={prFilters.encargado.length > 0}>
                           encargado
                        </SpanFilter>
                     </Th>
                     <Th primary >
                        <SpanFilter condition={prFilters.revisor.length > 0}>
                           revisor
                        </SpanFilter>
                     </Th>
                     <Th primary >
                        <span title='Fecha y hora de paso a revision'>
                           fecha P.R.
                        </span>
                     </Th>
                     <Th primary isStickyRight ><i className='fas fa-check' /></Th>
                  </tr>

               </THead>

               <TBody>
                  {activitiesPR.length > 0 &&
                     activitiesPR.map((act, i) => (
                        <tr
                           key={act.id_det}
                           className={`
                              cursor-pointer text-[13px]
                              ${act.id_det === isActive ? 'bg-purple-100' : ''}
                              ${activityRunning.id === act.id_det_padre && activityRunning.isRunning ? 'bg-emerald-200/50' : ''}
                           `}

                        >

                           <Td
                              onDoubleClick={() => navigate(`actividad-pr-detalle/${act.id_det}?type_detail=pr`)}
                           >
                              <Numerator className='mx-auto' number={i + 1} />
                           </Td>

                           <Td
                              onDoubleClick={() => navigate(`actividad-pr-detalle/${act.id_det}?type_detail=pr`)}
                           >
                              <span className={`
                                    px-2 py-0.5 font-bold rounded-md text-sm mt-2 block w-max mx-auto capitalize
                                    ${act.id_tipo_actividad === 1 ? 'bg-indigo-200 text-indigo-500'
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

                           <Td
                              onDoubleClick={() => navigate(`actividad-pr-detalle/${act.id_det}?type_detail=pr`)}
                           >
                              <div className='flex items-center justify-center gap-3'>
                                 <MarkActivity
                                    position='block'
                                    condicion={act.num_ticket_edit > 0}
                                    hidden={!(act.es_padre === 1 && act.es_hijo === 0)}
                                 >
                                    <i className='fas fa-hat-cowboy fa-lg' />
                                 </MarkActivity>
                                 {act.id_det}
                              </div>
                           </Td>

                           <Td
                              onDoubleClick={() => navigate(`actividad-pr-detalle/${act.id_det}?type_detail=pr`)}
                           >
                              {act.num_ticket_edit || '--'}
                           </Td>

                           <Td
                              onDoubleClick={() => navigate(`actividad-pr-detalle/${act.id_det}?type_detail=pr`)}
                           >
                              {act.abrev}
                           </Td>

                           <Td
                              onDoubleClick={() => navigate(`actividad-pr-detalle/${act.id_det}?type_detail=pr`)}
                           >
                              {act.nombre_sub_proy ?? '--'}
                           </Td>

                           <Td
                              onDoubleClick={() => navigate(`actividad-pr-detalle/${act.id_det}?type_detail=pr`)}
                           >
                              <span
                                 title='Tiempo total cobrable'
                                 className='px-2 py-0.5 rounded-full bg-green-300/80 font-bold'
                              >
                                 {act?.tiempo_cliente.toFixed(4)}
                              </span>
                           </Td>

                           <Td
                              isMultiLine={multiline}
                              width='max-w-[150px]'
                              align='text-left'
                              onDoubleClick={() => navigate(`actividad-pr-detalle/${act.id_det}?type_detail=pr`)}
                           >
                              {act.actividad || 'Sin Titulo'}
                           </Td>

                           <Td
                              isMultiLine={multiline}
                              align='text-left'
                              onDoubleClick={() => navigate(`actividad-pr-detalle/${act.id_det}?type_detail=pr`)}
                           >
                              {act.func_objeto}
                           </Td>

                           <Td
                              onDoubleClick={() => navigate(`actividad-pr-detalle/${act.id_det}?type_detail=pr`)}
                           >
                              {status?.find(s => s.value === act.estado).label}
                           </Td>

                           <Td
                              onDoubleClick={() => navigate(`actividad-pr-detalle/${act.id_det}?type_detail=pr`)}
                           >
                              {act.user_solicita}
                           </Td>

                           <Td
                              onDoubleClick={() => navigate(`actividad-pr-detalle/${act.id_det}?type_detail=pr`)}
                           >
                              {act.encargado_actividad}
                           </Td>

                           <Td
                              onDoubleClick={() => navigate(`actividad-pr-detalle/${act.id_det}?type_detail=pr`)}
                           >
                              {act.abrev_revisor || '--'}
                           </Td>

                           <Td
                              onDoubleClick={() => navigate(`actividad-pr-detalle/${act.id_det}?type_detail=pr`)}
                           >
                              {moment(`${act.fecha_revicion} ${act.hora_revicion}`).format('DD-MM-yyyy, HH:MM') ?? 'sin fecha'}
                           </Td>

                           <TdSwitch
                              state={act.estado}
                              onDistribution={({ distribuciones, id_actividad }) => onDistribution({ distribuciones, id_actividad })}
                              getId={(id_callback) => setIsActive(id_callback)}
                              onChangeCheckedActivity={({ id, title, revisado, estado }) => onChangeCheckedActivity({ id, title, revisado, estado })}
                              onPlay={() => onPlay({ id_actividad: act.id_det })}
                              onPause={({ mensaje, tipo_pausa }) => onPause({ mensaje, tipo_pausa, id_actividad: act.id_det })}
                              {...act}
                           />
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
