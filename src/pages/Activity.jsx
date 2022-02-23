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
import moment from 'moment'

const PrioritySelector = ({ onClick, color = 'bg-slate-400' }) => (
   <span
      className={`h-3.5 w-3.5 rounded-full ${color} transition hover:border
      duration-200 hover:scale-150 transform cursor-pointer`}
      onClick={onClick}
   />
)

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
   const { saveFilters, pager, setPager } = useContext(ActivityContext)
   const [multiline, setMultiline] = useState(false)
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
   } = useActivity()

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
                        addNote={onAddNote}
                        addDefaultNote={onAddDefaultNote}
                        updateNote={onUpdateNote}
                        deleteNote={onDeleteNote}
                        pauseActivity={onPauseActivity}
                        playActivity={onPlayActivity}
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
                     <tr className='text-center capitalize text-white bg-slate-600'>
                        <Th className='bg-slate-700'>Nᵒ</Th>
                        <Th>ID</Th>
                        <Th className='bg-slate-700'>ticket</Th>
                        <Th>proyecto</Th>
                        <Th className='bg-slate-700'>sub proyecto</Th>
                        <Th>solicitante</Th>
                        <Th className='bg-slate-700'>encargado</Th>
                        <Th>prioridad</Th>
                        <Th className='bg-slate-700'>fecha</Th>
                        <Th>
                           actividad
                           <Button
                              className='ml-2'
                              type='icon'
                              icon={
                                 multiline
                                    ? 'fas fa-angle-up'
                                    : 'fas fa-angle-down'
                              }
                              onClick={() => setMultiline(!multiline)}
                           />
                        </Th>
                        <Th className='bg-slate-700'>
                           descripcion
                           <Button
                              className='ml-2'
                              type='icon'
                              icon={
                                 multiline
                                    ? 'fas fa-angle-up'
                                    : 'fas fa-angle-down'
                              }
                              onClick={() => setMultiline(!multiline)}
                           />
                        </Th>
                        <Th>estado</Th>
                        <Th className='bg-slate-700'></Th>
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
                              <Td bgcolor>
                                 {moment(act.fecha_tx).format('DD/MM/yyyy')}
                              </Td>
                              <Td
                                 isMultiLine={multiline}
                                 className='font-bold'
                                 width='max-w-[150px]'
                                 align='text-left'>
                                 {act.actividad || 'Sin Titulo'}
                              </Td>
                              <Td
                                 isMultiLine={multiline}
                                 bgcolor
                                 align='text-left'>
                                 {act.func_objeto}
                              </Td>
                              <Td className='font-bold'>
                                 {act.estado === 1 ? 'Pendiente' : 'En trabajo'}
                              </Td>
                              <Td
                                 className='flex items-center justify-around gap-2'
                                 bgcolor
                                 isModal
                                 pauseActivity={onPauseActivity}
                                 playActivity={onPlayActivity}
                                 {...act}>
                                 <div className='flex gap-1.5 p-1.5 rounded-full bg-black/10'>
                                    <PrioritySelector
                                       onClick={() =>
                                          updatePriority({
                                             prioridad_numero: 1000,
                                             id_actividad: act.id_det,
                                          })
                                       }
                                    />
                                    <PrioritySelector
                                       color='bg-green-500/70'
                                       onClick={() =>
                                          updatePriority({
                                             prioridad_numero: 600,
                                             id_actividad: act.id_det,
                                          })
                                       }
                                    />
                                    <PrioritySelector
                                       color='bg-yellow-500/80'
                                       onClick={() =>
                                          updatePriority({
                                             prioridad_numero: 400,
                                             id_actividad: act.id_det,
                                          })
                                       }
                                    />
                                    <PrioritySelector
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