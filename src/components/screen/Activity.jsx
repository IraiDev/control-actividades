import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UiContext } from '../../context/UiContext'
import { ActivityContext } from '../../context/ActivityContext'
import { useActivity } from '../../hooks/useActivity'
import { Alert } from '../../helpers/alerts'
import ActivityCard from '../card/ActivityCard'
import Button from '../ui/Button'
import Pagination from '@mui/material/Pagination'
import Table from '../table/Table'
import TBody from '../table/TBody'
import THead from '../table/THead'
import Th from '../table/Th'
import Td from '../table/Td'
import moment from 'moment'

const Activity = () => {

  const navigate = useNavigate()
  const { view, setView } = useContext(UiContext)
  const { saveFilters, pager, setPager } = useContext(ActivityContext)
  const [multiline, setMultiline] = useState(false)

  const {
    activities,
    newNote,
    updateNote,
    deleteNote,
    total,
    updatePriority,
    onPlayPause,
    updatePriorityAndAddNote
  } = useActivity()

  const onPauseActivity = ({ flag, id_actividad, mensaje }) => {

    if (flag) { onPlayPause({ id_actividad, mensaje }) }
    else {
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
      action: () => deleteNote({ id_nota, id_actividad })
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
    flag ? updatePriorityAndAddNote({ prioridad_numero: 100, id_actividad, description })
      : newNote({ id_actividad, description })
  }

  const onChangePage = (e, value) => {
    const offset = ((value - 1) * pager.limit) % total
    setPager({ ...pager, page: value })
    saveFilters({ payload: { offset, limit: pager.limit } })
  }

  return (
    <>
      {
        view ?
          <section className='pt-10 pb-24 container mx-auto gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {
              activities.length > 0 ?
                activities.map((act, i) => (
                  <ActivityCard
                    key={i}
                    numberCard={i + 1}
                    highPriority={() => updatePriority({ prioridad_numero: 100, id_actividad: act.id_det })}
                    mediumPriority={() => updatePriority({ prioridad_numero: 400, id_actividad: act.id_det })}
                    lowPriority={() => updatePriority({ prioridad_numero: 600, id_actividad: act.id_det })}
                    noPriority={() => updatePriority({ prioridad_numero: 1000, id_actividad: act.id_det })}
                    addNote={onAddNote}
                    addDefaultNote={onAddDefaultNote}
                    updateNote={onUpdateNote}
                    deleteNote={onDeleteNote}
                    pauseActivity={onPauseActivity}
                    playActivity={onPlayActivity}
                    {...act}
                  />
                )) : <div className='text-center col-span-4 text-slate-400'>No hay actividades...</div>
            }
          </section>
          :
          <section className='px-5'>
            <Table>
              <THead>
                <tr className='text-center capitalize text-white bg-slate-700'>
                  <Th>Nᵒ</Th>
                  <Th>ID</Th>
                  <Th>ticket</Th>
                  <Th>proyecto</Th>
                  <Th>sub proyecto</Th>
                  <Th>solicitante</Th>
                  <Th>encargado</Th>
                  <Th>prioridad</Th>
                  <Th>fecha</Th>
                  <Th>
                    actividad
                    <Button
                      className='ml-2'
                      type='icon'
                      icon={multiline ? 'fas fa-angle-up' : 'fas fa-angle-down'}
                      onClick={() => setMultiline(!multiline)}
                    />
                  </Th>
                  <Th>
                    descripcion
                    <Button
                      className='ml-2'
                      type='icon'
                      icon={multiline ? 'fas fa-angle-up' : 'fas fa-angle-down'}
                      onClick={() => setMultiline(!multiline)}
                    />
                  </Th>
                  <Th>estado</Th>
                  <Th></Th>
                </tr>
              </THead>
              <TBody>
                {
                  activities.length > 0 &&
                  activities.map((act, i) => (
                    <tr
                      onDoubleClick={() => navigate(`detalle-actividad/${act.id_det}`, { replace: true })}
                      key={act.id_det}
                      className={`
                      text-sm border-b border-gray-500 text-gray-800
                      transition duration-300 cursor-pointer
                      ${act.prioridad_etiqueta === 600 ? 'bg-green-400/40 hover:bg-green-400/90' :
                          act.prioridad_etiqueta === 400 ? 'bg-yellow-400/40 hover:bg-yellow-400/90' :
                            act.prioridad_etiqueta === 100 ? 'bg-red-400/40 hover:bg-red-400/90' :
                              'bg-white hover:bg-black/10'}
                      `}
                    >
                      <Td bgcolor>
                        <span
                          className="px-2 font-semibold leading-tight bg-indigo-300 text-indigo-600 rounded-md"
                        >
                          {i + 1}
                        </span>
                      </Td>
                      <Td className='font-bold'>{act.id_det}</Td>
                      <Td className={act.num_ticket_edit ? 'font-bold' : ''} bgcolor>{act.num_ticket_edit || '--'}</Td>
                      <Td className='font-bold'>{act.abrev}</Td>
                      <Td bgcolor>{act.nombre_sub_proy ?? '--'}</Td>
                      <Td>{act.user_solicita}</Td>
                      <Td className='font-bold' bgcolor>{act.encargado_actividad}</Td>
                      <Td className='font-bold'>{act.num_prioridad}</Td>
                      <Td bgcolor>{moment(act.fecha_tx).format('DD/MM/yyyy')}</Td>
                      <Td isMultiLine={multiline} className='font-bold' width='max-w-[150px]' align='text-left'>{act.actividad || 'Sin Titulo'}</Td>
                      <Td isMultiLine={multiline} bgcolor align='text-left'>{act.func_objeto}</Td>
                      <Td className='font-bold'>{act.estado === 1 ? 'Pendiente' : 'En trabajo'}</Td>
                      <Td
                        className='flex items-center justify-between gap-2'
                        bgcolor
                        isModal
                        pauseActivity={onPauseActivity}
                        playActivity={onPlayActivity}
                        {...act}
                      >
                        <div className='flex gap-1.5 p-1.5 rounded-full bg-black/5'>
                          <span
                            className='h-3.5 w-3.5 rounded-full bg-slate-400 transition hover:border
                              duration-200 hover:scale-125 transform cursor-pointer'
                            onClick={() => updatePriority({ prioridad_numero: 1000, id_actividad: act.id_det })}
                          />
                          <span
                            className='h-3.5 w-3.5 rounded-full bg-green-800/70 transition hover:border
                              duration-200 hover:scale-125 transform cursor-pointer'
                            onClick={() => updatePriority({ prioridad_numero: 600, id_actividad: act.id_det })}
                          />
                          <span
                            className='h-3.5 w-3.5 rounded-full bg-yellow-600/80 transition hover:border
                              duration-200 hover:scale-125 transform cursor-pointer'
                            onClick={() => updatePriority({ prioridad_numero: 400, id_actividad: act.id_det })}
                          />
                          <span
                            className='h-3.5 w-3.5 rounded-full bg-red-800/70 transition hover:border
                              duration-200 hover:scale-125 transform cursor-pointer'
                            onClick={() => updatePriority({ prioridad_numero: 100, id_actividad: act.id_det })}
                          />
                        </div>
                      </Td>
                    </tr>
                  ))}
              </TBody>
            </Table>
          </section >
      }

      <footer className='fixed bottom-0 h-11 bg-zinc-100 text-slate-700 border w-full flex items-center justify-around'>
        <span>{activities.length} Actividades</span>
        <Pagination
          size='small'
          count={Math.ceil(Number(total) / Number(pager.limit))}
          color='primary'
          onChange={onChangePage}
          page={pager.page}
        />
        <div className='flex gap-2'>
          <Button
            type='icon'
            icon='fas fa-border-all'
            className={`hover:text-blue-500 hover:bg-slate-200 rounded-lg ${view && 'text-blue-500'}`}
            onClick={() => setView(true)}
          />
          <Button
            type='icon'
            icon='fas fa-th-list'
            className={`hover:text-blue-500 hover:bg-slate-200 rounded-lg ${!view && 'text-blue-500'}`}
            onClick={() => setView(false)}
          />
          <select
            className='rounded-lg bg-white p-1 border border-gray-300'
            value={pager.limit}
            onChange={e => {
              setPager({ page: 1, limit: Number(e.target.value) })
              saveFilters({ payload: { limit: Number(e.target.value), offset: 0 } })
            }}>
            <option value=''>todos</option>
            <option value='10'>10</option>
            <option value='25'>25</option>
            <option value='50'>50</option>
            <option value='100'>100</option>
          </select>
        </div>
      </footer>

    </>
  )
}

export default Activity
