import { useContext, useEffect, useState } from 'react'
import { ActivityContext } from '../context/ActivityContext'
import { useNavigate, useParams } from 'react-router-dom'
import { validateDate } from '../helpers/helpersFunc'
import { useDetail } from '../hooks/useDetail'
import { useForm } from '../hooks/useForm'
import { routes } from '../types/types'
import { Alert } from '../helpers/alerts'
import Button from '../components/ui/Button'
import TextArea from '../components/ui/TextArea'
import Input from '../components/ui/Input'
import Select from 'react-select'
import Modal from '../components/ui/Modal'
import Timer from '../components/timer/Timer'
import TimerContainer from '../components/timer/TimerContainer'
import P from '../components/ui/P'
import Numerator from '../components/ui/Numerator'
import AlertBar from '../components/ui/AlertBar'
import InputMask from 'react-input-mask'
import moment from 'moment'
import ViewContainer from '../components/view/ViewContainer'
import View from '../components/view/View'
import ViewSection from '../components/view/ViewSection'
import ViewFooter from '../components/view/ViewFooter'
import NumberFormat from 'react-number-format'

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
   ta: { label: 'ninguno', value: null },
}

const initForm = {
   hinicio: moment(new Date()).format('HH:mm:ss'),
   hdetencion: '',
   finicio: moment(new Date()).format('YYYY-MM-DD'),
   fdetencion: moment(new Date()).format('YYYY-MM-DD'),
   msg_revision: '',
   tiempo_cliente: 0,
   tiempo_zionit: 0
}

const RowContainer = ({ children, isScale = true }) => (
   <section
      className={`grid grid-cols-7 gap-3 items-center bg-white rounded-md shadow p-2 pt-0
         ${isScale && 'transition duration-200 transform hover:scale-[0.99]'}
      `}>
      {children}
   </section>
)

const CheckBox = ({ value, onChange }) => {
   return (
      <label
         htmlFor='id'
         className={`flex gap-2 items-baseline capitalize px-2.5 py-1.5 border 
            rounded-full transition duration-200 cursor-pointer
            ${
               value
                  ? 'border-red-500 text-red-500 hover:bg-red-50'
                  : 'border-blue-500 text-blue-500 hover:bg-blue-50'
            }
            `}>
         {value ? 'quitar' : 'agregar'}
         <input
            className='hidden'
            id='id'
            type='checkbox'
            value={value}
            onChange={onChange}
         />
         <i className={value ? 'fas fa-times' : 'fas fa-check'} />
      </label>
   )
}

const CloneSelect = ({options, value, onChange, field, isRequired = false, isDefaultOptions = false}) => {
   return(
      <div className='grid gap-2 capitalize text-xs'>
         <label className='flex gap-2 items-baseline pl-4'>
            {field}
            {isRequired && <span className='text-red-600 font-semibold'>(*)</span>}
         </label>
         <Select
            maxMenuHeight={170}
            className='capitalize text-sm'
            placeholder='Seleccione'
            options={isDefaultOptions ? [{ value: null, label: 'ninguna' }].concat(options) : options}
            value={value}
            onChange={onChange}
         />
      </div>
   )
}

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
      createDetention,
      updateDetention,
      deleteDetention,
   } = useDetail(id)

   const date = moment(activity.fecha_tx).format('yyyy-MM-DD')
   const isTicket = activity.num_ticket_edit !== 0
   const isRuning = activity.estado_play_pausa === 2
   const [showContent, setshowContent] = useState(false)

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
      tiempo_total: ''
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

   const [timeValues, setTimeValues] = useState([])

   const [{
      hinicio,
      hdetencion,
      finicio,
      fdetencion,
      msg_revision,
      tiempo_cliente,
      tiempo_zionit
   },
      onChangeValues, reset] = useForm(initForm)

   // destructuring
   const { title, description, gloss, ticket, priority, time } = fields
   const { cTitle, cDescription, cPriority, cTicket, cTime, cGloss } = cloneFields
   const { projects, subProjects, users, activity_type } = optionsArray

   const validation = () => {
      const vTitle = title.trim() === ''
      const vDesc = description.trim() === ''
      const vPriority = priority.toString().trim() === ''
      const vTime = time.toString().trim() === ''
      const vProject = options.pr?.value === undefined
      const vSolicita = options.us?.value === undefined
      const vEncargado = options.ue?.value === undefined
      const vRevisor = options.ur?.value === undefined
      const vRdisE = options.ur?.id === options.ue?.id

      const onSaveValidation =
         vTitle ||
         vDesc ||
         vPriority ||
         vTime ||
         vProject ||
         vSolicita ||
         vEncargado || 
         vRevisor ||
         vRdisE

      const vTitleC = cTitle.trim() === ''
      const vDescC = cDescription.trim() === ''
      const vPriorityC = cPriority.toString().trim() === ''
      const vTimeC = cTime.toString().trim() === ''
      const vProjectC = cloneOptions.pr?.value === undefined
      const vSolicitaC = cloneOptions.us?.value === undefined
      const vEncargadoC = cloneOptions.ue?.value === undefined
      const vRevisorC = cloneOptions.ur?.value === undefined
      const vTipo_actividadC = cloneOptions.ta?.value === undefined
      const vRdisEC = cloneOptions.ur.id === cloneOptions.ue.id

      const onCloneValidation =
         vTitleC ||
         vDescC ||
         vPriorityC ||
         vTimeC ||
         vProjectC ||
         vSolicitaC ||
         vEncargadoC ||
         vRevisorC ||
         vTipo_actividadC ||
         vRdisEC

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
      setCloneFiles(null)
      onCleanFile(Math.random().toString(36))
      setValues({ desc: '', id: null, id_ref: null })
      reset()
   }

   const openModalClone = () => {

      const fieldData = (ticket = 0) => {
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

      if (!isTicket) {
         fieldData()
         toggleModalClone(true)
         return
      }

      fieldData(ticket)
      toggleModalClone(true)
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
      cloneOptions?.ta && formData.append('tipo_actividad', cloneOptions.ta.id)
      formData.append('prioridad', cPriority)
      formData.append('ticket', cTicket)
      formData.append('tiempo_estimado', cTime)
      formData.append('titulo', cTitle)
      formData.append('descripcion', cDescription)
      formData.append('glosa', cGloss)
      formData.append('id_actividad', activity.id_det)
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

   const validateActivityIsRunning = () => {

      const action = async () => {
         
         if (isRuning) await onPlayPause({ id_actividad: activity.id_det, mensaje: 'Pausa para pasar a revisión' })

         if (isTicket) {
            setValues({...values, tiempo_total: activity.tiempo_trabajado})
            toggleModalPR(true)
         }
         else {
            Alert({
               title: 'Atención',
               content: 'La actividad pasara a estado <strong>Para Revisión</strong>',
               confirmText: 'Si, Pasar a revisión',
               cancelText: 'No, cancelar',
               action: () => {
                  navigate(routes.activity, { replace: true })
                  toggleState({})
                  reset()
               }
            })
         }
      }

      if(isRuning) {
         Alert({
            title: 'Atención',
            content: 'Debes pausar la actividad para cambiar el estado a Revisión\n¿Pausar actividad?',
            confirmText: 'Si, Pausar actividad',
            calcelText: 'No, cancelar',
            action
         })
         return
      }
      
      action()
   }

   const handleUpdateState = () => {

      if (values.tiempo_total !== 0) {
         Alert({
            icon: 'warn',
            title: 'Atención',
            content: 'Por favor distribuya el <strong>tiempo total</strong> en <strong>tiempo cliente</strong> y <strong>tiempo zionit</strong> hasta que <strong>tiempo total</strong> sea igual a 0 horas',
            showCancelButton: false,
         })

         return
      }

      toggleState({ mensaje_revision: msg_revision, tiempo_cliente, tiempo_zionit })
      navigate(routes.activity, { replace: true })
      reset()
   }

   const handleCreateDetention = () => {
      // funcion helper, para validar las fechas y si los campos hora estan llenos
      const validate = validateDate({
         finicio,
         fdetencion,
         hinicio,
         hdetencion,
      })

      if (!validate) {
         reset()
         return
      }

      createDetention({
         fecha_inicio: finicio,
         fecha_detencion: fdetencion,
         hora_inicio: hinicio,
         hora_detencion: hdetencion,
      })

      reset()
   }

   const handleUpdateDetention = ({
      id_pausa,
      fecha_inicio,
      fecha_detencion,
      hora_inicio,
      hora_detencion,
   }) => {
      // funcion helper, para validar las fechas y si los campos hora estan llenos
      const validate = validateDate({
         finicio: fecha_inicio,
         fdetencion: fecha_detencion,
         hinicio: hora_inicio,
         hdetencion: hora_detencion,
      })

      if (!validate) {
         setTimeValues(
            timeValues.map(t =>
               t.id === id_pausa
                  ? {
                       ...t,
                       [`hini${id_pausa}`]: detentions.find(
                          d => d.id_pausa === id_pausa
                       ).hora_inicio,
                       [`hdet${id_pausa}`]: detentions.find(
                          d => d.id_pausa === id_pausa
                       ).hora_detencion,
                       [`ini${id_pausa}`]: detentions.find(
                          d => d.id_pausa === id_pausa
                       ).fecha_inicio,
                       [`det${id_pausa}`]: detentions.find(
                          d => d.id_pausa === id_pausa
                       ).fecha_detencion,
                    }
                  : t
            )
         )
         console.log('se cancelo el update detention')
         return
      }

      updateDetention({
         id_pausa,
         fecha_inicio,
         fecha_detencion,
         hora_inicio,
         hora_detencion,
      })
   }

   const handleDeleteDetention = id_pausa => {
      Alert({
         title: 'Atención',
         content: '¿Estas seguro de eliminar esta detención?',
         confirmButton: 'Si, eliminar',
         cancelButton: 'No, cancelar',
         action: () => deleteDetention({ id_pausa }),
      })
   }

   const onChangePriority = (number, id) => {
      updatePriority({
         prioridad_numero: number,
         id_actividad: id,
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

         setTimeValues(
            detentions?.map(d => {
               return {
                  id: d.id_pausa,
                  [`det${d.id_pausa}`]: d.fecha_detencion,
                  [`ini${d.id_pausa}`]: d.fecha_inicio,
                  [`hdet${d.id_pausa}`]: d.hora_detencion,
                  [`hini${d.id_pausa}`]: d.hora_inicio,
               }
            })
         )
      }

      return () => null

      // eslint-disable-next-line
   }, [optionsArray, activity, detentions])

   useEffect(() => {
      setValues({
         ...values,
         tiempo_total: Number(activity.tiempo_trabajado).toFixed(4) - (Number(tiempo_cliente) + Number(tiempo_zionit)),
      })

      // eslint-disable-next-line
   }, [tiempo_cliente, tiempo_zionit, activity])

   return (
      <>
         {Object.keys(activity).length > 0 && (
            <>
               <ViewContainer>
                  <View
                     title={activity.actividad}
                     priority={activity.prioridad_etiqueta}
                     type={{desc: activity.desc_tipo_actividad, id: activity.tipo_actividad}}
                     onHigh={() => onChangePriority(100, activity.id_det)}
                     onMid={() => onChangePriority(400, activity.id_det)}
                     onLow={() => onChangePriority(600, activity.id_det)}
                     onNone={() => onChangePriority(1000, activity.id_det)}
                     id={activity.id_det}
                     idFather={activity.id_det_padre}
                     isChildren={activity.esHijo === 1 && activity.esPadre === 0}
                     isFather={activity.esPadre === 1 && activity.esHijo === 0}
                     isCoorActivity={activity.tipo_actividad === 3}
                     isReviewedActivity={activity.tipo_actividad === 2}
                     isChildrenAndChildren={activity.esHijo === 1 && activity.esPadre === 1}
                  >
                     <AlertBar 
                        validation={validation().isSave} 
                        isCustom={options?.ur?.id !== options?.ue?.id} 
                        customMsg='Revisor y Encargado no pueden ser asignados a la misma persona'
                     />

                     <ViewSection lg cols={8}>

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
                                       {userStyles.priority} ({activity.num_prioridad})
                                    </>
                                 }
                              />
                              <span className={`
                                 px-2 py-0.5 font-semibold rounded-full text-sm mt-2 block w-max
                                 ${activity.tipo_actividad === 1 ? 'bg-indigo-100 text-indigo-500' 
                                    : activity.tipo_actividad === 2 ? 'bg-emerald-100 text-emerald-500' 
                                    : activity.tipo_actividad === 3 ? 'bg-orange-100 text-orange-500' 
                                    : 'bg-zinc-100 text-black'
                                 }
                              `}>
                                 Tipo: {activity.desc_tipo_actividad}
                              </span>
                           </header>

                           <hr className='my-5' />

                           <section className='grid gap-2'>
                              <CloneSelect
                                 isDefaultOptions
                                 isRequired
                                 field='Proyecto'
                                 options={projects}
                                 value={options.pr}
                                 onChange={option =>
                                    setOptions({ ...options, pr: option })
                                 }
                              />
                              <CloneSelect
                                 isDefaultOptions
                                 field='Sub proyecto'
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
                              <CloneSelect
                                 isDefaultOptions
                                 isRequired
                                 field='Solicitante'
                                 options={users}
                                 value={options.us}
                                 onChange={option =>
                                    setOptions({ ...options, us: option })
                                 }
                              />
                              <CloneSelect
                                 isDefaultOptions
                                 isRequired
                                 field='Encargado'
                                 options={users}
                                 value={options.ue}
                                 onChange={option =>
                                    setOptions({ ...options, ue: option })
                                 }
                              />
                              <CloneSelect
                                 isDefaultOptions
                                 isRequired
                                 field='Revisor'
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
                              isRequired
                              field='titulo'
                              value={title}
                              onChange={e =>
                                 setFields({ ...fields, title: e.target.value })
                              }
                           />
                           <TextArea
                              isRequired
                              field='descripccion'
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
                                 isRequired
                                 field='prioridad'
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
                                 isRequired
                                 field='T. estimado'
                                 value={time}
                                 isNumber
                                 onChange={e =>
                                    setFields({
                                       ...fields,
                                       time: e.target.value,
                                    })
                                 }
                              />
                           </div>
                        </section>

                        <aside className='col-span-1 md:col-span-3 mt-5 md:mt-0'>
                           <div className='flex justify-between items-center mb-3'>
                              <h5 className='text-sm font-semibold'>
                                 Notas (Informes):{' '}
                              </h5>
                              <section className='flex gap-2'>
                                 <Button
                                    className='text-slate-600 bg-slate-100 hover:bg-slate-200'
                                    onClick={() => toggleModalAdd(true)}>
                                    <i className='fas fa-plus' />
                                 </Button>
                                 <Button
                                    disabled={activity.notas.length === 0}
                                    className='text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:hover:bg-slate-200/50'
                                    onClick={() => toggleModalEdit(true)}>
                                    <i className='fas fa-pen' />
                                 </Button>
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
                     </ViewSection>

                     <hr className='my-5' />

                     <ViewSection md cols={2}>
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
                                             duration-200 transform hover:scale-[1.02] text-sm w-full truncate'
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
                                 hidden={detentions.length === 0}
                                 className='bg-orange-50 hover:bg-orange-100 text-orange-500'
                                 onClick={() => toggleModalTimer(true)}>
                                 <i className='far fa-clock' /> Modificar
                                 tiempos
                              </Button>
                           </div>
                        </aside>
                     </ViewSection>

                     <ViewFooter>
                        <section className='flex gap-2'>
                           <Button
                              className='text-red-400 bg-red-50 hover:bg-red-100'
                              onClick={() =>
                                 deleteActivity({
                                    id_actividad: activity.id_det,
                                 })
                              }>
                              <i className='fas fa-trash' />
                           </Button>

                           <Button
                              hidden={activity.tipo_actividad === 3 || activity.tipo_actividad === 2}
                              className='text-slate-600 bg-slate-100 hover:bg-slate-200'
                              onClick={openModalClone}>
                              <i className='fas fa-clone' />
                           </Button>

                           {activity.num_ticket_edit !== 0 && (
                              <a
                                 className='text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg h-9 px-2.5 text-center block pt-1.5 transition duration-300'
                                 target='_blank'
                                 rel='noreferrer'
                                 title='Eventos'
                                 href={`https://tickets.zproduccion.cl/#/in/${activity.num_ticket_edit}`}>
                                 <i className='fas fa-ticket-alt' />
                              </a>
                           )}

                           <Button
                              hidden={activity.estado === 1}
                              className={
                                 activity.estado_play_pausa === 2
                                    ? 'text-red-400 bg-red-50 hover:bg-red-100'
                                    : 'text-emerald-400 bg-emerald-50 hover:bg-emerald-100'
                              }
                              onClick={handleOnPlayPause}>
                              <i
                                 className={
                                    activity.estado_play_pausa === 2
                                       ? 'fas fa-pause fa-sm'
                                       : 'fas fa-play fa-sm'
                                 }
                              />
                           </Button>

                           <Button
                              hidden={activity.estado !== 2}
                              title='Pasar actividad a revisión'
                              className='text-orange-400 bg-orange-50 hover:bg-orange-100'
                              onClick={validateActivityIsRunning}
                           >
                              <i className='fas fa-eye' />
                           </Button>

                        </section>

                        <section className='flex justify-end gap-2'>
                           <Button
                              className='text-red-500 hover:bg-red-100'
                              onClick={() =>
                                 navigate(routes.activity, { replace: true })
                              }>
                              Cancelar
                           </Button>
                           <Button
                              disabled={validation().isSave}
                              className='text-emerald-500 hover:bg-emerald-100 place-self-end'
                              onClick={onSave}>
                              Guardar
                           </Button>
                        </section>
                     </ViewFooter>
                  </View>
               </ViewContainer>

               {/* modal PR */}
               <Modal
                  showModal={modalPR}
                  isBlur={false}
                  onClose={onCloseModals}
                  className='max-w-xl'
                  padding='p-4 md:p-6'
                  title='Pasar a revisión'>

                  <div>

                     <section className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3 mb-7'>

                        <Input 
                           field='Tiempo Cliente (hrs)' 
                           name='tiempo_cliente'
                           value={tiempo_cliente} 
                           onChange={onChangeValues}
                        />

                        <Input 
                           field='Tiempo Zionit  (hrs)' 
                           name='tiempo_zionit'
                           value={tiempo_zionit} 
                           onChange={onChangeValues}
                        />

                        <div>
                           <h5 className='text-xs mt-1 mb-2.5'>Tiempo Total  (hrs)</h5>
                           <NumberFormat 
                              value={values.tiempo_total} 
                              decimalScale={4} 
                              fixedDecimalScale={false}
                              displayType='text' 
                           />
                        </div>

                     </section>

                     {isTicket &&
                        <section className='flex gap-2 justify-between items-baseline'>
                           
                           <p className='text-sm text-gray-600'>
                              ¿Desea agregar un mensaje al pasar a revisión?
                           </p>

                           <CheckBox
                              value={showContent}
                              onChange={e => setshowContent(e.target.checked)}
                           />
                              
                        </section>
                     }

                     {showContent && (
                        <TextArea
                           field='mensaje'
                           name='msg_revision'
                           value={msg_revision}
                           onChange={onChangeValues}
                        />
                     )}
                     <section className='flex justify-between mt-5'>
                        <Button
                           className='text-red-500 hover:bg-red-100'
                           onClick={onCloseModals}>
                           Cancelar
                        </Button>
                        <Button
                           className='text-emerald-500 hover:bg-emerald-100'
                           onClick={handleUpdateState}>
                           pasar a revisión
                        </Button>
                     </section>
                  </div>
               </Modal>

               {/* modal detentions */}
               <Modal
                  showModal={modalTimer}
                  isBlur={false}
                  onClose={onCloseModals}
                  className='max-w-7xl'
                  padding='p-4 md:p-6'
                  title='Modificar tiempos de actividad'>

                  <main className='grid gap-1 bg-zinc-100 rounded-md p-2 mt-10 shadow w-[1216px] overflow-auto'>

                     <header className='grid grid-cols-7 gap-1 text-center capitalize font-semibold border-b'>
                        <span className='py-1.5 border-r col-span-3'>
                           desde
                        </span>
                        <span className='py-1.5 border-r col-span-2'>
                           hasta
                        </span>
                        <span className='py-1.5 col-span-2'>control</span>
                     </header>

                     <section className='grid grid-cols-7 gap-1 text-center capitalize font-semibold'>

                        <div className='flex gap-4 col-span-2 py-1.5 border-r'>
                           <span className='ml-2'>Nº</span>{' '}
                           <span className='text-center w-full mr-3'>
                              fecha
                           </span>
                        </div>
                        <span className='py-1.5 border-r'>hora</span>
                        <span className='py-1.5 border-r'>fecha</span>
                        <span className='py-1.5 border-r'>hora</span>
                        <span className='py-1.5'>tiempo (hrs)</span>
                        <span />
                     </section>

                     <RowContainer isScale={false}>
                        <div className='grid grid-cols-5 col-span-2 items-center gap-2'>
                           <span className='col-span-2' />
                           <Input
                              className='col-span-3 mb-2'
                              type='date'
                              name='finicio'
                              value={finicio}
                              onChange={onChangeValues}
                           />
                        </div>
                        <InputMask
                           mask='99:99:99'
                           maskChar=''
                           name='hinicio'
                           value={hinicio}
                           onChange={onChangeValues}>
                           {inputProps => (
                              <Input
                                 className='mb-2'
                                 name={inputProps.name}
                                 onChange={inputProps.onChange}
                                 value={inputProps.value}
                              />
                           )}
                        </InputMask>
                        <Input
                           className='mb-2'
                           type='date'
                           name='fdetencion'
                           value={fdetencion}
                           onChange={onChangeValues}
                        />
                        <InputMask
                           mask='99:99:99'
                           maskChar=''
                           name='hdetencion'
                           value={hdetencion}
                           onChange={onChangeValues}>
                           {inputProps => (
                              <Input
                                 className='mb-2'
                                 name={inputProps.name}
                                 onChange={inputProps.onChange}
                                 value={inputProps.value}
                              />
                           )}
                        </InputMask>
                        <span className='text-center'></span>
                        <div className='flex justify-center gap-2 border-l mt-2'>
                           <Button
                              className='bg-emerald-100 hover:bg-emerald-200 text-emerald-500'
                              onClick={handleCreateDetention}>
                              agregar
                           </Button>
                        </div>
                     </RowContainer>

                     <h5 className='py-3 px-3'>Detenciones</h5>
                     <div className='max-h-72 overflow-custom grid gap-1 border-t'>
                        {detentions.length > 0 &&
                           detentions.map((d, i) => (
                              <RowContainer key={d.id_pausa}>
                                 <div className='grid grid-cols-5 col-span-2 items-center gap-2'>
                                    <Numerator
                                       className='col-span-2 max-w-max mt-4'
                                       number={i + 1}
                                    />
                                    <Input
                                       className='col-span-3 mb-2'
                                       type='date'
                                       value={
                                          timeValues[i]?.[`ini${d.id_pausa}`] ||
                                          ''
                                       }
                                       onChange={e =>
                                          setTimeValues(
                                             timeValues.map(t =>
                                                t.id === d.id_pausa
                                                   ? {
                                                        ...t,
                                                        [`ini${d.id_pausa}`]:
                                                           e.target.value,
                                                     }
                                                   : t
                                             )
                                          )
                                       }
                                    />
                                 </div>

                                 <InputMask
                                    mask='99:99:99'
                                    maskChar=''
                                    value={
                                       timeValues[i]?.[`hini${d.id_pausa}`] ||
                                       ''
                                    }
                                    onChange={e =>
                                       setTimeValues(
                                          timeValues.map(t =>
                                             t.id === d.id_pausa
                                                ? {
                                                     ...t,
                                                     [`hini${d.id_pausa}`]:
                                                        e.target.value,
                                                  }
                                                : t
                                          )
                                       )
                                    }>
                                    {inputProps => (
                                       <Input
                                          className='mb-1'
                                          onChange={inputProps.onChange}
                                          value={inputProps.value}
                                       />
                                    )}
                                 </InputMask>

                                 <Input
                                    className='mb-1'
                                    type='date'
                                    value={
                                       timeValues[i]?.[`det${d.id_pausa}`] || ''
                                    }
                                    onChange={e =>
                                       setTimeValues(
                                          timeValues.map(t =>
                                             t.id === d.id_pausa
                                                ? {
                                                     ...t,
                                                     [`det${d.id_pausa}`]:
                                                        e.target.value,
                                                  }
                                                : t
                                          )
                                       )
                                    }
                                 />

                                 <InputMask
                                    mask='99:99:99'
                                    maskChar=''
                                    value={
                                       timeValues[i]?.[`hdet${d.id_pausa}`] ||
                                       ''
                                    }
                                    onChange={e =>
                                       setTimeValues(
                                          timeValues.map(t =>
                                             t.id === d.id_pausa
                                                ? {
                                                     ...t,
                                                     [`hdet${d.id_pausa}`]:
                                                        e.target.value,
                                                  }
                                                : t
                                          )
                                       )
                                    }>
                                    {inputProps => (
                                       <Input
                                          className='mb-1'
                                          onChange={inputProps.onChange}
                                          value={inputProps.value}
                                       />
                                    )}
                                 </InputMask>

                                 <span className='text-center mt-3'>
                                    {moment(
                                       `${d.fecha_detencion} ${d.hora_detencion}`
                                    ).isValid() && (
                                       <>
                                          {Number.parseFloat(
                                             moment(
                                                `${d.fecha_detencion} ${d.hora_detencion}`
                                             ).diff(
                                                moment(
                                                   `${d.fecha_inicio} ${d.hora_inicio}`
                                                ),
                                                'hours',
                                                true
                                             )
                                          ).toFixed(2)}
                                       </>
                                    )}
                                 </span>

                                 <div className='flex justify-center gap-2 border-l mt-2'>
                                    <Button
                                       disabled={
                                          !moment(
                                             `${d.fecha_detencion} ${d.hora_detencion}`
                                          ).isValid()
                                       }
                                       className='bg-emerald-100 hover:bg-emerald-200 text-emerald-500 disabled:hover:bg-emerald-200/50'
                                       onClick={() =>
                                          handleUpdateDetention({
                                             id_pausa: d.id_pausa,
                                             fecha_inicio:
                                                timeValues[i]?.[
                                                   `ini${d.id_pausa}`
                                                ],
                                             fecha_detencion:
                                                timeValues[i]?.[
                                                   `det${d.id_pausa}`
                                                ],
                                             hora_inicio:
                                                timeValues[i]?.[
                                                   `hini${d.id_pausa}`
                                                ],
                                             hora_detencion:
                                                timeValues[i]?.[
                                                   `hdet${d.id_pausa}`
                                                ],
                                          })
                                       }>
                                       <i className='fas fa-check' />
                                    </Button>
                                    <Button
                                       disabled={
                                          !moment(
                                             `${d.fecha_detencion} ${d.hora_detencion}`
                                          ).isValid()
                                       }
                                       className='bg-red-100 hover:bg-red-200 text-red-500 disabled:hover:bg-red-200/50'
                                       onClick={() =>
                                          handleDeleteDetention(d.id_pausa)
                                       }>
                                       <i className='fas fa-trash' />
                                    </Button>
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
                        className='text-blue-500 hover:bg-blue-100 place-self-end'
                        onClick={onUpdate}>
                        modificar nota
                     </Button>
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
                        className='text-blue-500 hover:bg-blue-100 place-self-end'
                        onClick={onAdd}>
                        crear nota
                     </Button>
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
                           className='w-max text-blue-500 hover:bg-blue-100'
                           onClick={() => onCloseModals()}>
                           cancelar
                        </Button>
                        <Button
                           className='w-max text-red-500 hover:bg-red-100'
                           onClick={onPause}>
                           Pausar actividad
                        </Button>
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

                  <AlertBar 
                     validation={validation().isClone} 
                     isCustom={cloneOptions?.ur?.id !== cloneOptions?.ue?.id} 
                     customMsg='Revisor y Encargado no pueden ser asignados a la misma persona'
                  />

                  <div className='grid gap-5'>

                     <header className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <aside className='grid gap-2'>

                           <CloneSelect
                              isRequired
                              field='Proyecto'
                              options={projects}
                              value={cloneOptions.pr}
                              onChange={option =>
                                 setCloneOptions({
                                    ...cloneOptions,
                                    pr: option,
                                 })
                              }
                           />

                           <CloneSelect
                              field='Sub proyecto'
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

                           <CloneSelect
                              isRequired
                              field='Solicitante'
                              options={users}
                              value={cloneOptions.us}
                              onChange={option =>
                                 setCloneOptions({
                                    ...cloneOptions,
                                    us: option,
                                 })
                              }
                           />

                           <CloneSelect
                              isRequired
                              field='Encargado'
                              options={users}
                              value={cloneOptions.ue}
                              onChange={option =>
                                 setCloneOptions({
                                    ...cloneOptions,
                                    ue: option,
                                 })
                              }
                           />

                           <CloneSelect
                              isRequired
                              field='Revisor'
                              options={users}
                              value={cloneOptions.ur}
                              onChange={option =>
                                 setCloneOptions({
                                    ...cloneOptions,
                                    ur: option,
                                 })
                              }
                           />
                        </aside>

                        <aside className='mt-0.5 grid'>

                           <div className='border-2 border-amber-400/30 rounded bg-amber-50 p-0.5'>
                              <CloneSelect
                                 isRequired
                                 field='tipo actividad'
                                 options={activity_type}
                                 value={cloneOptions.ta}
                                 onChange={option =>
                                    setCloneOptions({
                                       ...cloneOptions,
                                       ta: option,
                                    })
                                 }
                              />
                           </div>

                           <Input
                              isRequired
                              field='titulo'
                              value={cTitle}
                              onChange={e =>
                                 setCloneFields({
                                    ...cloneFields,
                                    cTitle: e.target.value,
                                 })
                              }
                           />

                           <Input
                              disabled
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
                              isRequired
                              field='prioridad'
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
                              isRequired
                              field='T. estimado'
                              value={cTime}
                              isNumber
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

                        <div className='place-self-end flex gap-2'>

                           <Button
                              className='text-red-500 hover:bg-red-100'
                              onClick={onCloseModals}>
                              Cancelar
                           </Button>

                           <Button
                              disabled={validation().isClone}
                              className='text-yellow-500 hover:bg-yellow-100 place-self-end disabled:hover:bg-transparent'
                              onClick={onClone}>
                              clonar actividad
                           </Button>

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
