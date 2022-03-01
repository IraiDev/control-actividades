import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UiContext } from '../context/UiContext'
import { ActivityContext } from '../context/ActivityContext'
import { useActivity } from '../hooks/useActivity'
import { useWindowSize } from '../hooks/useWindowSize'
import { Alert } from '../helpers/alerts'
import Button from '../components/ui/Button'
import Pagination from '@mui/material/Pagination'
import Table from '../components/table/Table'
import TBody from '../components/table/TBody'
import THead from '../components/table/THead'
import Th from '../components/table/Th'
import Td from '../components/table/Td'
import ActivityCard from '../components/card/customCard/ActivityCard'
import Container from '../components/ui/Container'
import FooterPage from '../components/ui/FooterPage'
import FooterCounter from '../components/ui/FooterCounter'
import PingIndicator from '../components/ui/PingIndicator'
import InputFilter from '../components/filter/InputFilter'
import SelectFilter from '../components/filter/SelectFilter'
import { useForm } from '../hooks/useForm'
import { useEffect } from 'react'

const colors = [
   {border: 'border-red-600', bg: 'bg-red-600'},
   {border: 'border-black', bg: 'bg-black'},
   {border: 'border-emerald-600', bg: 'bg-emerald-600'},
   {border: 'border-indigo-600', bg: 'bg-indigo-600'},
   {border: 'border-pink-600', bg: 'bg-pink-600'},
   {border: 'border-blue-600', bg: 'bg-blue-600'},
]

const PrioritySelector = ({ onClick, color = 'bg-slate-400', disabled }) => {
   return (
      <>
         {!disabled && (
            <span
               className={`h-3.5 w-3.5 rounded-full ${color} transition hover:border
      duration-200 hover:scale-150 transform cursor-pointer`}
               onClick={onClick}
            />
         )}
      </>
   )
}

const CustomSelect = ({ value, onChange }) => {
   return (
      <select
         className='rounded-lg bg-white p-1 border border-gray-300'
         value={value}
         onChange={onChange}>
         <option value=''>todos</option>
         <option value='12'>12</option>
         <option value='25'>25</option>
         <option value='50'>50</option>
         <option value='100'>100</option>
      </select>
   )
}

const Activity = () => {
   const navigate = useNavigate()
   const { view, setView, setIsLoading } = useContext(UiContext)
   const { optionsArray, saveFilters, pager, setPager, setOrder, order } =
      useContext(ActivityContext)
   const [multiline, setMultiline] = useState(false)
   const [color, setColor] = useState([])
   const size = useWindowSize()

   const {
      activities,
      newNote,
      updateNote,
      deleteNote,
      total,
      updatePriority,
      onPlayPause,
      updatePriorityAndAddNote,
      toggleState,
      deleteActivity,
   } = useActivity()

   const [options, setOptions] = useState({})
   const [{ id, title, numPriority, desc, ticket }, onChangeValues, reset] =
      useForm({
         id: '',
         title: '',
         numPriority: '',
         desc: '',
         ticket: '',
      })

   const { projects, subProjects, users, status } = optionsArray

   const onFilter = () => {
      const filters = {
         estado: options.st?.value || '',
         proyecto:
            options.pr?.length > 0 ? options.pr.map(item => item.value) : [],
         encargado:
            options.ue?.length > 0 ? options.ue.map(item => item.label) : [],
         solicitante:
            options.us?.length > 0 ? options.us.map(item => item.label) : [],
         subProy:
            options.sp?.length > 0 ? options.sp.map(item => item.value) : [],
         color: options.pi?.value || '',
         id_actividad: id,
         titulo: title,
         prioridad_ra: numPriority,
         offset: 0,
      }

      setPager({ ...pager, page: 1 })

      saveFilters({ payload: filters })
   }

   const onClear = () => {
      saveFilters({ reset: true })
      setOptions({
         st: '',
         pr: [],
         ue: [],
         us: [],
         sp: [],
         pi: '',
      })
      reset()
      setOrder({})
   }

   const setActive = ({ param, value }) => {
      const k = Object.keys(order).some(k => k === param)
      const v = Object.values(order).some(v => v === value)
      return k && v
   }

   const toggleView = (state, time = 1000) => {
      setIsLoading(true)
      setTimeout(() => {
         setView(state)
         setIsLoading(false)
      }, time)
   }

   const onPauseActivity = ({ flag, id_actividad, mensaje }) => {
      if (flag) {
         onPlayPause({ id_actividad, mensaje })
      } else {
         if (mensaje.trim() === '') {
            Alert({
               icon: 'warn',
               title: 'Atención',
               content: 'No puedes guardar una pausa sin un mensaje',
               showCancelButton: false,
            })
            return
         }
         onPlayPause({ id_actividad, mensaje })
      }
   }

   const onPlayActivity = ({ id_actividad }) => {
      onPlayPause({ id_actividad })
   }

   const onDeleteActivity = ({ id_actividad, title = 'sin titulo' }) => {
      Alert({
         icon: 'warn',
         title: 'Atención',
         content: `¿Estás seguro de eliminar la siguiente actividad: <strong>${title}</strong>, id: <strong>${id_actividad}</strong>?`,
         confirmText: 'Si, eliminar',
         cancelText: 'No, cancelar',
         action: () => deleteActivity({ id_actividad }),
      })
   }

   const onDeleteNote = ({ id_nota, id_actividad, description }) => {
      Alert({
         icon: 'warn',
         title: 'Atención',
         content: `¿Estas seguro de eliminar la siguiente nota: <strong>${description}</strong>?`,
         cancelButton: 'No, cancelar',
         confirmButton: 'Si, eliminar',
         action: () => deleteNote({ id_nota, id_actividad }),
      })
   }

   const onUpdateNote = ({ id_nota, description, id_actividad }) => {
      if (description.trim() === '') {
         Alert({
            title: 'Atención',
            content: 'No puedes actualizar una nota sin una descripcion',
            showCancelButton: false,
         })
         return
      }
      updateNote({ id_nota, description, id_actividad })
   }

   const onAddNote = ({ id_actividad, description }) => {
      if (description.trim() === '') {
         Alert({
            title: 'Atención',
            content: 'No puedes crear una nota sin una descripcion',
            showCancelButton: false,
         })
         return
      }
      newNote({ id_actividad, description })
   }

   const onAddDefaultNote = ({ flag, id_actividad, description }) => {
      flag
         ? updatePriorityAndAddNote({
              prioridad_numero: 100,
              id_actividad,
              description,
           })
         : newNote({ id_actividad, description })
   }

   const onChangePage = (e, value) => {
      const offset = ((value - 1) * pager.limit) % total
      setPager({ ...pager, page: value })
      saveFilters({ payload: { offset, limit: pager.limit } })
   }

   const onChangeSelect = e => {
      setPager({ page: 1, limit: e.target.value })
      saveFilters({
         payload: { limit: e.target.value, offset: 0 },
      })
   }

   const getRandomColor = () => {
      return colors[Math.floor(Math.random() * colors.length)]
   }

   useEffect(() => {
      setColor(activities.map(act => {
         const c = getRandomColor()
         return({...c, id: act.id_det})
      }))
      // eslint-disable-next-line
   }, [activities])

   return (
      <>
         {view ? (
            <Container>
               {activities.length > 0 ? (
                  activities.map((act, i) => (
                     <ActivityCard
                        key={i}
                        numberCard={i + 1}
                        highPriority={() =>
                           updatePriority({
                              prioridad_numero: 100,
                              id_actividad: act.id_det,
                           })
                        }
                        mediumPriority={() =>
                           updatePriority({
                              prioridad_numero: 400,
                              id_actividad: act.id_det,
                           })
                        }
                        lowPriority={() =>
                           updatePriority({
                              prioridad_numero: 600,
                              id_actividad: act.id_det,
                           })
                        }
                        noPriority={() =>
                           updatePriority({
                              prioridad_numero: 1000,
                              id_actividad: act.id_det,
                           })
                        }
                        toggleState={({ tiempo_estimado }) =>
                           toggleState({
                              id_actividad: act.id_det,
                              estado: 2,
                              tiempo_estimado,
                           })
                        }
                        deleteActivity={() =>
                           onDeleteActivity({
                              id_actividad: act.id_det,
                              title: act.actividad,
                           })
                        }
                        addNote={onAddNote}
                        addDefaultNote={onAddDefaultNote}
                        updateNote={onUpdateNote}
                        deleteNote={onDeleteNote}
                        pauseActivity={onPauseActivity}
                        playActivity={onPlayActivity}
                        isFather={activities.some(a => a.id_det_padre === act.id_det)}
                        colors={color}
                        {...act}
                     />
                  ))
               ) : (
                  <span className='text-center col-span-4 text-slate-400'>
                     No hay actividades...
                  </span>
               )}
            </Container>
         ) : (
            <Container type='table'>
               <Table>
                  <THead>
                     <tr className='text-center capitalize bg-white'>
                        <Th className='bg-zinc-100'></Th>
                        <Th>
                           <InputFilter
                              type='table'
                              width='w-16'
                              isNumber
                              name='id'
                              value={id}
                              onChange={onChangeValues}
                              filterDown={() => setOrder({ orden_id: 'desc' })}
                              filterUp={() => setOrder({ orden_id: 'asc' })}
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
                        <Th className='bg-zinc-100'>
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
                                 setOrder({ orden_proyecto: 'desc' })
                              }
                              filterUp={() =>
                                 setOrder({ orden_proyecto: 'asc' })
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
                        <Th className='bg-zinc-100'>
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
                                 setOrder({ orden_solicitante: 'desc' })
                              }
                              filterUp={() =>
                                 setOrder({ orden_solicitante: 'asc' })
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
                        <Th className='bg-zinc-100'>
                           <SelectFilter
                              type='table'
                              value={options.ue}
                              options={users}
                              isMulti
                              onChange={option =>
                                 setOptions({ ...options, ue: option })
                              }
                              filterDown={() =>
                                 setOrder({ orden_encargado: 'desc' })
                              }
                              filterUp={() =>
                                 setOrder({ orden_encargado: 'asc' })
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
                           <InputFilter
                              type='table'
                              width='w-14'
                              name='numPriority'
                              value={numPriority}
                              onChange={onChangeValues}
                              filterDown={() =>
                                 setOrder({ orden_prioridad_ra: 'desc' })
                              }
                              filterUp={() =>
                                 setOrder({ orden_prioridad_ra: 'asc' })
                              }
                              upActive={setActive({
                                 param: 'orden_prioridad_ra',
                                 value: 'asc',
                              })}
                              downActive={setActive({
                                 param: 'orden_prioridad_ra',
                                 value: 'desc',
                              })}
                           />
                        </Th>
                        {/* <Th className='bg-zinc-100'></Th> */}
                        <Th className='bg-zinc-100'>
                           <InputFilter
                              type='table'
                              width='w-28'
                              name='title'
                              value={title}
                              onChange={onChangeValues}
                              filterDown={() =>
                                 setOrder({ orden_actividad: 'desc' })
                              }
                              filterUp={() =>
                                 setOrder({ orden_actividad: 'asc' })
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
                        <Th className='bg-zinc-100'>
                           <SelectFilter
                              type='table'
                              value={options.st}
                              options={status}
                              onChange={option =>
                                 setOptions({ ...options, st: option })
                              }
                              filterDown={() =>
                                 setOrder({ orden_estado: 'desc' })
                              }
                              filterUp={() => setOrder({ orden_estado: 'asc' })}
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
                        <Th className='flex justify-around pt-3'>
                           <Button
                              className='bg-zinc-100 hover:bg-zinc-200'
                              title='Limpiar filtros'
                              isShadow
                              onClick={onClear}>
                              <i className='fas fa-eraser' />
                           </Button>
                           <Button
                              className='bg-blue-500 hover:bg-blue-600 text-white'
                              isShadow
                              onClick={onFilter}>
                              filtrar <i className='fas fa-filter' />
                           </Button>
                        </Th>
                     </tr>
                     <tr className='text-center capitalize text-white bg-slate-600'>
                        <Th className='bg-slate-700'>Nᵒ</Th>
                        <Th>ID</Th>
                        <Th className='bg-slate-700'>ticket</Th>
                        <Th>proyecto</Th>
                        <Th className='bg-slate-700'>sub proyecto</Th>
                        <Th>solicitante</Th>
                        <Th className='bg-slate-700'>encargado</Th>
                        <Th>prioridad</Th>
                        {/* <Th className='bg-slate-700'>fecha</Th> */}
                        <Th className='bg-slate-700'>
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
                        <Th>
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
                        <Th className='bg-slate-700'>estado</Th>
                        <Th></Th>
                     </tr>
                  </THead>
                  <TBody>
                     {activities.length > 0 &&
                        activities.map((act, i) => (
                           <tr
                              onDoubleClick={() =>
                                 navigate(`detalle-actividad/${act.id_det}`, {
                                    replace: true,
                                 })
                              }
                              key={act.id_det}
                              className={`
                                text-sm text-gray-800
                                transition duration-300 cursor-pointer
                                ${
                                   i !== activities.length - 1 &&
                                   'border-b border-gray-500'
                                }
                                ${
                                   act.prioridad_etiqueta === 600
                                      ? 'bg-green-400/40 hover:bg-green-400/90'
                                      : act.prioridad_etiqueta === 400
                                      ? 'bg-yellow-400/40 hover:bg-yellow-400/90'
                                      : act.prioridad_etiqueta === 100
                                      ? 'bg-red-400/40 hover:bg-red-400/90'
                                      : 'bg-white hover:bg-black/10'
                                }
                              `}>
                              <Td bgcolor>
                                 <span className='px-2 font-semibold leading-tight bg-amber-200 text-amber-600 shadow rounded-md relative'>
                                    {i + 1}
                                    {act.estado_play_pausa === 2 && (
                                       <PingIndicator size='small' />
                                    )}
                                 </span>
                              </Td>
                              <Td className='font-bold'>{act.id_det}</Td>
                              <Td
                                 className={
                                    act.num_ticket_edit ? 'font-bold' : ''
                                 }
                                 bgcolor>
                                 {act.num_ticket_edit || '--'}
                              </Td>
                              <Td className='font-bold'>{act.abrev}</Td>
                              <Td bgcolor>{act.nombre_sub_proy ?? '--'}</Td>
                              <Td>{act.user_solicita}</Td>
                              <Td className='font-bold' bgcolor>
                                 {act.encargado_actividad}
                              </Td>
                              <Td className='font-bold'>{act.num_prioridad}</Td>
                              {/* <Td bgcolor>
                                 {moment(act.fecha_tx).format('DD/MM/yyyy')}
                              </Td> */}
                              <Td
                                 bgcolor
                                 isMultiLine={multiline}
                                 className='font-bold'
                                 width='max-w-[150px]'
                                 align='text-left'>
                                 {act.actividad || 'Sin Titulo'}
                              </Td>
                              <Td isMultiLine={multiline} align='text-left'>
                                 {act.func_objeto}
                              </Td>
                              <Td bgcolor className='font-bold'>
                                 {act.estado === 1 ? 'Pendiente' : 'En trabajo'}
                              </Td>
                              <Td
                                 className='flex items-center justify-between gap-2'
                                 isModal
                                 pauseActivity={onPauseActivity}
                                 playActivity={onPlayActivity}
                                 time={act.tiempo_estimado}
                                 callback={() =>
                                    toggleState({
                                       id_actividad: act.id_det,
                                       estado: 2,
                                       tiempo_estimado: 1,
                                    })
                                 }
                                 {...act}>
                                 <div className='flex gap-1.5 p-1.5 rounded-full bg-black/10'>
                                    <PrioritySelector
                                       disabled={
                                          act.prioridad_etiqueta === 1000
                                       }
                                       onClick={() =>
                                          updatePriority({
                                             prioridad_numero: 1000,
                                             id_actividad: act.id_det,
                                          })
                                       }
                                    />
                                    <PrioritySelector
                                       disabled={act.prioridad_etiqueta === 600}
                                       color='bg-green-500/70'
                                       onClick={() =>
                                          updatePriority({
                                             prioridad_numero: 600,
                                             id_actividad: act.id_det,
                                          })
                                       }
                                    />
                                    <PrioritySelector
                                       disabled={act.prioridad_etiqueta === 400}
                                       color='bg-yellow-500/80'
                                       onClick={() =>
                                          updatePriority({
                                             prioridad_numero: 400,
                                             id_actividad: act.id_det,
                                          })
                                       }
                                    />
                                    <PrioritySelector
                                       disabled={act.prioridad_etiqueta === 100}
                                       color='bg-red-500/70'
                                       onClick={() =>
                                          updatePriority({
                                             prioridad_numero: 100,
                                             id_actividad: act.id_det,
                                          })
                                       }
                                    />
                                 </div>
                              </Td>
                           </tr>
                        ))}
                  </TBody>
               </Table>
            </Container>
         )}

         <FooterPage>
            <FooterCounter count={activities.length} />

            <Pagination
               siblingCount={size.width < 480 ? 0 : 1}
               boundaryCount={size.width < 480 ? 0 : 1}
               size='small'
               count={
                  pager.limit === ''
                     ? 1
                     : Math.ceil(Number(total) / Number(pager.limit))
               }
               color='primary'
               onChange={onChangePage}
               page={pager.page}
            />

            <div className='flex gap-2'>
               <Button
                  disabled={view}
                  className={`hover:text-blue-500 hover:bg-zinc-100 ${
                     view && 'text-blue-500'
                  }`}
                  onClick={() => toggleView(true)}>
                  <i className='fas fa-border-all' />
               </Button>
               <Button
                  disabled={!view}
                  className={`hover:text-blue-500 hover:bg-zinc-100 ${
                     !view && 'text-blue-500'
                  }`}
                  onClick={() => toggleView(false)}>
                  <i className='fas fa-th-list' />
               </Button>
               <CustomSelect value={pager.limit} onChange={onChangeSelect} />
            </div>
         </FooterPage>
      </>
   )
}

export default Activity
