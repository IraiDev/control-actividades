import { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useDetail } from '../../hooks/useDetail'
import Button from '../ui/Button'
import TextArea from '../ui/TextArea'
import Input from '../ui/Input'
import Select from 'react-select'
import { Alert } from '../../helpers/alerts'
import Modal from '../ui/Modal'
import { ActivityContext } from '../../context/ActivityContext'

const today = moment(new Date()).format('YYYY/MM/DD')
const baseUrl = 'http://www.zcloud.cl/registro_avance/'

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

const Detail = () => {

  const navigate = useNavigate()
  const { id } = useParams()
  const { filters } = useContext(ActivityContext)
  const { activity, newNote, updateNote, deleteNote, updatePriority, onPlayPause,
    updatePriorityAndAddNote, saveActivity, cloneActivity } = useDetail(id)

  const [modalEdit, toggleModalEdit] = useState(false)
  const [modalAdd, toggleModalAdd] = useState(false)
  const [modalClone, toggleModalClone] = useState(false)

  const [modalPause, toggleModalPause] = useState(false)
  const [options, setOptions] = useState({})
  const [files, setFiles] = useState(null)
  const [values, setValues] = useState({ id: null, desc: '', content: '' })
  const [fields, setFields] = useState({
    title: '', description: '', priority: '', ticket: '', time: '', gloss: ''
  })

  // clone states
  const [cloneOptions, setCloneOptions] = useState({})
  const [cloneFiles, setCloneFiles] = useState(null)
  const [cloneFields, setCloneFields] = useState({
    cTitle: '', cDescription: '', cPriority: '', cTicket: '', cTime: '', cGloss: ''
  })
  // destructuring
  const { pausas } = activity
  const { title, description, gloss, ticket, priority, time } = fields
  const { cTitle, cDescription, cPriority, cTicket, cTime, cGloss } = cloneFields
  const { projects, subProjects, users } = filters

  const date = moment(activity.fecha_tx)
  const pausaState = pausas?.length > 0 && pausas[pausas?.length - 1].boton === 2
  let userStyles = {
    priority: 'S/P',
    styles: 'bg-gray-200 hover:border-gray-400'
  }

  switch (activity.prioridad_etiqueta) {
    case 600:
      userStyles = {
        priority: 'Baja',
        styles: 'text-white bg-green-800/70',
        menu: 'text-white bg-green-800',
        hoverMenu: 'hover:bg-green-700',
      }
      break
    case 400:
      userStyles = {
        priority: 'Media',
        styles: 'text-white bg-yellow-500/80',
        menu: 'text-white bg-yellow-500',
        hoverMenu: 'hover:bg-yellow-400',
      }
      break
    case 100:
      userStyles = {
        priority: 'Alta',
        styles: 'text-white bg-red-800/70',
        menu: 'text-white bg-red-800',
        hoverMenu: 'hover:bg-red-700',
      }
      break

    default:
      break
  }

  const onCloseModals = () => {
    toggleModalEdit(false)
    toggleModalAdd(false)
    toggleModalPause(false)
    toggleModalClone(false)
    setValues({ desc: '', id: null, id_ref: null })
  }

  const openModalClone = () => {

    const setFieldsData = (ticket = 0) => {
      setCloneFields({
        cTicket: ticket,
        cTitle: title,
        cDescription: description,
        cPriority: priority,
        cTime: time,
        cGloss: gloss
      })

      setCloneOptions({
        pr: projects.find(p => p.value === activity.id_proy),
        sp: subProjects.find(s => s.id === activity.id_proy && s.value === activity.id_sub_proyecto),
        us: users.find(u => u.value === activity.user_solicita),
        ue: users.find(u => u.value === activity.encargado_actividad),
      })
    }

    if (activity.num_ticket_edit === 0) {
      setFieldsData()
      toggleModalClone(true)
      return
    }

    Alert({
      title: 'Atención',
      content: 'Desea incluir el ticket en la nueva actividad clonada?',
      confirmButton: 'Si, incluir',
      cancelButton: 'No, incluir',
      cancelAction: () => {
        setFieldsData()
        toggleModalClone(true)
      },
      action: () => {
        setFieldsData(ticket)
        toggleModalClone(true)
      }
    })
  }

  const handleOnPlayPause = () => {
    if (pausaState) {
      toggleModalPause(true)
      setValues({
        ...values,
        id_ref: activity.id_det,
        title: activity.actividad || 'Sin titulo',
        content: activity.func_objeto || 'Sin descripcion'
      })
    }
    else { onPlayPause({ id_actividad: activity.id_det }) }
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
    onPlayPause({ id_actividad: activity.id_det, mensaje: values.desc })
    onCloseModals()
  }

  const onDelete = ({ id, desc }) => {
    Alert({
      icon: 'warn',
      title: 'Atención',
      content: `¿Estas seguro de eliminar la siguiente nota: <strong>${desc}</strong>?`,
      cancelButton: 'No, cancelar',
      confirmButton: 'Si, eliminar',
      action: () => {
        deleteNote({ id_nota: id, id_actividad: activity.id_det })
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
    updateNote({ id_nota: values.id, description: values.desc, id_actividad: activity.id_det })
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
    newNote({ id_actividad: activity.id_det, description: values.desc })
    onCloseModals()
  }

  const onSave = async () => {
    const formData = new FormData()
    options?.pr && formData.append('proyecto', options.pr)
    options?.sp && formData.append('sub_proyecto', options.sp)
    options?.us && formData.append('solicita', options.us)
    options?.ue && formData.append('encargado', options.ue)
    options?.ur && formData.append('revisor', options.ur)
    formData.append('prioridad', priority)
    formData.append('ticket', ticket)
    formData.append('tiempo_estimado', time)
    formData.append('titulo', title)
    formData.append('descripcion', description)
    formData.append('glosa', gloss)
    formData.append('id_actividad', activity.id_det)
    files && formData.append('archivos', files)

    await saveActivity(formData)
  }

  const onClone = async () => {
    const formData = new FormData()
    cloneOptions?.pr && formData.append('proyecto', cloneOptions.pr)
    cloneOptions?.sp && formData.append('sub_proyecto', cloneOptions.sp)
    cloneOptions?.us && formData.append('solicita', cloneOptions.us)
    cloneOptions?.ue && formData.append('encargado', cloneOptions.ue)
    cloneOptions?.ur && formData.append('revisor', cloneOptions.ur)
    formData.append('prioridad', cPriority)
    formData.append('ticket', cTicket)
    formData.append('tiempo_estimado', cTime)
    formData.append('titulo', cTitle)
    formData.append('descripcion', cDescription)
    formData.append('glosa', cGloss)
    cloneFiles && formData.append('archivos', cloneFiles)

    await cloneActivity(formData)
  }

  const timeFormat = (time) => {
    let hours = time._data.hours
    let minutes = time._data.minutes
    let seconds = time._data.seconds
    if (hours < 10) hours = `0${hours}`
    if (minutes < 10) minutes = `0${minutes}`
    if (seconds < 10) seconds = `0${seconds}`

    return `${hours}:${minutes}:${seconds}`
  }

  useEffect(() => {
    if (Object.keys(activity).length > 0) {
      setFields({
        ...fields,
        title: activity.actividad || 'Sin titulo',
        description: activity.func_objeto,
        gloss: activity.glosa,
        ticket: activity.num_ticket_edit,
        priority: activity.prioridad_etiqueta,
        time: activity.tiempo_estimado
      })

      setOptions({
        pr: projects.find(p => p.value === activity.id_proy),
        sp: subProjects.find(s => s.id === activity.id_proy && s.value === activity.id_sub_proyecto),
        us: users.find(u => u.value === activity.user_solicita),
        ue: users.find(u => u.value === activity.encargado_actividad),
      })
    }

    // eslint-disable-next-line
  }, [activity])

  return (
    <>
      {
        Object.keys(activity).length > 0 &&
        <>
          <div className='xl:container  mx-auto px-2 py-10'>
            <main className='bg-white p-5 xl:p-8 rounded-lg shadow-lg shadow-gray-600/10 border grid gap-5'>
              <header className='flex flex-wrap items-center justify-between'>
                <Button
                  type='icon'
                  icon='fas fa-arrow-left fa-lg'
                  className='hover:text-blue-500'
                  onClick={() => navigate('/actividades', { replace: true })}
                />

                <div className='flex gap-1.5 p-1.5 rounded-full bg-black/5'>
                  <span
                    className='h-5 w-5 rounded-full bg-gray-300 transition 
                      duration-200 hover:scale-125 transform cursor-pointer'
                    onClick={() => updatePriority({ prioridad_numero: 1000, id_actividad: activity.id_det })}
                  />
                  <span
                    className='h-5 w-5 rounded-full bg-green-800/70 transition 
                      duration-200 hover:scale-125 transform cursor-pointer'
                    onClick={() => updatePriority({ prioridad_numero: 600, id_actividad: activity.id_det })}
                  />
                  <span
                    className='h-5 w-5 rounded-full bg-yellow-500/80 transition 
                      duration-200 hover:scale-125 transform cursor-pointer'
                    onClick={() => updatePriority({ prioridad_numero: 400, id_actividad: activity.id_det })}
                  />
                  <span
                    className='h-5 w-5 rounded-full bg-red-800/70 transition 
                      duration-200 hover:scale-125 transform cursor-pointer'
                    onClick={() => updatePriority({ prioridad_numero: 100, id_actividad: activity.id_det })}
                  />
                </div>
              </header>

              <h2 className='text-xl text-center font-semibold capitalize truncate'>{activity.actividad}</h2>

              <section className='grid grid-cols-1 lg:grid-cols-8 gap-5 '>
                <aside className='col-span-1 md:col-span-2'>
                  <header className='text-sm'>
                    <p>
                      <span className='font-semibold capitalize mr-1'>
                        Encargado:
                      </span>
                      {activity.encargado_actividad}
                    </p>
                    <p>
                      <span className='font-semibold capitalize mr-1'>
                        Proyecto:
                      </span>
                      {activity.proyecto_tarea.abrev}
                    </p>
                    <p>
                      <span className='font-semibold capitalize mr-1'>
                        Sub proyecto:
                      </span>
                      {activity.subproyectos_tareas ? activity.subproyectos_tareas.nombre_sub_proy : 'S/SP'}
                    </p>
                    <p>
                      <span className='font-semibold capitalize mr-1'>
                        Solicitante:
                      </span>
                      {activity.user_solicita}
                    </p>
                    <p>
                      <span className='font-semibold capitalize'>
                        Estado:
                      </span>
                      {
                        activity.estado === 1 ? ' pendiente' : ' en trabajo'
                      }
                    </p>
                    <p>
                      <span className='font-semibold mr-1'>
                        ID:
                      </span>
                      {activity.id_det}
                    </p>
                    <p>
                      <span className='font-semibold mr-1'>
                        Ticket:
                      </span>
                      {activity.num_ticket_edit}
                    </p>
                    <p>
                      <span className='font-semibold mr-1'>
                        Fecha:
                      </span>
                      {date.format('DD/MM/YYYY')}
                    </p>
                    <p>
                      <span className='font-semibold mr-1'>
                        Transcurridos:
                      </span>
                      {
                        date.diff(today, 'days') - date.diff(today, 'days') * 2
                      }
                    </p>
                    <p className='flex items-center'>
                      <span className='font-semibold mr-1'>
                        Prioridad:
                      </span>
                      {userStyles.priority}
                      <span className={`h-4 w-4 rounded-full mx-1 ${userStyles.styles}`} />
                      ({activity.num_prioridad})
                    </p>
                  </header>
                  <hr className='my-5' />
                  <section className='grid gap-2'>
                    <span className='grid gap-2 capitalize text-sm'>
                      proyecto:
                      <Select
                        className='uppercase'
                        placeholder='Seleccione'
                        options={projects}
                        value={options.pr}
                        onChange={option => setOptions({ ...options, pr: option })}
                      />
                    </span>
                    <span className='grid gap-2 capitalize text-sm'>
                      Sub proyecto:
                      <Select
                        className='uppercase'
                        placeholder='Seleccione'
                        options={subProjects.filter(s => s.id === options.pr?.value)}
                        value={options.sp}
                        onChange={option => setOptions({ ...options, sp: option })}
                      />
                    </span>
                    <span className='grid gap-2 capitalize text-sm'>
                      Solicitante:
                      <Select
                        className='uppercase'
                        placeholder='Seleccione'
                        options={users}
                        value={options.us}
                        onChange={option => setOptions({ ...options, us: option })}
                      />
                    </span>
                    <span className='grid gap-2 capitalize text-sm'>
                      encargado:
                      <Select
                        className='uppercase'
                        placeholder='Seleccione'
                        options={users}
                        value={options.ue}
                        onChange={option => setOptions({ ...options, ue: option })}
                      />
                    </span>
                    <span className='grid gap-2 capitalize text-sm'>
                      revisor:
                      <Select
                        className='uppercase'
                        placeholder='Seleccione'
                        options={users}
                        value={options.ur}
                        onChange={option => setOptions({ ...options, ur: option })}
                      />
                    </span>
                  </section>
                </aside>

                <aside className='col-span-1 md:col-span-3 grid gap-2'>
                  <Input
                    field='titulo'
                    value={title}
                    onChange={e => setFields({ ...fields, title: e.target.value })}
                  />
                  <TextArea
                    field='descripccion'
                    value={description}
                    onChange={e => setFields({ ...fields, description: e.target.value })}
                  />
                  <TextArea
                    field='glosa'
                    value={gloss}
                    onChange={e => setFields({ ...fields, gloss: e.target.value })}
                  />
                  <div className='grid grid-cols-1 lg:grid-cols-3 gap-2'>
                    <Input
                      field='ticket'
                      value={ticket}
                      onChange={e => setFields({ ...fields, ticket: e.target.value })}
                    />
                    <Input
                      field='prioridad'
                      value={priority}
                      onChange={e => setFields({ ...fields, priority: e.target.value })}
                    />
                    <Input
                      field='T. estimado'
                      value={time}
                      onChange={e => setFields({ ...fields, time: e.target.value })}
                    />
                  </div>
                </aside>

                <aside className='col-span-1 md:col-span-3'>
                  <div className='flex justify-between items-center mb-3'>
                    <h5 className='text-sm font-semibold'>Notas (Informes): </h5>
                    <section className='flex gap-2'>
                      <Button
                        className='text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full
                      hover:shadow-lg hover:shadow-slate-300/20 w-max'
                        type='icon'
                        icon='fas fa-plus'
                        onClick={() => toggleModalAdd(true)}
                      />
                      <Button
                        className='text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full
                      hover:shadow-lg hover:shadow-slate-300/20 w-max'
                        type='icon'
                        icon='fas fa-pen'
                        onClick={() => toggleModalEdit(true)}
                      />
                    </section>
                  </div>
                  <ol className='max-h-[540px] overflow-custom'>
                    {
                      activity.notas.length > 0 ?
                        activity.notas.map((note, i) => (
                          <li
                            key={note.id_nota}
                            className='
                          bg-black/5 rounded-lg py-1.5 px-3 mr-1.5 
                          shadow-md shadow-gray-400/20 mb-1.5 hover:bg-black/10 transition duration-200
                      '>
                            <i className='fas fa-list-ul mr-2'></i> {i + 1}. {note.desc_nota}
                          </li>
                        )) : <li className='text-sm text-slate-400 ml-2'>No hay notas...</li>
                    }
                  </ol>
                </aside>
              </section>

              <hr className='my-5' />

              <section className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <aside>
                  <h5 className='text-sm mb-3 font-semibold'>Archivos: </h5>
                  <ul className='h-28 overflow-custom border-x p-1.5'>
                    {
                      activity.tarea_documentos.length > 0 ?
                        activity.tarea_documentos.map((file, i) => (
                          <li
                            key={file.id_docum}
                            className='p-2 bg-white 
                            border-t flex items-center justify-between'>
                            <a
                              className='text-slate-500 hover:text-blue-400 transition 
                                duration-200 transform hover:scale-105 text-sm w-full truncate'
                              href={baseUrl + file.ruta_docum}
                              rel='noreferrer'
                              target='_blank'
                            >
                              {i + 1}. <i className='fas fa-file'></i> {file.nom_docum}
                            </a>
                            <button
                              className='ml-2 text-red-400 hover:text-red-600 transition duration-200 transform hover:hover:scale-125'
                              onClick={() => console.log('delete: id actividad', file.id_det)}
                            >
                              <i className='fas fa-trash fa-sm'></i>
                            </button>
                          </li>
                        )) : <li className='text-sm text-slate-400 ml-2'>No hay archivos...</li>
                    }
                  </ul>
                  <input
                    className='
                  file:rounded-full file:bg-blue-50 file:py-2 file:px-4 file:text-sm
                  file:hover:bg-blue-100 file:text-blue-400 file:border-none
                  file:transition file:duration-500 file:cursor-pointer file:font-semibold
                  file:hover:shadow-lg file:hover:shadow-blue-400/20 text-slate-400 text-sm
                  file:mt-5
                  '
                    type='file'
                    name='file'
                    onChange={e => setFiles(e.target.files[0])}
                  />
                </aside>

                <aside>
                  <h5 className='text-sm mb-5 text-center font-semibold'>Tiempos de la actividad: </h5>
                  <div className='grid grid-cols-3 content-center place-content-center'>
                    <span
                      className='
                    font-semibold rounded-full grid h-24 w-24 border-4 border-emerald-400
                    mx-auto bg-slate-100 hover:bg-emerald-50 transition duration-200 
                    content-center place-content-center capitalize
                  '>
                      {timeFormat(moment.duration(activity.tiempo_estimado, 'hours'))}
                      <span className='text-xs text-slate-500 text-center'>estimado</span>
                    </span>
                    <span
                      className='
                    font-semibold rounded-full grid h-24 w-24 border-4 border-emerald-400
                    mx-auto bg-slate-100 hover:bg-emerald-50 transition duration-200 
                    content-center place-content-center capitalize
                  '>
                      {timeFormat(moment.duration(activity.tiempo_trabajado, 'hours'))}
                      <span className='text-xs text-slate-500 text-center'>trabajado</span>
                    </span>
                    <span
                      className='
                    font-semibold rounded-full grid h-24 w-24 border-4 border-emerald-400
                    mx-auto bg-slate-100 hover:bg-emerald-50 transition duration-200 
                    content-center place-content-center capitalize
                  '>
                      {timeFormat(moment.duration(activity.tiempo_hoy, 'hours'))}
                      <span className='text-xs text-slate-500 text-center'>hoy</span>
                    </span>
                  </div>
                </aside>
              </section>

              <footer className='flex flex-wrap justify-between mt-10'>
                <aside className='flex gap-2'>
                  <Button
                    className='text-red-400 bg-red-50 hover:bg-red-100 rounded-full
                   hover:shadow-lg hover:shadow-red-300/20 w-max'
                    type='icon'
                    icon='fas fa-trash'
                  />
                  <Button
                    className='text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full
                   hover:shadow-lg hover:shadow-slate-300/20 w-max'
                    type='icon'
                    icon='fas fa-clone'
                    onClick={openModalClone}
                  />
                  <Button
                    className={` rounded-full hover:shadow-lg  w-max
                     ${pausaState ? 'text-red-400 bg-red-50 hover:bg-red-100 hover:shadow-red-300/20'
                        : 'text-emerald-400 bg-emerald-50 hover:bg-emerald-100 hover:shadow-emerald-300/20'}
                   `}
                    type='icon'
                    icon={pausaState ? 'fas fa-pause fa-sm' : 'fas fa-play fa-sm'}
                    onClick={handleOnPlayPause}
                  />
                </aside>

                <aside>
                  <Button
                    className='bg-red-400 hover:bg-red-500 text-white hover:shadow-lg hover:shadow-red-400/40 rounded-full mr-2'
                    name='cancelar'
                    icon='fas fa-trash'
                    onClick={() => navigate('/actividades', { replace: true })}
                  />
                  <Button
                    className='bg-emerald-400 hover:bg-emerald-500 text-white hover:shadow-lg hover:shadow-emerald-400/40 rounded-full'
                    name='Guardar cambios'
                    icon='fas fa-trash'
                    onClick={onSave}
                  />
                </aside>
              </footer>
            </main>
          </div>

          {/* modal edit */}
          <Modal showModal={modalEdit} isBlur={false} onClose={onCloseModals}
            className='max-w-2xl' padding='p-5'
          >
            <div className='grid gap-5'>
              <h1 className='text-xl font-semibold capitalize'>Modificar Notas</h1>
              <h5 className='text-sm'>Notas actuales: </h5>
              <ul className='max-h-56 overflow-custom'>
                {
                  activity.notas.length > 0 ?
                    activity.notas.map(note => (
                      <li
                        key={note.id_nota}
                        className={`
                      flex items-center justify-between bg-black/5 rounded-lg py-1.5 px-3 mr-1.5 cursor-pointer
                      shadow-md shadow-gray-400/20 mb-1.5 hover:bg-black/10 transition duration-200
                      ${values.id === note.id_nota && 'border-2 border-blue-400'}
                      `}
                        onClick={() => {
                          setValues({ desc: note.desc_nota, id: note.id_nota })
                        }}
                      >
                        <span>
                          <h1>
                            {note.user_crea_nota.abrev_user}
                            <span className='text-gray-600 text-xs font-light ml-2'>{moment(note.date).format('DD/MM/yyyy, HH:mm')}</span>
                          </h1>
                          <p className='text-gray-600 text-sm'>{note.desc_nota}</p>
                        </span>
                        <button
                          className='ml-2 text-red-400 hover:text-red-600 transition duration-200 transform hover:hover:scale-125'
                          onClick={() => onDelete({ id: note.id_nota, desc: note.desc_nota })}
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
                      className='flex items-center justify-between bg-black/5 rounded-lg py-1.5 px-3 
                        mr-1.5 shadow-md shadow-gray-400/20 mb-1.5 hover:bg-black/10 transition duration-200'
                    >
                      <span>
                        <p className='text-gray-600 text-sm'>{note.desc}</p>
                      </span>
                      <button
                        className='ml-2 text-blue-400 hover:text-blue-600 transition duration-200 transform hover:hover:scale-125'
                        onClick={() => {
                          note.id === 11121 ? updatePriorityAndAddNote({ prioridad_numero: 100, id_actividad: activity.id_det, description: note.desc })
                            : newNote({ id_actividad: activity.id_det, description: note.desc })
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
                Pausar actividad: {activity.actividad}, {activity.id_det}
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
                          onPlayPause({ id_actividad: activity.id_det, mensaje: pause.desc })
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

          {/* modal clone */}
          <Modal showModal={modalClone} isBlur={false} onClose={onCloseModals}
            padding='p-7'
          >
            <div className='grid gap-5'>
              <h1 className='capitalize text-xl font-semibold text-center'>
                Clonar actividad: {activity.id_det}, {activity.actividad}
              </h1>
              <header className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <aside>
                  <span className='grid gap-2 capitalize text-sm'>
                    proyecto:
                    <Select
                      className='uppercase'
                      placeholder='Seleccione'
                      options={projects}
                      value={cloneOptions.pr}
                      onChange={option => setCloneOptions({ ...cloneOptions, pr: option })}
                    />
                  </span>
                  <span className='grid gap-2 capitalize text-sm'>
                    Sub proyecto:
                    <Select
                      className='uppercase'
                      placeholder='Seleccione'
                      options={subProjects.filter(s => s.id === cloneOptions.pr?.value)}
                      value={cloneOptions.sp}
                      onChange={option => setCloneOptions({ ...cloneOptions, sp: option })}
                    />
                  </span>
                  <span className='grid gap-2 capitalize text-sm'>
                    Solicitante:
                    <Select
                      className='uppercase'
                      placeholder='Seleccione'
                      options={users}
                      value={cloneOptions.us}
                      onChange={option => setCloneOptions({ ...cloneOptions, us: option })}
                    />
                  </span>
                  <span className='grid gap-2 capitalize text-sm'>
                    encargado:
                    <Select
                      className='uppercase'
                      placeholder='Seleccione'
                      options={users}
                      value={cloneOptions.ue}
                      onChange={option => setCloneOptions({ ...cloneOptions, ue: option })}
                    />
                  </span>
                  <span className='grid gap-2 capitalize text-sm'>
                    revisor:
                    <Select
                      className='uppercase'
                      placeholder='Seleccione'
                      options={users}
                      value={cloneOptions.ur}
                      onChange={option => setCloneOptions({ ...cloneOptions, ur: option })}
                    />
                  </span>
                </aside>
                <aside className='mt-0.5'>
                  <Input
                    field='titulo'
                    value={cTitle}
                    onChange={e => setCloneFields({ ...cloneFields, cTitle: e.target.value })}
                  />
                  <Input
                    field='ticket'
                    value={cTicket}
                    onChange={e => setCloneFields({ ...cloneFields, cTicket: e.target.value })}
                  />
                  <Input
                    field='prioridad'
                    value={cPriority}
                    onChange={e => setCloneFields({ ...cloneFields, cPriority: e.target.value })}
                  />
                  <Input
                    field='T. estimado'
                    value={cTime}
                    onChange={e => setCloneFields({ ...cloneFields, cTime: e.target.value })}
                  />
                </aside>
              </header>

              <section className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <TextArea
                  field='descripccion'
                  value={cDescription}
                  onChange={e => setCloneFields({ ...cloneFields, cDescription: e.target.value })}
                />
                <TextArea
                  field='glosa'
                  value={cGloss}
                  onChange={e => setCloneFields({ ...cloneFields, cGloss: e.target.value })}
                />
              </section>

              <footer className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-10'>
                <input
                  className='
                  file:rounded-full file:bg-blue-50 file:py-2 file:px-4 file:text-sm
                  file:hover:bg-blue-100 file:text-blue-400 file:border-none
                  file:transition file:duration-500 file:cursor-pointer file:font-semibold
                  file:hover:shadow-lg file:hover:shadow-blue-400/20 text-slate-400 text-sm
                  file:mt-5
                  '
                  type='file'
                  name='cloneFile'
                  onChange={e => setCloneFiles(e.target.files[0])}
                />
                <div className='place-self-end'>
                  <Button
                    className='bg-red-400 hover:bg-red-500 text-white hover:shadow-lg hover:shadow-red-400/40 rounded-full mr-2'
                    name='cancelar'
                    icon='fas fa-trash'
                    onClick={onCloseModals}
                  />
                  <Button
                    className='bg-emerald-400 hover:bg-emerald-500 text-white hover:shadow-lg hover:shadow-emerald-400/40 rounded-full'
                    name='clonar actividad'
                    icon='fas fa-trash'
                    onClick={onClone}
                  />
                </div>
              </footer>
            </div>
          </Modal>

        </>

      }
    </>
  )
}

export default Detail
