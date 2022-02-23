import { useContext, useEffect, useState } from 'react'
import { ActivityContext } from '../context/ActivityContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useDetail } from '../hooks/useDetail'
import { routes } from '../types/types'
import { Alert } from '../helpers/alerts'
import Button from '../components/ui/Button'
import TextArea from '../components/ui/TextArea'
import Input from '../components/ui/Input'
import Select from 'react-select'
import Modal from '../components/ui/Modal'
import Timer from '../components/timer/Timer'
import CustomSelect from '../components/ui/CustomSelect'
import TimerContainer from '../components/timer/TimerContainer'
import P from '../components/ui/P'
import Numerator from '../components/ui/Numerator'
import moment from 'moment'
import AlertBar from '../components/ui/AlertBar'

const TODAY = moment(new Date()).format('yyyy-MM-DD')

const BASE_URL = 'http://www.zcloud.cl/registro_avance/'

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

const initOptions = {
   pr: { label: 'ninguno', value: null },
   sp: { label: 'ninguno', value: null },
   us: { label: 'ninguno', value: null },
   ue: { label: 'ninguno', value: null },
   ur: { label: 'ninguno', value: null },
}

const PrioritySelector = ({
   onClick,
   color = 'bg-slate-400',
   disabled = false,
}) => {
   return (
      <button
         disabled={disabled}
         className={`h-5 w-5 rounded-full ${color} transition duration-200 transform
      ${disabled ? 'hidden' : 'hover:scale-125'}
    `}
         onClick={onClick}></button>
   )
}

const RowContainer = ({ children }) => (
   <section className='grid grid-cols-6 gap-3 items-baseline bg-white rounded-md shadow p-2 pt-0 transition duration-200 transform hover:scale-[0.99]'>
      {children}
   </section>
)

const Detail = () => {
   const navigate = useNavigate()
   const { id } = useParams()
   const { optionsArray } = useContext(ActivityContext)
   const {
      activity,
      detentions,
      newNote,
      updateNote,
      deleteNote,
      updatePriority,
      onPlayPause,
      deleteActivity,
      updatePriorityAndAddNote,
      saveActivity,
      cloneActivity,
      deleteDocument,
      toggleState,
   } = useDetail(id)

   const date = moment(activity.fecha_tx).format('yyyy-MM-DD')

   // modals
   const [modalEdit, toggleModalEdit] = useState(false)
   const [modalAdd, toggleModalAdd] = useState(false)
   const [modalClone, toggleModalClone] = useState(false)
   const [modalPause, toggleModalPause] = useState(false)
   const [modalTimer, toggleModalTimer] = useState(false)
   const [modalPR, toggleModalPR] = useState(false)

   // options
   const [options, setOptions] = useState(initOptions)
   const [cloneOptions, setCloneOptions] = useState(initOptions)

   // files
   const [files, setFiles] = useState(null)
   const [cloneFiles, setCloneFiles] = useState(null)
   const [cleanFile, onCleanFile] = useState(Math.random().toString(36))

   // inputs values
   const [values, setValues] = useState({
      id: null,
      desc: '',
      content: '',
   })
   const [fields, setFields] = useState({
      title: '',
      description: '',
      priority: '',
      ticket: '',
      time: '',
      gloss: '',
   })

   const [cloneFields, setCloneFields] = useState({
      cTitle: '',
      cDescription: '',
      cPriority: '',
      cTicket: '',
      cTime: '',
      cGloss: '',
   })

   // destructuring
   const { title, description, gloss, ticket, priority, time } = fields
   const { cTitle, cDescription, cPriority, cTicket, cTime, cGloss } =
      cloneFields
   const { projects, subProjects, users } = optionsArray

   const validation = () => {
      const vTitle = title.trim() === ''
      const vDesc = description.trim() === ''
      const vPriority = priority.toString().trim() === ''
      const vTime = time.toString().trim() === ''
      const vProject = options.pr?.value === null
      const vSolicita = options.us?.value === null
      const vEncargado = options.ue?.value === null

      const onSaveValidation =
         vTitle ||
         vDesc ||
         vPriority ||
         vTime ||
         vProject ||
         vSolicita ||
         vEncargado

      const vTitleC = cTitle.trim() === ''
      const vDescC = cDescription.trim() === ''
      const vPriorityC = cPriority.toString().trim() === ''
      const vTimeC = cTime.toString().trim() === ''
      const vProjectC = cloneOptions.pr?.value === null
      const vSolicitaC = cloneOptions.us?.value === null
      const vEncargadoC = cloneOptions.ue?.value === null

      const onCloneValidation =
         vTitleC ||
         vDescC ||
         vPriorityC ||
         vTimeC ||
         vProjectC ||
         vSolicitaC ||
         vEncargadoC

      return {
         isSave: onSaveValidation,
         isClone: onCloneValidation,
      }
   }

   let userStyles = {
      priority: 'S/P',
      styles: 'bg-slate-400 hover:border-gray-400',
   }

   switch (activity.prioridad_etiqueta) {
      case 600:
         userStyles = {
            priority: 'Baja',
            styles: 'text-white bg-green-500/70',
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
            styles: 'text-white bg-red-500/70',
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
      toggleModalTimer(false)
      toggleModalPR(false)
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
            cGloss: gloss,
         })

         setCloneOptions({
            pr: projects.find(p => p.value === activity.id_proy),
            sp: subProjects.find(
               s =>
                  s.id === activity.id_proy &&
                  s.value === activity.id_sub_proyecto
            ),
            us: users.find(u => u.value === activity.user_solicita),
            ue: users.find(u => u.value === activity.encargado_actividad),
            ur: users?.find(u => u.id === activity.id_revisor),
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
         },
      })
   }

   const handleOnPlayPause = () => {
      if (activity.estado_play_pausa === 2) {
         toggleModalPause(true)
         setValues({
            ...values,
            id_ref: activity.id_det,
            title: activity.actividad || 'Sin titulo',
            content: activity.func_objeto || 'Sin descripcion',
         })
      } else {
         onPlayPause({ id_actividad: activity.id_det })
      }
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
            setValues({ ...values, desc: '', id: null })
         },
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
      updateNote({
         id_nota: values.id,
         description: values.desc,
         id_actividad: activity.id_det,
      })
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
      options?.pr && formData.append('proyecto', options.pr.value)
      options?.sp && formData.append('sub_proyecto', options.sp.value)
      options?.us && formData.append('solicita', options.us.label)
      options?.ue && formData.append('encargado', options.ue.label)
      options?.ur && formData.append('revisor', options.ur.id)
      formData.append('prioridad', priority)
      formData.append('ticket', ticket)
      formData.append('tiempo_estimado', time)
      formData.append('titulo', title)
      formData.append('descripcion', description)
      formData.append('glosa', gloss)
      formData.append('id_actividad', activity.id_det)
      files && formData.append('archivos', files)

      await saveActivity(formData)

      setFiles(null)
      onCleanFile(Math.random().toString(36))
   }

   const onClone = async () => {
      const formData = new FormData()
      cloneOptions?.pr && formData.append('proyecto', cloneOptions.pr.value)
      cloneOptions?.sp && formData.append('sub_proyecto', cloneOptions.sp.value)
      cloneOptions?.us && formData.append('solicita', cloneOptions.us.label)
      cloneOptions?.ue && formData.append('encargado', cloneOptions.ue.label)
      cloneOptions?.ur && formData.append('revisor', cloneOptions.ur.id)
      formData.append('prioridad', cPriority)
      formData.append('ticket', cTicket)
      formData.append('tiempo_estimado', cTime)
      formData.append('titulo', cTitle)
      formData.append('descripcion', cDescription)
      formData.append('glosa', cGloss)
      cloneFiles && formData.append('archivos', cloneFiles)

      const ok = await cloneActivity(formData)
      if (!ok) return
      onCloseModals()
      navigate(routes.activity)
      setCloneFiles(null)
      onCleanFile(Math.random().toString(36))
   }

   const timeFormat = time => {
      let hours = time._data.hours
      let minutes = time._data.minutes
      let seconds = time._data.seconds
      if (hours < 10) hours = '0' + hours
      if (minutes < 10) minutes = '0' + minutes
      if (seconds < 10) seconds = '0' + seconds

      return {
         complete: hours + ':' + minutes + ':' + seconds,
         section: {
            hours: time._data.hours,
            minutes: time._data.minutes,
            seconds: time._data.seconds,
         },
      }
   }

   const handleUpdateState = () => {
      Alert({
         icon: 'warn',
         title: 'Atención',
         content:
            '¿Estas seguro de cambiar el estado a: <strong>PARA REVISIÓN</strong>?',
         confirmButton: 'Si, actualizar',
         cancelButton: 'No, cancelar',
         action: () => {
            navigate(routes.activity, { replace: true })
            toggleState({})
         },
      })
   }

   useEffect(() => {
      if (Object.keys(activity).length > 0) {
         setFields({
            ...fields,
            title: activity.actividad || 'Sin titulo',
            description: activity.func_objeto,
            gloss: activity.glosa_explicativa,
            ticket: activity.num_ticket_edit,
            priority: activity.num_prioridad,
            time: activity.tiempo_estimado,
         })

         setOptions({
            pr: projects?.find(p => p.value === activity.id_proy),
            sp: subProjects?.find(
               s =>
                  s.id === activity.id_proy &&
                  s.value === activity.id_sub_proyecto
            ),
            us: users?.find(u => u.label === activity.user_solicita),
            ue: users?.find(u => u.label === activity.encargado_actividad),
            ur: users?.find(u => u.id === activity.id_revisor),
         })
      }

      return () => null

      // eslint-disable-next-line
   }, [optionsArray, activity])

   return (
      <>
         {Object.keys(activity).length > 0 && (
            <>
               <main className='xl:container  mx-auto px-2 py-10'>
                  <div className='bg-white p-4 md:p-6 rounded-lg shadow-lg shadow-gray-600/10 border grid gap-5'>
                     <header className='flex flex-wrap items-center justify-between'>
                        <Button
                           type='icon'
                           icon='fas fa-arrow-left fa-lg'
                           className='hover:text-blue-500'
                           onClick={() =>
                              navigate('/actividades', { replace: true })
                           }
                        />

                        <div className='flex gap-1.5 p-1.5 rounded-full bg-black/10'>
                           <PrioritySelector
                              disabled={activity.prioridad_etiqueta === 1000}
                              onClick={() =>
                                 updatePriority({
                                    prioridad_numero: 1000,
                                    id_actividad: activity.id_det,
                                 })
                              }
                           />
                           <PrioritySelector
                              disabled={activity.prioridad_etiqueta === 600}
                              color='bg-green-500/70'
                              onClick={() =>
                                 updatePriority({
                                    prioridad_numero: 600,
                                    id_actividad: activity.id_det,
                                 })
                              }
                           />
                           <PrioritySelector
                              disabled={activity.prioridad_etiqueta === 400}
                              color='bg-yellow-500/80'
                              onClick={() =>
                                 updatePriority({
                                    prioridad_numero: 400,
                                    id_actividad: activity.id_det,
                                 })
                              }
                           />
                           <PrioritySelector
                              disabled={activity.prioridad_etiqueta === 100}
                              color='bg-red-500/70'
                              onClick={() =>
                                 updatePriority({
                                    prioridad_numero: 100,
                                    id_actividad: activity.id_det,
                                 })
                              }
                           />
                        </div>
                     </header>

                     <h1 className='text-xl text-center font-semibold capitalize truncate'>
                        {activity.actividad || 'Sin titulo'}
                     </h1>

                     <AlertBar validation={validation().isSave} />

                     <section className='grid grid-cols-1 lg:grid-cols-8 gap-5 '>
                        <aside className='col-span-1 md:col-span-2'>
                           <header className='text-sm'>
                              <P
                                 tag='Encargado'
                                 value={activity.encargado_actividad}
                              />
                              <P
                                 tag='Proyecto'
                                 value={activity.nombre_proyecto}
                              />
                              <P
                                 tag='Sub proyecto'
                                 value={activity.nombre_sub_proy ?? 'S/SP'}
                              />
                              <P
                                 tag='Solicitante'
                                 value={activity.user_solicita}
                              />
                              <P
                                 tag='Estado'
                                 value={
                                    activity.estado === 1
                                       ? ' pendiente'
                                       : ' en trabajo'
                                 }
                              />
                              <P tag='ID' value={activity.id_det} />
                              <P
                                 tag='Ticket'
                                 value={activity.num_ticket_edit}
                              />
                              <P
                                 tag='Fecha'
                                 value={moment(activity.fecha_tx).format(
                                    'DD/MM/YYYY'
                                 )}
                              />
                              <P
                                 tag='Transcurridos'
                                 value={
                                    moment(date).diff(TODAY, 'days') -
                                    moment(date).diff(TODAY, 'days') * 2
                                 }
                              />
                              <P
                                 tag='Prioridad'
                                 value={
                                    <>
                                       <span
                                          className={`h-4 w-4 rounded-full mx-1 inline-block align-middle ${userStyles.styles}`}
                                       />
                                       {userStyles.priority} (
                                       {activity.num_prioridad})
                                    </>
                                 }
                              />
                           </header>

                           <hr className='my-5' />

                           <section className='grid gap-2'>
                              <CustomSelect
                                 label='Proyecto (*)'
                                 options={projects}
                                 value={options.pr}
                                 onChange={option =>
                                    setOptions({ ...options, pr: option })
                                 }
                              />
                              <CustomSelect
                                 label='Sub proyecto'
                                 options={
                                    options?.pr?.value
                                       ? subProjects?.filter(
                                            s => s.id === options?.pr?.value
                                         )
                                       : subProjects
                                 }
                                 value={options.sp}
                                 onChange={option =>
                                    setOptions({ ...options, sp: option })
                                 }
                              />
                              <CustomSelect
                                 label='Solicitante (*)'
                                 options={users}
                                 value={options.us}
                                 onChange={option =>
                                    setOptions({ ...options, us: option })
                                 }
                              />
                              <CustomSelect
                                 label='Encargado (*)'
                                 options={users}
                                 value={options.ue}
                                 onChange={option =>
                                    setOptions({ ...options, ue: option })
                                 }
                              />
                              <CustomSelect
                                 label='Revisor'
                                 options={users}
                                 value={options.ur}
                                 onChange={option =>
                                    setOptions({ ...options, ur: option })
                                 }
                              />
                           </section>
                        </aside>

                        <section className='col-span-1 md:col-span-3 grid gap-2'>
                           <Input
                              field='titulo (*)'
                              value={title}
                              onChange={e =>
                                 setFields({ ...fields, title: e.target.value })
                              }
                           />
                           <TextArea
                              field='descripccion (*)'
                              value={description}
                              onChange={e =>
                                 setFields({
                                    ...fields,
                                    description: e.target.value,
                                 })
                              }
                           />
                           <TextArea
                              field='glosa'
                              value={gloss}
                              onChange={e =>
                                 setFields({ ...fields, gloss: e.target.value })
                              }
                           />
                           <div className='grid grid-cols-1 lg:grid-cols-3 gap-2'>
                              <Input
                                 field='ticket'
                                 value={ticket}
                                 isNumber
                                 onChange={e =>
                                    setFields({
                                       ...fields,
                                       ticket: e.target.value,
                                    })
                                 }
                              />
                              <Input
                                 field='prioridad (*)'
                                 value={priority}
                                 isNumber
                                 onChange={e =>
                                    setFields({
                                       ...fields,
                                       priority: e.target.value,
                                    })
                                 }
                              />
                              <Input
                                 field='T. estimado (*)'
                                 value={time}
                                 onChange={e =>
                                    setFields({
                                       ...fields,
                                       time: e.target.value,
                                    })
                                 }
                              />
                           </div>
                        </section>

                        <aside className='col-span-1 md:col-span-3'>
                           <div className='flex justify-between items-center mb-3'>
                              <h5 className='text-sm font-semibold'>
                                 Notas (Informes):{' '}
                              </h5>
                              <section className='flex gap-2'>
                                 <Button
                                    className='text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg w-max'
                                    type='icon'
                                    icon='fas fa-plus'
                                    onClick={() => toggleModalAdd(true)}
                                 />
                                 <Button
                                    disabled={activity.notas.length === 0}
                                    className='text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg w-max'
                                    type='icon'
                                    icon='fas fa-pen'
                                    onClick={() => toggleModalEdit(true)}
                                 />
                              </section>
                           </div>
                           <ul className='max-h-[540px] overflow-custom'>
                              {activity.notas.length > 0 ? (
                                 activity.notas.map((note, i) => (
                                    <li
                                       key={note.id_nota}
                                       className='bg-black/5 rounded-lg py-1.5 px-3 mr-1.5 mb-2.5 shadow-md shadow-gray-400/20 hover:bg-black/10 transition duration-200'>
                                       <i className='fas fa-list-ul mr-2' />
                                       {i + 1}. {note.desc_nota}
                                    </li>
                                 ))
                              ) : (
                                 <li className='text-sm text-slate-400 ml-2'>
                                    No hay notas...
                                 </li>
                              )}
                           </ul>
                        </aside>
                     </section>

                     <hr className='my-5' />

                     <section className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <aside>
                           <h5 className='text-sm mb-3 font-semibold'>
                              Archivos:{' '}
                           </h5>
                           <ul className='h-28 overflow-custom border-x p-1.5'>
                              {activity.tarea_documentos.length > 0 ? (
                                 activity.tarea_documentos.map((file, i) => (
                                    <li
                                       key={file.id_docum}
                                       className='p-2 bg-white 
                                          border-t flex items-center justify-between'>
                                       <a
                                          className='text-slate-500 hover:text-blue-400 transition 
                                             duration-200 transform hover:scale-105 text-sm w-full truncate'
                                          href={BASE_URL + file.ruta_docum}
                                          rel='noreferrer'
                                          target='_blank'>
                                          {i + 1}.{' '}
                                          <i className='fas fa-file'></i>{' '}
                                          {file.nom_docum}
                                       </a>
                                       <button
                                          className='ml-2 text-red-400 hover:text-red-600 transition duration-200 transform hover:hover:scale-125'
                                          onClick={() =>
                                             deleteDocument({
                                                id_docum: file.id_docum,
                                                doc_name: file.nom_docum,
                                             })
                                          }>
                                          <i className='fas fa-trash fa-sm'></i>
                                       </button>
                                    </li>
                                 ))
                              ) : (
                                 <li className='text-sm text-slate-400 ml-2'>
                                    No hay archivos...
                                 </li>
                              )}
                           </ul>
                           <input
                              key={cleanFile}
                              className='
                                 file:rounded-full file:bg-blue-50 file:py-2 file:px-4 file:text-sm
                                 file:hover:bg-blue-100 file:text-blue-400 file:border-none
                                 file:transition file:duration-500 file:cursor-pointer file:font-semibold
                                 file:hover:shadow-lg file:hover:shadow-blue-400/20 text-slate-400 text-sm
                                 file:mt-5 max-w-max'
                              type='file'
                              name='file'
                              onChange={e => setFiles(e.target.files[0])}
                           />
                        </aside>

                        <aside>
                           <h5 className='text-sm mb-5 text-center font-semibold'>
                              Tiempos de la actividad:{' '}
                           </h5>
                           <div className='grid grid-cols-3 content-center place-content-center'>
                              <TimerContainer subtitle='estimado'>
                                 {
                                    timeFormat(
                                       moment.duration(
                                          activity.tiempo_estimado,
                                          'hours'
                                       )
                                    ).complete
                                 }
                              </TimerContainer>
                              <TimerContainer
                                 subtitle='trabajado'
                                 color='orange'>
                                 <Timer
                                    pause={activity.estado_play_pausa === 2}
                                    time={
                                       timeFormat(
                                          moment.duration(
                                             activity.tiempo_trabajado,
                                             'hours'
                                          )
                                       ).section
                                    }
                                 />
                              </TimerContainer>
                              <TimerContainer
                                 subtitle='hoy'
                                 color={
                                    activity.estado_play_pausa === 2
                                       ? 'red'
                                       : 'green'
                                 }>
                                 <Timer
                                    pause={activity.estado_play_pausa === 2}
                                    time={
                                       timeFormat(
                                          moment.duration(
                                             activity.tiempo_hoy,
                                             'hours'
                                          )
                                       ).section
                                    }
                                 />
                              </TimerContainer>
                           </div>
                           <div className='flex justify-center mt-5 '>
                              <Button
                                 className='bg-orange-50 hover:bg-orange-100 text-orange-500 rounded-full'
                                 iconFirst
                                 type='iconText'
                                 icon='far fa-clock'
                                 name='Modificar tiempos'
                                 onClick={() => toggleModalTimer(true)}
                              />
                           </div>
                        </aside>
                     </section>

                     <footer className='grid grid-cols-2 gap-2 justify-between mt-5'>
                        <section className='flex gap-2'>
                           <Button
                              className='text-red-400 bg-red-50 hover:bg-red-100 rounded-lg w-max'
                              type='icon'
                              icon='fas fa-trash'
                              onClick={() =>
                                 deleteActivity({
                                    id_actividad: activity.id_det,
                                 })
                              }
                           />
                           <Button
                              className='text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg w-max'
                              type='icon'
                              icon='fas fa-clone'
                              onClick={openModalClone}
                           />
                           {activity.num_ticket_edit !== 0 && (
                              <a
                                 className='text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-lg h-8 w-8 text-center block pt-1 transition duration-500'
                                 target='_blank'
                                 rel='noreferrer'
                                 title='Eventos'
                                 href={`https://tickets.zproduccion.cl/#/in/${activity.num_ticket_edit}`}>
                                 <i className='fas fa-ticket-alt' />
                              </a>
                           )}
                           <Button
                              hidden={activity.estado === 1}
                              className={`
                                 ${
                                    activity.estado_play_pausa === 2
                                       ? 'text-red-400 bg-red-50 hover:bg-red-100'
                                       : 'text-emerald-400 bg-emerald-50 hover:bg-emerald-100'
                                 }
                                 rounded-lg w-max`}
                              type='icon'
                              icon={
                                 activity.estado_play_pausa === 2
                                    ? 'fas fa-pause fa-sm'
                                    : 'fas fa-play fa-sm'
                              }
                              onClick={handleOnPlayPause}
                           />
                           <Button
                              hidden={activity.estado !== 2}
                              title='Pasar actividad a revisión'
                              type='icon'
                              icon='fas fa-eye'
                              className='text-orange-400 bg-orange-50 hover:bg-orange-100 rounded-lg w-max'
                              onClick={() => toggleModalPR(true)}
                           />
                        </section>

                        <section className='flex justify-end'>
                           <Button
                              className='w-max text-red-500 hover:bg-red-100 rounded-full'
                              name='cancelar'
                              onClick={() =>
                                 navigate(routes.activity, { replace: true })
                              }
                           />
                           <Button
                              disabled={validation().isSave}
                              className='w-max text-emerald-500 hover:bg-emerald-100 rounded-full place-self-end'
                              name='Guardar cambios'
                              onClick={onSave}
                           />
                        </section>
                     </footer>
                  </div>
               </main>

               {/* modal PR */}
               <Modal
                  showModal={modalPR}
                  isBlur={false}
                  onClose={onCloseModals}
                  className='max-w-xl'
                  padding='p-4 md:p-6'
                  title='Mensaje opcional para Cliente'>
                  <TextArea field='mensaje' />
                  <div className='flex justify-between mt-5'>
                     <Button
                        className='text-red-500 hover:bg-red-100 rounded-full'
                        name='cancelar'
                        onClick={onCloseModals}
                     />
                     <Button
                        className='text-emerald-500 hover:bg-emerald-100 rounded-full'
                        name='aceptar'
                        onClick={handleUpdateState}
                     />
                  </div>
               </Modal>

               {/* modal timer */}
               <Modal
                  showModal={modalTimer}
                  isBlur={false}
                  onClose={onCloseModals}
                  className='max-w-7xl'
                  padding='p-4 md:p-6'
                  title='Modificar tiempos de actividad'>
                  <main className='grid gap-1 bg-zinc-100 rounded-md p-2 mt-10 shadow w-[1216px] overflow-auto'>
                     <header className='grid grid-cols-3 gap-1 text-center capitalize font-semibold border-b'>
                        <span className='py-1.5 border-r'>desde</span>
                        <span className='py-1.5 border-r'>hasta</span>
                        <span className='py-1.5'>control</span>
                     </header>
                     <section className='grid grid-cols-6 gap-1 text-center capitalize font-semibold'>
                        <div className='flex gap-4 py-1.5 border-r'>
                           <span className='ml-2'>Nº</span>{' '}
                           <span className='text-center w-full mr-3'>
                              fecha
                           </span>
                        </div>
                        <span className='py-1.5 border-r'>hora</span>
                        <span className='py-1.5 border-r'>fecha</span>
                        <span className='py-1.5 border-r'>hora</span>
                        <span className='py-1.5'>tiempo</span>
                        <span />
                     </section>
                     <RowContainer>
                        <div className='grid grid-cols-4 items-baseline gap-2'>
                           <span className='col-span-1' />
                           <Input className='col-span-3' type='date' />
                        </div>
                        <Input />
                        <Input type='date' />
                        <Input />
                        <span className='text-center'>6.3</span>
                        <div className='flex justify-center gap-2 border-l'>
                           <Button
                              className='rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-500'
                              name='agregar'
                           />
                        </div>
                     </RowContainer>
                     <div className='max-h-72 overflow-custom grid gap-1'>
                        {detentions.length > 0 &&
                           detentions.map((item, i) => (
                              <RowContainer key={item.id_pausa}>
                                 <div className='grid grid-cols-4 items-baseline gap-2'>
                                    <Numerator
                                       className='col-span-1 max-w-max'
                                       number={i + 1}
                                    />
                                    <Input className='col-span-3' type='date' />
                                 </div>
                                 <Input />
                                 <Input type='date' />
                                 <Input />
                                 <span className='text-center'>6.3</span>
                                 <div className='flex justify-center gap-2 border-l'>
                                    <Button
                                       type='icon'
                                       className='bg-emerald-100 hover:bg-emerald-200 text-emerald-500 rounded-md'
                                       icon='fas fa-check'
                                    />
                                    <Button
                                       type='icon'
                                       className='bg-red-100 hover:bg-red-200 text-red-500 rounded-md'
                                       icon='fas fa-trash'
                                    />
                                 </div>
                              </RowContainer>
                           ))}
                     </div>
                  </main>
               </Modal>

               {/* modal edit */}
               <Modal
                  showModal={modalEdit}
                  isBlur={false}
                  onClose={onCloseModals}
                  className='max-w-2xl'
                  padding='p-4 md:p-6'
                  title='Modificar Notas'>
                  <div className='grid gap-5'>
                     <h5 className='text-sm'>Notas actuales: </h5>
                     <ul className='max-h-56 overflow-custom'>
                        {activity.notas.length > 0 ? (
                           activity.notas.map(note => (
                              <li
                                 key={note.id_nota}
                                 className={`flex items-center justify-between bg-black/5 rounded-lg py-1.5 px-3 mr-1.5 cursor-pointer shadow-md shadow-gray-400/20 mb-1.5 hover:bg-black/10 transition duration-200 ${
                                    values.id === note.id_nota &&
                                    'border-2 border-blue-400'
                                 }`}
                                 onClick={() => {
                                    setValues({
                                       desc: note.desc_nota,
                                       id: note.id_nota,
                                    })
                                 }}>
                                 <span>
                                    <h1>
                                       {note.usuario.abrev_user}
                                       <span className='text-gray-600 text-xs font-light ml-2'>
                                          {moment(note.date).format(
                                             'DD/MM/yyyy, HH:mm'
                                          )}
                                       </span>
                                    </h1>
                                    <p className='text-gray-600 text-sm'>
                                       {note.desc_nota}
                                    </p>
                                 </span>
                                 <button
                                    className='ml-2 text-red-400 hover:text-red-600 transition duration-200 transform hover:hover:scale-125'
                                    onClick={() =>
                                       onDelete({
                                          id: note.id_nota,
                                          desc: note.desc_nota,
                                       })
                                    }>
                                    <i className='fas fa-trash fa-sm' />
                                 </button>
                              </li>
                           ))
                        ) : (
                           <li className='text-gray-500 text-sm ml-2'>
                              No hay notas...
                           </li>
                        )}
                     </ul>
                     <TextArea
                        disabled={values.id === null}
                        placeholder='Selecciona una nota para editar...'
                        field='descripcion'
                        value={values.desc}
                        onChange={e =>
                           setValues({ ...values, desc: e.target.value })
                        }
                     />
                     <Button
                        className='w-max text-blue-500 hover:bg-blue-100 rounded-full place-self-end'
                        name='modificar nota'
                        onClick={onUpdate}
                     />
                  </div>
               </Modal>

               {/* modal add */}
               <Modal
                  showModal={modalAdd}
                  isBlur={false}
                  onClose={onCloseModals}
                  className='max-w-2xl'
                  padding='p-4 md:p-6'
                  title='crear Notas'>
                  <div className='grid gap-5'>
                     <h5 className='text-sm'>Notas rapidas: </h5>
                     <ul className='max-h-56 overflow-custom'>
                        {defaultNotes.map(note => (
                           <li
                              key={note.id}
                              className='flex items-center justify-between bg-black/5 rounded-lg py-1.5 px-3 
                        mr-1.5 shadow-md shadow-gray-400/20 mb-1.5 hover:bg-black/10 transition duration-200'>
                              <span>
                                 <p className='text-gray-600 text-sm'>
                                    {note.desc}
                                 </p>
                              </span>
                              <button
                                 className='ml-2 text-blue-400 hover:text-blue-600 transition duration-200 transform hover:hover:scale-125'
                                 onClick={() => {
                                    note.id === 11121
                                       ? updatePriorityAndAddNote({
                                            prioridad_numero: 100,
                                            id_actividad: activity.id_det,
                                            description: note.desc,
                                         })
                                       : newNote({
                                            id_actividad: activity.id_det,
                                            description: note.desc,
                                         })
                                    onCloseModals()
                                 }}>
                                 <i className='fas fa-tag fa-sm'></i>
                              </button>
                           </li>
                        ))}
                     </ul>
                     <TextArea
                        field='descripcion'
                        value={values.desc}
                        onChange={e =>
                           setValues({ ...values, desc: e.target.value })
                        }
                     />
                     <Button
                        className='w-max text-blue-500 hover:bg-blue-100 rounded-full place-self-end'
                        name='crear nota'
                        onClick={onAdd}
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
                  title={`Pausar actividad: ${activity.actividad}, ${activity.id_det}`}>
                  <div className='grid gap-5'>
                     <h5 className='text-sm'>Descripcion actividad: </h5>
                     <p className='text-sm whitespace-pre-wrap max-h-44 overflow-custom p-1.5 rounded-lg bg-black/5'>
                        {values.content}
                     </p>
                     <h5 className='text-sm'>Pausas rapidas: </h5>
                     <ul className='max-h-56 overflow-custom'>
                        {defaultPauses.map(pause => (
                           <li
                              key={pause.id}
                              className='flex items-center justify-between bg-black/5 rounded-lg py-1.5 px-3 mr-1.5 shadow-md shadow-gray-400/20 mb-1.5 hover:bg-black/10 transition duration-200'>
                              <p className='text-gray-600 text-sm'>
                                 {pause.desc}
                              </p>
                              <button
                                 className='ml-2 text-red-400 hover:text-red-600 transition duration-200 transform hover:hover:scale-125'
                                 onClick={() => {
                                    onPlayPause({
                                       id_actividad: activity.id_det,
                                       mensaje: pause.desc,
                                    })
                                    onCloseModals()
                                 }}>
                                 <i className='fas fa-pause fa-sm' />
                              </button>
                           </li>
                        ))}
                     </ul>
                     <TextArea
                        field='Mensaje pausa'
                        value={values.desc}
                        onChange={e =>
                           setValues({ ...values, desc: e.target.value })
                        }
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
                           onClick={onPause}
                        />
                     </footer>
                  </div>
               </Modal>

               {/* modal clone */}
               <Modal
                  showModal={modalClone}
                  isBlur={false}
                  onClose={onCloseModals}
                  padding='p-4 md:p-6'
                  title={`Clonar actividad: ${activity.id_det}, ${
                     activity.actividad || 'Sin titulo'
                  }`}>
                  <AlertBar validation={validation().isClone} />
                  <div className='grid gap-5'>
                     <header className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <aside>
                           <span className='grid gap-2 capitalize text-sm'>
                              proyecto (*):
                              <Select
                                 className='uppercase'
                                 placeholder='Seleccione'
                                 options={projects}
                                 value={cloneOptions.pr}
                                 onChange={option =>
                                    setCloneOptions({
                                       ...cloneOptions,
                                       pr: option,
                                    })
                                 }
                              />
                           </span>
                           <span className='grid gap-2 capitalize text-sm'>
                              Sub proyecto:
                              <Select
                                 className='uppercase'
                                 placeholder='Seleccione'
                                 options={
                                    options.pr?.value
                                       ? subProjects?.filter(
                                            s => s.id === options.pr?.value
                                         )
                                       : subProjects
                                 }
                                 value={cloneOptions.sp}
                                 onChange={option =>
                                    setCloneOptions({
                                       ...cloneOptions,
                                       sp: option,
                                    })
                                 }
                              />
                           </span>
                           <span className='grid gap-2 capitalize text-sm'>
                              Solicitante (*):
                              <Select
                                 className='uppercase'
                                 placeholder='Seleccione'
                                 options={users}
                                 value={cloneOptions.us}
                                 onChange={option =>
                                    setCloneOptions({
                                       ...cloneOptions,
                                       us: option,
                                    })
                                 }
                              />
                           </span>
                           <span className='grid gap-2 capitalize text-sm'>
                              encargado (*):
                              <Select
                                 className='uppercase'
                                 placeholder='Seleccione'
                                 options={users}
                                 value={cloneOptions.ue}
                                 onChange={option =>
                                    setCloneOptions({
                                       ...cloneOptions,
                                       ue: option,
                                    })
                                 }
                              />
                           </span>
                           <span className='grid gap-2 capitalize text-sm'>
                              revisor:
                              <Select
                                 className='uppercase'
                                 placeholder='Seleccione'
                                 options={users}
                                 value={cloneOptions.ur}
                                 onChange={option =>
                                    setCloneOptions({
                                       ...cloneOptions,
                                       ur: option,
                                    })
                                 }
                              />
                           </span>
                        </aside>

                        <aside className='mt-0.5'>
                           <Input
                              field='titulo (*)'
                              value={cTitle}
                              onChange={e =>
                                 setCloneFields({
                                    ...cloneFields,
                                    cTitle: e.target.value,
                                 })
                              }
                           />
                           <Input
                              field='ticket'
                              isNumber
                              value={cTicket}
                              onChange={e =>
                                 setCloneFields({
                                    ...cloneFields,
                                    cTicket: e.target.value,
                                 })
                              }
                           />
                           <Input
                              field='prioridad (*)'
                              isNumber
                              value={cPriority}
                              onChange={e =>
                                 setCloneFields({
                                    ...cloneFields,
                                    cPriority: e.target.value,
                                 })
                              }
                           />
                           <Input
                              field='T. estimado (*)'
                              value={cTime}
                              onChange={e =>
                                 setCloneFields({
                                    ...cloneFields,
                                    cTime: e.target.value,
                                 })
                              }
                           />
                        </aside>
                     </header>

                     <section className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <TextArea
                           field='descripccion (*)'
                           value={cDescription}
                           onChange={e =>
                              setCloneFields({
                                 ...cloneFields,
                                 cDescription: e.target.value,
                              })
                           }
                        />
                        <TextArea
                           field='glosa'
                           value={cGloss}
                           onChange={e =>
                              setCloneFields({
                                 ...cloneFields,
                                 cGloss: e.target.value,
                              })
                           }
                        />
                     </section>

                     <footer className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-10'>
                        <input
                           key={cleanFile}
                           className='
                              file:rounded-full file:bg-blue-50 file:py-2 file:px-4 file:text-sm
                              file:hover:bg-blue-100 file:text-blue-400 file:border-none
                              file:transition file:duration-500 file:cursor-pointer file:font-semibold
                              file:hover:shadow-lg file:hover:shadow-blue-400/20 text-slate-400 text-sm
                              file:mt-5 max-w-max'
                           type='file'
                           name='cloneFile'
                           onChange={e => setCloneFiles(e.target.files[0])}
                        />
                        <div className='place-self-end'>
                           <Button
                              className='w-max text-red-500 hover:bg-red-100 rounded-full'
                              name='cancelar'
                              icon='fas fa-trash'
                              onClick={onCloseModals}
                           />
                           <Button
                              disabled={validation().isClone}
                              className='w-max text-yellow-500 hover:bg-yellow-100 rounded-full place-self-end'
                              name='clonar actividad'
                              icon='fas fa-trash'
                              onClick={onClone}
                           />
                        </div>
                     </footer>
                  </div>
               </Modal>
            </>
         )}
      </>
   )
}

export default Detail
