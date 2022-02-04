import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import { useForm } from '../../hooks/useForm'
import LiNote from '../ui/LiNote'
import Modal from '../ui/Modal'
import TextArea from '../ui/TextArea'
import Button from '../ui/Button'
import P from '../ui/P'
import moment from 'moment'

const defaultNotes = [
  { id: 11121, desc: 'Inicializar actividad urgente' },
  { id: 11122, desc: 'esperando respuesta de cliente' },
  { id: 11123, desc: 'esperando actividad...' },
  { id: 11124, desc: 'trabajando...' },
  { id: 11125, desc: 'sin avance' },
  { id: 11126, desc: 'en cola' },
]

const defaultPauses = [
  { id: 1112121, desc: 'Hora de colacion...' },
  { id: 1112223, desc: 'Para ver otra actividad...' },
  { id: 1112322, desc: 'Por reunion de trabajo...' },
  { id: 1112424, desc: 'Salida a terreno...' },
]

const TODAY = moment(new Date()).format('yyyy-MM-DD')

const itemStyle =
  'hover:bg-blue-400 hover:text-white flex items-center justify-between gap-2'

const colors = priority => {
  switch (priority) {
    case 600:
      return {
        priority: 'Baja',
        card: 'text-white bg-green-700/70',
        menu: 'text-white bg-green-800',
        desc: 'bg-green-800/20',
      }
    case 400:
      return {
        priority: 'Media',
        card: 'text-white bg-yellow-600/70',
        menu: 'text-white bg-yellow-500',
        desc: 'bg-yellow-600/30',
      }
    case 100:
      return {
        priority: 'Alta',
        card: 'text-white bg-red-800/70',
        menu: 'text-white bg-red-800',
        desc: 'bg-red-800/20',
      }
    default:
      return {
        priority: 'S/P',
        card: 'bg-white text-slate-600',
        menu: 'bg-white text-slate-600',
        desc: 'bg-zinc-100',
      }
  }
}

const ActivityCard = props => {
  const {
    addDefaultNote,
    addNote,
    updateNote,
    deleteNote,
    lowPriority,
    mediumPriority,
    highPriority,
    noPriority,
    numberCard,
    playActivity,
    pauseActivity,
    estado,
    estado_play_pausa,
    prioridad_etiqueta,
    fecha_tx,
  } = props

  const date = moment(fecha_tx).format('yyyy-MM-DD')

  const navigate = useNavigate()

  const [{ desc }, onChangeValues, reset] = useForm({ desc: '' })
  const [values, setValues] = useState({ desc: '', id: null })

  // modals
  const [modalEdit, toggleModalEdit] = useState(false)
  const [modalAdd, toggleModalAdd] = useState(false)
  const [modalPause, toggleModalPause] = useState(false)

  const onCloseModals = () => {
    reset()
    toggleModalEdit(false)
    toggleModalAdd(false)
    toggleModalPause(false)
    setValues({ desc: '', id: null })
  }

  return (
    <>
      <main
        className={`
        ${colors(prioridad_etiqueta).card}
        border border-black/10
        p-4 rounded-xl shadow-lg grid content-between transition duration-200 hover:scale-98 transform 
        text-sm shadow-zinc-400/40 hover:shadow-xl hover:shadow-zinc-400/40 relative
        `}
        onDoubleClick={() =>
          navigate(`detalle-actividad/${props.id_det}`, { replace: true })
        }
      >
        <div>
          <header className='flex items-start justify-between gap-3 capitalize font-semibold'>
            <h1 className='text-base'>{props.actividad || 'Sin Titulo'}</h1>
            <span className='bg-amber-200/80 text-amber-600 shadow rounded py-0.5 px-2.5 mb-2'>
              {numberCard}
            </span>
          </header>

          <section className='grid grid-cols-2 gap-2'>
            <aside className='capitalize'>
              <P tag='encargado' value={props.encargado_actividad} />
              <P tag='proyecto' value={props.abrev} />
              <P tag='sub proyecto' value={props.nombre_sub_proy} />
              <P tag='solicita' value={props.user_solicita} />
              <P
                tag='estado'
                value={estado === 1 ? ' pendiente' : ' en trabajo'}
              />
            </aside>

            <aside className='capitalize'>
              <P tag='ID' value={props.id_det} />
              <P tag='ticket' value={props.num_ticket_edit} />
              <P tag='fecha' value={moment(fecha_tx).format('DD-MM-YYYY')} />
              <P
                tag='transcurridos'
                value={
                  moment(date).diff(TODAY, 'days') -
                  moment(date).diff(TODAY, 'days') * 2
                }
              />
              <P
                tag='Prioridad'
                value={
                  <>
                    {colors(prioridad_etiqueta).priority} ({props.num_prioridad}
                    )
                  </>
                }
              />
            </aside>
          </section>

          <section className='mt-2'>
            <h5 className='font-semibold capitalize mb-2'>descripcion</h5>
            <div className='overflow-custom max-h-36 mix-blend-luminosity'>
              <p
                className={`${colors(prioridad_etiqueta).desc} 
                min-h-[144px] whitespace-pre-wrap rounded-md p-1.5`}
              >
                {props.func_objeto}
              </p>
            </div>
          </section>

          <section className='mt-2'>
            <h5 className='font-semibold capitalize'>notas (informes)</h5>
            <ul className='max-h-36 overflow-custom whitespace-pre-wrap mix-blend-luminosity'>
              {props.notas.length > 0 ? (
                props.notas.map((note, i) => (
                  <LiNote
                    key={note.id_nota}
                    numberNote={i + 1}
                    className={
                      colors(prioridad_etiqueta).priority === 'S/P'
                        ? 'text-slate-700/50'
                        : 'text-white/60'
                    }
                    {...note}
                  />
                ))
              ) : (
                <li
                  className={
                    colors(prioridad_etiqueta).priority === 'S/P'
                      ? 'text-slate-700/50'
                      : 'text-white/60'
                  }
                >
                  No hay notas...
                </li>
              )}
            </ul>
          </section>
        </div>
        <footer className='flex justify-between items-center border-t w-full pt-2 mt-2'>
          {estado !== 1 ? (
            <button
              onClick={
                estado_play_pausa === 2
                  ? () => toggleModalPause(true)
                  : () => playActivity({ id_actividad: props.id_det })
              }
            >
              {estado_play_pausa === 2 ? (
                <i className='fas fa-pause fa-sm' />
              ) : (
                <i className='fas fa-play fa-sm' />
              )}
            </button>
          ) : (
            <p>estado</p>
          )}
          <span>
            <Menu
              className={colors(prioridad_etiqueta).menu}
              direction='top'
              align='end'
              menuButton={
                <MenuButton>
                  <i className='fas fa-bars' />
                </MenuButton>
              }
            >
              <MenuItem
                className={itemStyle}
                onClick={() => toggleModalAdd(true)}
              >
                Nueva nota
                <i className='fas fa-plus' />
              </MenuItem>
              <MenuItem
                className={itemStyle}
                onClick={() => toggleModalEdit(true)}
              >
                Editar nota
                <i className='fas fa-pen' />
              </MenuItem>
              <MenuItem className={itemStyle} onClick={highPriority}>
                Prioridad alta
                <span className='h-4 w-4 rounded-full bg-red-400' />
              </MenuItem>
              <MenuItem className={itemStyle} onClick={mediumPriority}>
                Prioridad media
                <span className='h-4 w-4 rounded-full bg-yellow-400' />
              </MenuItem>
              <MenuItem className={itemStyle} onClick={lowPriority}>
                Prioridad baja
                <span className='h-4 w-4 rounded-full bg-green-400' />
              </MenuItem>
              <MenuItem className={itemStyle} onClick={noPriority}>
                Sin Prioridad
                <span className='h-4 w-4 rounded-full bg-gray-300' />
              </MenuItem>
            </Menu>
          </span>
        </footer>

        {estado_play_pausa === 2 && (
          <div
            className='absolute -top-1 -left-1'
            title='Trabajando en esta actividad'
          >
            <span className='h-3.5 w-3.5 rounded-full bg-red-400' />
            <span className='h-3.5 w-3.5 rounded-full bg-red-400 animate-ping' />
          </div>
        )}
      </main>

      {/* modal add */}
      <Modal
        showModal={modalAdd}
        isBlur={false}
        onClose={onCloseModals}
        className='max-w-2xl'
        padding='p-4 md:p-6'
      >
        <div className='grid gap-5'>
          <h1 className='text-xl font-semibold capitalize'>crear Notas</h1>
          <h5 className='text-sm'>Notas rapidas: </h5>
          <ul className='max-h-56 overflow-custom'>
            {defaultNotes.map(note => (
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
                    addDefaultNote({
                      flag: note.id === 11121,
                      id_actividad: props.id_det,
                      description: note.desc,
                    })
                    onCloseModals()
                  }}
                >
                  <i className='fas fa-tag fa-sm' />
                </button>
              </li>
            ))}
          </ul>
          <TextArea
            field='descripcion'
            name='desc'
            value={desc}
            onChange={onChangeValues}
          />
          <Button
            className='w-max text-blue-500 hover:bg-blue-100 rounded-full place-self-end'
            name='crear nota'
            onClick={() => {
              addNote({ id_actividad: props.id_det, description: desc })
              onCloseModals()
            }}
          />
        </div>
      </Modal>

      {/* modal edit */}
      <Modal
        showModal={modalEdit}
        isBlur={false}
        onClose={onCloseModals}
        className='max-w-2xl'
        padding='p-4 md:p-6'
      >
        <div className='grid gap-5'>
          <h1 className='text-xl font-semibold capitalize'>Modificar Notas</h1>
          <h5 className='text-sm'>Notas actuales: </h5>
          <ul className='max-h-56 overflow-custom'>
            {props.notas.length > 0 ? (
              props.notas.map(note => (
                <li
                  key={note.id_nota}
                  className={`flex items-center justify-between bg-black/5 rounded-lg py-1.5 px-3 mr-1.5 shadow mb-1.5 hover:bg-black/10 transition duration-200 ${
                    values.id === note.id_nota && 'border-2 border-blue-400'
                  }`}
                >
                  <span
                    className='w-full cursor-pointer text-gray-600 hover:text-blue-400 transition duration-200'
                    onClick={() =>
                      setValues({ desc: note.desc_nota, id: note.id_nota })
                    }
                  >
                    <h1>
                      {note.usuario.abrev_user}
                      <span className='text-xs font-light ml-2'>
                        {moment(note.date).format('DD/MM/yyyy, HH:mm')}
                      </span>
                    </h1>
                    <p className='text-sm'>{note.desc_nota}</p>
                  </span>
                  <button
                    className='ml-2 text-red-400 hover:text-red-600 transition duration-200 transform hover:hover:scale-125'
                    onClick={() => {
                      deleteNote({
                        id_nota: note.id_nota,
                        id_actividad: props.id_det,
                        description: note.desc_nota,
                      })
                      setValues({ desc: '', id: null })
                    }}
                  >
                    <i className='fas fa-trash fa-sm'></i>
                  </button>
                </li>
              ))
            ) : (
              <li className='text-gray-500 text-sm ml-2'>No hay notas...</li>
            )}
          </ul>
          <TextArea
            disabled={values.id === null}
            placeholder='Selecciona una nota para editar...'
            field='descripcion'
            value={values.desc}
            onChange={e => setValues({ ...values, desc: e.target.value })}
          />
          <Button
            className='w-max text-blue-500 hover:bg-blue-100 rounded-full place-self-end'
            name='modificar nota'
            onClick={() =>
              updateNote({
                id_nota: values.id,
                description: values.desc,
                id_actividad: props.id_det,
              })
            }
          />
        </div>
      </Modal>

      {/* modal pause */}
      <Modal
        showModal={modalPause}
        isBlur={false}
        onClose={onCloseModals}
        className='max-w-2xl'
        padding='p-4 md:p-6'
      >
        <div className='grid gap-5'>
          <h1 className='text-xl font-semibold capitalize'>
            Pausar actividad: {props.actividad || 'Sin titulo'}, {props.id_det}
          </h1>
          <h5 className='text-sm'>Descripcion actividad: </h5>
          <p className='text-sm whitespace-pre-wrap max-h-44 overflow-custom p-1.5 rounded-lg bg-black/5'>
            {props.func_objeto}
          </p>
          <h5 className='text-sm'>Pausas rapidas: </h5>
          <ul className='max-h-56 overflow-custom'>
            {defaultPauses.map(pause => (
              <li
                key={pause.id}
                className='flex items-center justify-between bg-black/5 rounded-lg py-1.5 px-3 mr-1.5 shadow-md shadow-gray-400/20 mb-1.5 hover:bg-black/10 transition duration-200'
              >
                <p className='text-gray-600 text-sm'>{pause.desc}</p>
                <button
                  className='ml-2 text-red-400 hover:text-red-600 transition duration-200 transform hover:hover:scale-125'
                  onClick={() => {
                    pauseActivity({
                      flag: true,
                      id_actividad: props.id_det,
                      mensaje: pause.desc,
                    })
                    onCloseModals()
                  }}
                >
                  <i className='fas fa-pause fa-sm' />
                </button>
              </li>
            ))}
          </ul>
          <TextArea
            field='Mensaje pausa'
            value={values.desc}
            onChange={e => setValues({ ...values, desc: e.target.value })}
          />
          <footer className='flex items-center justify-between'>
            <Button
              className='w-max text-blue-500 hover:bg-blue-100 rounded-full'
              name='cancelar'
              onClick={() => onCloseModals()}
            />
            <Button
              className='w-max text-red-500 hover:bg-red-100 rounded-full'
              name='Pausar actividad'
              onClick={() => {
                pauseActivity({
                  flag: false,
                  id_actividad: props.id_det,
                  mensaje: values.desc,
                })
                onCloseModals()
              }}
            />
          </footer>
        </div>
      </Modal>
    </>
  )
}

export default ActivityCard
