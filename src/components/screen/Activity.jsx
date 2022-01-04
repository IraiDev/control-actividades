import { useState } from 'react'
import { useActivity } from '../../hooks/useActivity'
import ActivityCard from '../card/ActivityCard'
import Modal from '../ui/Modal'
import TextArea from '../ui/TextArea'
import Button from '../ui/Button'
import moment from 'moment'
import { Alert } from '../../helpers/alerts'
import Pagination from '@mui/material/Pagination'
import Table from '../table/Table'
import TBody from '../table/TBody'
import THead from '../table/THead'
import Th from '../table/Th'
import Td from '../table/Td'

const defaultNotes = [
  { id: 11121, desc: 'Inicializar actividad urgente' },
  { id: 11122, desc: 'esperando respuesta de cliente' },
  { id: 11123, desc: 'esperando actividad...' },
  { id: 11124, desc: 'trabajando...' },
  { id: 11125, desc: 'sin avance' },
  { id: 11126, desc: 'en cola' }
]

const defaultPauses = [
  { id: 1112121, desc: 'Hora de colacion...' },
  { id: 1112223, desc: 'Para ver otra actividad...' },
  { id: 1112322, desc: 'Por reunion de trabajo...' },
  { id: 1112424, desc: 'Salida a terreno...' }
]

const Activity = () => {

  // const { user } = useContext(ActivityContext)
  const [view, setView] = useState(true)
  const [modalEdit, toggleModalEdit] = useState(false)
  const [modalAdd, toggleModalAdd] = useState(false)
  const [modalPause, toggleModalPause] = useState(false)
  const [notes, setNotes] = useState([])
  const [values, setValues] = useState({ desc: '', id: null, id_ref: null, title: '', content: '' })
  const { activities, newNote, updateNote, deleteNote,
    updatePriority, onPlayPause, updatePriorityAndAddNote } = useActivity()

  const openModalEdit = ({ notes }) => {
    toggleModalEdit(true)
    setNotes(notes.map(note => ({
      ...note,
      id: note.id_nota,
      desc: note.desc_nota,
      user: note.user_crea_nota.abrev_user,
      date: note.fecha_hora_crea,
      id_activity: note.id_det,
      select: false
    })))
  }

  const openModalAdd = ({ id_activity }) => {
    toggleModalAdd(true)
    setValues({ ...values, id_ref: id_activity })
  }

  const onCloseModals = () => {
    toggleModalEdit(false)
    toggleModalAdd(false)
    toggleModalPause(false)
    setValues({ desc: '', id: null, id_ref: null })
  }

  const handleOnPlayPause = ({ pausaState, props }) => {
    if (pausaState) {
      toggleModalPause(true)
      setValues({ ...values, id_ref: props.id_det, title: props.actividad || 'Sin titulo', content: props.func_objeto || 'Sin descripcion' })
    }
    else { onPlayPause({ id_actividad: props.id_det }) }
  }

  const onPause = () => {
    if (values.desc.trim() === '') {
      Alert({
        icon: 'warn',
        title: 'Atención',
        content: 'No puedes guardar una pausa sin un mensaje',
        showCancelButton: false,
      })
      return
    }
    onPlayPause({ id_actividad: values.id_ref, mensaje: values.desc })
    onCloseModals()
  }

  const onDelete = ({ id, id_activity, desc }) => {
    Alert({
      icon: 'warn',
      title: 'Atención',
      content: `¿Estas seguro de eliminar la siguiente nota: <strong>${desc}</strong>?`,
      cancelButton: 'No, cancelar',
      confirmButton: 'Si, eliminar',
      action: () => {
        deleteNote({ id_nota: id, id_actividad: id_activity })
        setNotes(notes.filter(n => n.id !== id))
      }
    })
  }

  const onUpdate = () => {
    if (values.desc.trim() === '') {
      Alert({
        title: 'Atención',
        content: 'No puedes actualizar una nota sin una descripcion',
        showCancelButton: false,
      })
      return
    }
    updateNote({ id_nota: values.id, description: values.desc, id_actividad: values.id_ref })
    setNotes(notes.map(note => note.id === values.id ? { ...note, desc: values.desc } : note))
  }

  const onAdd = () => {
    if (values.desc.trim() === '') {
      Alert({
        title: 'Atención',
        content: 'No puedes crear una nota sin una descripcion',
        showCancelButton: false,
      })
      return
    }
    newNote({ id_actividad: values.id_ref, description: values.desc })
    onCloseModals()
  }

  return (
    <>
      {
        view ?
          <section className='
            pt-10 pb-24 container mx-auto gap-3 grid 
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
          '>
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
                    addNote={() => openModalAdd({ id_activity: act.id_det })}
                    updateNote={() => openModalEdit({ notes: act.notas })}
                    onPlayPause={({ props, pausaState }) => handleOnPlayPause({ props, pausaState })}
                    {...act}
                  />
                )) : <div className='text-center col-span-4 text-slate-400'>No hay actividades...</div>
            }
          </section>

          :

          <Table>
            <THead>
              <tr className='font-semibold text-center capitalize text-white bg-gray-700'>
                <Th>Nᵒ</Th>
                <Th>ID</Th>
                <Th>ticket</Th>
                <Th>proyecto</Th>
                <Th>sub proyecto</Th>
                <Th>solicitante</Th>
                <Th>encargado</Th>
                <Th>prioridad</Th>
                <Th>fecha</Th>
                <Th>actividad</Th>
                <Th>descripion</Th>
                <Th>estado</Th>
                <Th>acciones</Th>
              </tr>
            </THead>
            <TBody>
              {
                activities.length > 0 &&
                activities.map((act, i) => (
                  <tr
                    key={act.id_det}
                    className='text-gray-700 text-sm border-b border-gray-300 
                      hover:bg-blue-100 transition duration-300 cursor-pointer'
                  >
                    <Td bgcolor>
                      <span
                        className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-md"
                      >
                        {i + 1}
                      </span>
                    </Td>
                    <Td>{act.id_det}</Td>
                    <Td bgcolor>{act.num_ticket_edit || '--'}</Td>
                    <Td>{act.proyecto_tarea.abrev}</Td>
                    <Td bgcolor>{act.subproyectos_tareas?.nombre_sub_proy ?? '--'}</Td>
                    <Td>{act.user_solicita}</Td>
                    <Td bgcolor>{act.encargado_actividad}</Td>
                    <Td>{act.num_prioridad}</Td>
                    <Td bgcolor>{moment(act.fecha_tx).format('DD/MM/yyyy')}</Td>
                    <Td width='max-w-[150px]' align='text-left'>{act.actividad || 'Sin Titulo'}</Td>
                    <Td bgcolor align='text-left'>{act.func_objeto}</Td>
                    <Td>{act.estado === 1 ? 'Pendiente' : 'En trabajo'}</Td>
                    <Td bgcolor>xd</Td>
                  </tr>
                ))}
            </TBody>
          </Table>

      }

      <footer className='fixed bottom-0 h-11 bg-slate-100 border w-full flex items-center justify-around'>
        <span>{activities.length} Actividades</span>
        <Pagination size='small' count={10} color='primary' />
        <div>
          <Button
            type='icon'
            icon='fas fa-th-large'
            className='hover:text-blue-500 hover:bg-slate-200 rounded-lg'
            onClick={() => setView(true)}
          />
          <Button
            type='icon'
            icon='fas fa-list'
            className='hover:text-blue-500 hover:bg-slate-200 rounded-lg'
            onClick={() => setView(false)}
          />
        </div>
      </footer>

      {/* modal edit */}
      <Modal showModal={modalEdit} isBlur={false} onClose={onCloseModals}
        className='max-w-2xl' padding='p-5'
      >
        <div className='grid gap-5'>
          <h1 className='text-xl font-semibold capitalize'>Modificar Notas</h1>
          <h5 className='text-sm'>Notas actuales: </h5>
          <ul className='max-h-56 overflow-custom'>
            {
              notes.length > 0 ?
                notes.map(note => (
                  <li
                    key={note.id_nota}
                    className={`
                      flex items-center justify-between bg-black/5 rounded-lg py-1.5 px-3 mr-1.5 cursor-pointer
                      shadow-md shadow-gray-400/20 mb-1.5 hover:bg-black/10 transition duration-200
                      ${values.id === note.id_nota && 'border-2 border-blue-400'}
                      `}
                    onClick={() => {
                      setValues({ desc: note.desc, id: note.id, id_ref: note.id_activity })
                    }}
                  >
                    <span>
                      <h1>
                        {note.user}
                        <span className='text-gray-600 text-xs font-light ml-2'>{moment(note.date).format('DD/MM/yyyy, HH:mm')}</span>
                      </h1>
                      <p className='text-gray-600 text-sm'>{note.desc}</p>
                    </span>
                    <button
                      className='ml-2 text-red-400 hover:text-red-600 transition duration-200 transform hover:hover:scale-125'
                      onClick={() => onDelete({ id: note.id, id_activity: note.id_activity, desc: note.desc })}
                    >
                      <i className='fas fa-trash fa-sm'></i>
                    </button>
                  </li>
                )) : <li className='text-gray-500 text-sm ml-2'>No hay notas...</li>
            }
          </ul>
          <TextArea
            disabled={values.id === null}
            placeholder='Selecciona una nota para editar...'
            field='descripcion'
            value={values.desc}
            onChange={e => setValues({ ...values, desc: e.target.value })}
          />
          <Button
            className='
              w-max border border-blue-400 text-blue-400 hover:text-white hover:bg-blue-400 
              hover:shadow-lg hover:shadow-blue-500/30 rounded-full place-self-end'
            name='modificar nota'
            onClick={onUpdate}
          />
        </div>
      </Modal>

      {/* modal add */}
      <Modal showModal={modalAdd} isBlur={false} onClose={onCloseModals}
        className='max-w-2xl' padding='p-5'
      >
        <div className='grid gap-5'>
          <h1 className='text-xl font-semibold capitalize'>crear Notas</h1>
          <h5 className='text-sm'>Notas rapidas: </h5>
          <ul className='max-h-56 overflow-custom'>
            {
              defaultNotes.map(note => (
                <li
                  key={note.id}
                  className='flex items-center justify-between bg-black/5 rounded-lg py-1.5 px-3 mr-1.5 shadow-md shadow-gray-400/20 mb-1.5 hover:bg-black/10 transition duration-200'
                >
                  <span>
                    <p className='text-gray-600 text-sm'>{note.desc}</p>
                  </span>
                  <button
                    className='ml-2 text-blue-400 hover:text-blue-600 transition duration-200 transform hover:hover:scale-125'
                    onClick={() => {
                      note.id === 11121 ? updatePriorityAndAddNote({ prioridad_numero: 100, id_actividad: values.id_ref, description: note.desc })
                        : newNote({ id_actividad: values.id_ref, description: note.desc })
                      onCloseModals()
                    }}
                  >
                    <i className='fas fa-tag fa-sm'></i>
                  </button>
                </li>
              ))
            }
          </ul>
          <TextArea
            field='descripcion'
            value={values.desc}
            onChange={e => setValues({ ...values, desc: e.target.value })}
          />
          <Button
            className='
              w-max border border-blue-400 text-blue-400 hover:text-white hover:bg-blue-400 
              hover:shadow-lg hover:shadow-blue-500/30 rounded-full place-self-end'
            name='crear nota'
            onClick={onAdd}
          />
        </div>
      </Modal>

      {/* modal pause */}
      <Modal showModal={modalPause} isBlur={false} onClose={onCloseModals}
        className='max-w-2xl' padding='p-5'
      >
        <div className='grid gap-5'>
          <h1 className='text-xl font-semibold capitalize'>
            Pausar actividad: {values.title}, {values.id_ref}
          </h1>
          <h5 className='text-sm'>Descripcion actividad: </h5>
          <p className='text-sm whitespace-pre-wrap max-h-44 overflow-custom p-1.5 rounded-lg bg-black/5'>
            {values.content}
          </p>
          <h5 className='text-sm'>Pausas rapidas: </h5>
          <ul className='max-h-56 overflow-custom'>
            {
              defaultPauses.map(pause => (
                <li
                  key={pause.id}
                  className='flex items-center justify-between bg-black/5 rounded-lg py-1.5 px-3 mr-1.5 shadow-md shadow-gray-400/20 mb-1.5 hover:bg-black/10 transition duration-200'
                >
                  <p className='text-gray-600 text-sm'>{pause.desc}</p>
                  <button
                    className='ml-2 text-red-400 hover:text-red-600 transition duration-200 transform hover:hover:scale-125'
                    onClick={() => {
                      onPlayPause({ id_actividad: values.id_ref, mensaje: pause.desc })
                      onCloseModals()
                    }}
                  >
                    <i className='fas fa-pause fa-sm' />
                  </button>

                </li>
              ))
            }
          </ul>
          <TextArea
            field='Mensaje pausa'
            value={values.desc}
            onChange={e => setValues({ ...values, desc: e.target.value })}
          />
          <footer className='flex items-center justify-between'>
            <Button
              className='
              w-max border border-blue-400 text-blue-400 hover:text-white hover:bg-blue-400 
              hover:shadow-lg hover:shadow-blue-500/30 rounded-full'
              name='cancelar'
              onClick={() => onCloseModals()}
            />
            <Button
              className='
              w-max border border-red-400 text-red-400 hover:text-white hover:bg-red-400 
              hover:shadow-lg hover:shadow-red-500/30 rounded-full'
              name='Pausar actividad'
              onClick={onPause}
            />
          </footer>
        </div>
      </Modal>

    </>
  )
}

export default Activity
