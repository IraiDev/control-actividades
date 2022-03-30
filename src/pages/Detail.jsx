import { useContext, useEffect, useState } from 'react'
import { ActivityContext } from '../context/ActivityContext'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { validateDate, validatePredecessor } from '../helpers/helpersFunc'
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
import Box from '../components/ui/Box'
import Switch from '../components/ui/Switch'
import queryString from 'query-string'
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import FloatMenu from '../components/ui/FloatMenu'
// import MapSection from '../components/map/MapSection'
// import MapArrow from '../components/map/MapArrow'
import { fetchToken } from '../helpers/fetch'
import CustomSelect from '../components/ui/CustomSelect'
import ChildContainer from '../components/child/ChildContainer'

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
   { id: 1112425, desc: 'Fin jornada...' },
]

const initOptions = {
   pr: { label: 'ninguno', value: 0 },
   sp: { label: 'ninguno', value: 0 },
   us: { label: 'ninguno', value: 0 },
   ue: { label: 'ninguno', value: 0 },
   ur: { label: 'ninguno', value: 0, id: 0 },
   ta: { label: 'ninguno', value: 0 },
   pt: { label: 'ninguno', value: 0 },
   ptc: { label: 'ninguno', value: null },
}

const CheckBox = ({ value, onChange }) => {
   return (
      <label
         htmlFor='id'
         className={`flex gap-2 items-baseline capitalize px-2.5 py-1.5 border 
            rounded-full transition duration-200 cursor-pointer
            ${value
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

const CloneSelect = ({ options, value, onChange, field, isRequired = false, isDefaultOptions = false, disabled = false, hidden = false }) => {

   if (hidden) return null

   return (
      <div className='capitalize text-xs'>
         <span className='flex gap-2 items-baseline font-semibold text-sm px-2 w-max mb-2 py-0.5 bg-amber-200/80 rounded-md'>
            {field}
            {isRequired && <span className='text-red-600 font-semibold'>(*)</span>}
         </span>

         <Select
            isDisabled={disabled}
            maxMenuHeight={170}
            className='capitalize text-sm'
            placeholder='Seleccione'
            options={isDefaultOptions ? [{ value: 0, label: 'ninguno' }].concat(options) : options}
            value={value}
            onChange={onChange}
         />
      </div>
   )
}

const Span = ({ children, colCount = 1 }) => {

   let cols = ''

   switch (colCount) {
      case 1:
         cols = 'col-span-1'
         break
      case 2:
         cols = 'col-span-2'
         break
      case 3:
         cols = 'col-span-3'
         break
      case 4:
         cols = 'col-span-4'
         break
      default:
         cols = 'col-span-1'
         break
   }

   return (
      <span className={`py-2 border-r text-center font-semibold capitalize ${cols}`}>{children}</span>
   )
}

const Detail = () => {
   const navigate = useNavigate()
   const { id } = useParams()
   const { search } = useLocation()
   const { type_detail = '' } = queryString.parse(search)
   const { optionsArray, user } = useContext(ActivityContext)
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
      runActivityPending
   } = useDetail(id)

   const date = moment(activity.fecha_tx).format('yyyy-MM-DD')
   const isTicket = activity.num_ticket_edit !== 0
   const isRuning = activity.estado_play_pausa === 2
   const isFather = activity.es_padre === 1 && activity.es_hijo === 0
   const [showContent, setshowContent] = useState(false)
   const [showChilds, setShowChilds] = useState(false)

   // modals
   const [modalEdit, toggleModalEdit] = useState(false)
   const [modalAdd, toggleModalAdd] = useState(false)
   const [modalClone, toggleModalClone] = useState(false)
   const [modalPause, toggleModalPause] = useState(false)
   const [modalTimer, toggleModalTimer] = useState(false)
   const [modalPR, toggleModalPR] = useState(false)
   const [modalReject, setModalReject] = useState(false)

   // options
   const [options, setOptions] = useState(initOptions)
   const [cloneOptions, setCloneOptions] = useState(initOptions)
   const [optionDetentions, setOptionDetentions] = useState([])

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
      time: 1,
      gloss: '',
   })

   const [cloneFields, setCloneFields] = useState({
      cTitle: '',
      cDescription: '',
      cPriority: '',
      cTicket: '',
      cTime: 1,
      cGloss: '',
   })

   const [timeValues, setTimeValues] = useState([])
   const [sw, setSw] = useState({ a: { value: false, resp: true }, b: { value: false, resp: false } })

   const [{
      hinicio,
      hdetencion,
      finicio,
      fdetencion,
      msg_revision,
      tiempo_cliente,
      tiempo_zionit,
      tiempo_estimado
   },
      onChangeValues, reset] = useForm({
         hinicio: moment(new Date()).format('HH:mm:ss'),
         hdetencion: '',
         finicio: moment(new Date()).format('YYYY-MM-DD'),
         fdetencion: moment(new Date()).format('YYYY-MM-DD'),
         msg_revision: '',
         tiempo_cliente: 0,
         tiempo_zionit: 0,
         tiempo_estimado: activity.tiempo_estimado
      })

   // destructuring
   const { title, description, gloss, ticket, priority, time } = fields
   const { cTitle, cDescription, cPriority, cTicket, cTime, cGloss } = cloneFields
   const { projects, subProjects, users, activity_type, pause_type } = optionsArray

   const validation = () => {
      const vTitle = title.trim() === ''
      const vDesc = description.trim() === ''
      const vPriority = priority?.toString().trim() === '' || Number(priority) <= 0
      const vTime = time?.toString().trim() === '' || Number(time) <= 0
      const vProject = options.pr?.value === 0
      const vSolicita = options.us?.value === 0
      const vEncargado = options.ue?.value === 0
      const vRevisor = activity.id_tipo_actividad === 1 ? options.ur?.value === 0 : false
      const vRdisE = activity.id_tipo_actividad === 1 ? options.ur?.id === options.ue?.id : false

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
      const vPriorityC = cPriority?.toString().trim() === '' || Number(cPriority) <= 0
      const vTimeC = cTime?.toString().trim() === '' || Number(cTime) <= 0
      const vProjectC = cloneOptions.pr?.value === 0 || cloneOptions.pr?.value === undefined
      const vSolicitaC = cloneOptions.us?.value === 0 || cloneOptions.us?.value === undefined
      const vEncargadoC = cloneOptions.ue?.value === 0 || cloneOptions.ue?.value === undefined
      const vRevisorC = cloneOptions?.ta?.value === 1 ? cloneOptions.ur?.value === 0 || cloneOptions.ur?.value === undefined : false
      const vTipo_actividadC = cloneOptions.ta?.value === 0 || cloneOptions.ta?.value === undefined
      const vRdisEC = cloneOptions?.ta?.value === 1 ? cloneOptions.ur.id === cloneOptions.ue.id : false

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

   const validateMod = (returnObj = false) => {

      const vPR = options?.pr?.value !== activity.id_proy
      const vSub = options?.sp?.value !== activity.id_sub_proyecto
      const vSo = options?.us?.label !== activity.user_solicita
      const vEn = options?.ue?.label !== activity.encargado_actividad
      const vRe = activity?.id_revisor && (activity.id_tipo_actividad !== 4 || activity.id_tipo_actividad !== 3) ? options?.ur?.id !== activity?.id_revisor : false
      const vTitle = title !== activity.actividad
      const vDesc = description !== activity.func_objeto
      const vGloss = activity.glosa_explicativa !== null ? gloss !== activity.glosa_explicativa : false
      const vTicket = ticket !== activity.num_ticket_edit
      const vPriority = priority !== activity.num_prioridad && priority >= 0
      const vTime = time !== activity.tiempo_estimado && time > 0

      // console.log({ vPR, vSub, vSo, vEn, vRe, vTitle, vDesc, vGloss, vTicket, vPriority, vTime })

      const validate = vPR || vSub || vSo || vEn || vRe || vTitle || vDesc || vGloss || vTicket || vPriority || vTime

      return returnObj ? { res: validate } : validate
   }

   const onCloseModals = () => {
      toggleModalEdit(false)
      toggleModalAdd(false)
      toggleModalPause(false)
      toggleModalClone(false)
      toggleModalTimer(false)
      toggleModalPR(false)
      setModalReject(false)
      setCloneFiles(null)
      setSw({ a: { value: false, resp: false }, b: { value: false, resp: true } })
      onCleanFile(Math.random().toString(36))
      setValues({ desc: '', id: null, id_ref: null })
      reset()
   }

   // abre el modal clonar y carga la data de los campos de modal clonar
   const openModalClone = () => {

      const validate = validateMod()

      const action = async () => {

         if (validate) await onSave()

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
               pr: options.pr,
               sp: options.sp,
               us: options.us,
               ue: options.ue,
               ur: options.ur ?? { value: 0, label: 'ninguno' },
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

      if (validate) {
         Alert({
            title: '¡Atención!',
            content: 'Se han realizado modificaciones que no han sido guardadas, ¿Desea guardar antes de continuar?',
            confirmText: 'Si, guardar',
            cancelText: 'Cancelar Clonar',
            action,
            cancelAction: () => onCloseModals()
         })

         return
      }

      action()
   }

   // play/pause desde el detalle
   const handleOnPlayPause = () => {

      const pauseState = activity.estado_play_pausa === 2

      const userAbrev = users.find(u => u.id === user.id).label

      const playValidate = activity.encargado_actividad !== userAbrev

      const action = () => {

         const validate = validateMod()

         const callback = async () => {

            if (validate) await onSave()

            if (pauseState) {
               // si esta en play entra aqui para poner pausa, desde el detalle
               toggleModalPause(true)
               setValues({
                  ...values,
                  id_ref: activity.id_det,
                  title: activity.actividad || 'Sin titulo',
                  content: activity.func_objeto || 'Sin descripcion',
               })
            } else {
               // si esta en pausa entra aqui para poner play, desde el detalle

               try {
                  const resp = await fetchToken('task/get-times')
                  const body = await resp.json()

                  if (body.ok) {

                     const userState = body.tiempos.find(item => item.usuario === userAbrev).estado

                     if (userState) {
                        Alert({
                           icon: 'warn',
                           title: 'Atención',
                           content: 'Actualemnte el encargado de esta actividad cuenta con una actividad en la cual esta trabajando </br> ¿Desea poner en marcha igualmente esta actividad?',
                           confirmText: 'si, poner en marcha',
                           cancelText: 'no, cancelar',
                           action: () => onPlayPause({ id_actividad: activity.id_det })
                        })
                        return
                     }

                     onPlayPause({ id_actividad: activity.id_det })

                  }
               } catch (error) {
                  console.log('getTimes error: ', error)
               }

            }

         }

         if (validate) {
            Alert({
               title: '¡Atención!',
               content: 'Se han realizado modificaciones que no han sido guardadas, ¿Desea guardar antes de continuar?',
               confirmText: 'Si, guardar y continuar',
               cancelText: 'Cancelar Play/Pause',
               action: () => callback(),
               cancelAction: () => onCloseModals()
            })

            return
         }

         callback()

      }

      if (playValidate) {
         Alert({
            icon: 'warn',
            title: 'Atención',
            content: `No eres el encargado de esta actividad </br> ¿Deseas ${pauseState ? 'pausar' : 'poner en marcha'} igualmente esta actividad?`,
            confirmText: `si, ${pauseState ? 'pausar' : 'poner en marcha'}`,
            cancelText: 'no, cancelar',
            action
         })

         return
      }

      action()
   }

   // guarda la pausa de la actividad desde el modal de pausas
   const onPause = ({ isDefaultPause, mensaje }) => {

      if (!options.pt) {
         Alert({
            icon: 'warn',
            title: 'Atención',
            content: `Debes seleccionar un tipo de pausa`,
            showCancelButton: false,
         })

         return
      }

      if (values.desc === '' && !isDefaultPause) {
         Alert({
            icon: 'warn',
            title: 'Atención',
            content: 'No puedes guardar una pausa sin un mensaje',
            showCancelButton: false,
         })
         return
      }

      onPlayPause({
         id_actividad: activity.id_det,
         mensaje: isDefaultPause ? mensaje : values.desc,
         tipo_pausa: options.pt.value,
      })
      onCloseModals()
   }

   // pregunta si desea eliminar la actividad
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

   // actualiza la nota de la actividad
   const onUpdateNote = () => {
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

   // crea una nueva nota de la actividad
   const onAddNote = () => {
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

   // realiza la accion de guardar los cambios realizados en la actividad
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

   // realiza la accione de clonar la actividad
   const onClone = async () => {
      const formData = new FormData()
      cloneOptions?.pr && formData.append('proyecto', cloneOptions.pr.value)
      cloneOptions?.sp && formData.append('sub_proyecto', cloneOptions.sp.value)
      cloneOptions?.us && formData.append('solicita', cloneOptions.us.label)
      cloneOptions?.ue && formData.append('encargado', cloneOptions.ue.label)
      cloneOptions?.ta?.value === 1 && cloneOptions?.ur && formData.append('revisor', cloneOptions.ur.id)
      cloneOptions?.ta && formData.append('tipo_actividad', cloneOptions.ta.value)
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

   // provee el formato de los timers
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

   // cambia el estado de la actividad a PR y valida si hay modificaciones sin guardar
   const handleOpenModalRevision = () => {

      // valida si la actividad esta corriendo antes de pasar a PR

      const validate = validateMod()

      const action = async () => {

         if (validate) await onSave()

         const callback = () => {
            const action = async () => {

               if (isRuning) await onPlayPause({ id_actividad: activity.id_det, mensaje: 'Pausa para pasar a revisión' })
               setValues({ ...values, tiempo_total: activity.tiempo_trabajado })
               toggleModalPR(true)

            }

            if (isRuning) {
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

         validatePredecessor({
            array: activity.predecesoras,
            callback,
            state: 3,
            options: optionsArray
         })

      }

      if (validate) {
         Alert({
            title: '¡Atención!',
            content: 'Se han realizado modificaciones que no han sido guardadas, ¿Desea guardar antes de continuar?',
            confirmText: 'Si, Guardar y continuar',
            cancelText: 'Cancelar',
            action,
         })

         return
      }

      action()
   }

   // termina la actividad, solo para actividades de coordinacion, padres y de revisión
   // ademas valida si hay modificaciones sin guardar
   const finishActivity = (type, isFather) => {

      const validate = validateMod()

      const action = async () => {

         if (validate) await onSave()

         if (isFather) {
            Alert({
               title: 'Atención',
               content: '¿Esta seguro de terminar la actividada Padre original?',
               confirmText: 'Si, Terminar actividad',
               calcelText: 'No, cancelar',
               action: () => {
                  toggleState({ estado: 5 })
                  navigate(routes.activity, { replace: true })
               }
            })
            return
         }

         const callback = () => {

            if (type === 3) return setModalReject(true)

            const action = async () => {
               await toggleState({ tiempo_cliente: activity.tiempo_trabajado, estado: 13 })
               navigate(routes.activity, { replace: true })
            }

            Alert({
               title: 'Atención',
               content: `¿Estas seguro de ${isFather ? 'terminar' : 'procesar'} la actividad?`,
               confirmText: `Si, ${isFather ? 'terminar' : 'procesar'}`,
               cancelText: 'No, cancelar',
               action
            })
         }

         if (isRuning) {
            Alert({
               title: 'Atención',
               content: 'Debes pausar la actividad para terminarla\n¿Pausar actividad?',
               confirmText: 'Si, Pausar actividad',
               calcelText: 'No, cancelar',
               action: async () => {
                  await onPlayPause({ id_actividad: activity.id_det, mensaje: 'Pausa para procesar actividad' })
                  validatePredecessor({
                     array: activity.predecesoras,
                     callback,
                     state: 13,
                     options: optionsArray
                  })
               }
            })

            return
         }

         validatePredecessor({
            array: activity.predecesoras,
            callback,
            state: 13,
            options: optionsArray
         })

      }

      if (validate) {
         Alert({
            title: '¡Atención!',
            content: 'Se han realizado modificaciones que no han sido guardadas, ¿Desea guardar antes de continuar?',
            confirmText: 'Si, Guardar y continuar',
            cancelText: 'Cancelar',
            action,
         })

         return
      }

      action()
   }

   // finaliza la acividad de entrega y verifica si esta fue aprobada o rechazada
   const handleFinshDeliveryActivity = () => {

      if ((sw.a.value === false && sw.b.value === false)) {
         Alert({
            title: 'Atención',
            content: 'Debes seleccionar una de las opcions, rechazada o aprobada',
            showCancelButton: false,
         })
         return
      }

      const find = sw.a.value ? false : true

      toggleState({ tiempo_cliente: activity.tiempo_trabajado, estado: 13, rechazada: find })
      navigate(routes.activity, { replace: true })
   }

   // cambia el estado de la actividad a PR despues de distribuir tiempo cliente y tiempo zionit
   const handleUpdateActivityState = async () => {

      if (values.tiempo_total !== 0) {
         Alert({
            icon: 'warn',
            title: 'Atención',
            content: 'Por favor distribuya el <strong>tiempo total</strong> en <strong>tiempo cliente</strong> y <strong>tiempo zionit</strong> hasta que <strong>tiempo total</strong> sea igual a 0 horas',
            showCancelButton: false,
         })

         return
      }

      await toggleState({ mensaje_revision: msg_revision, tiempo_cliente, tiempo_zionit })
      navigate(routes.activity, { replace: true })
      reset()

   }

   // crea un nueva detencion
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

      if (options.ptc.value === null) {
         Alert({
            icon: 'warn',
            title: 'Atención',
            content: 'Por favor seleccione una <strong>tipo de pausa</strong>',
            showCancelButton: false,
         })
         return
      }

      createDetention({
         fecha_inicio: finicio,
         fecha_detencion: fdetencion,
         hora_inicio: hinicio,
         hora_detencion: hdetencion,
         tipo_pausa: options.ptc.value,
      })

      reset()
   }

   // actualiza la detencion apuntada
   const handleUpdateDetention = ({
      id_pausa,
      fecha_inicio,
      fecha_detencion,
      hora_inicio,
      hora_detencion,
      tipo_pausa
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

         return
      }

      updateDetention({
         id_pausa,
         fecha_inicio,
         fecha_detencion,
         hora_inicio,
         hora_detencion,
         tipo_pausa
      })
   }

   // elimina la detencion apuntada
   const handleDeleteDetention = id_pausa => {
      Alert({
         title: 'Atención',
         content: '¿Estas seguro de eliminar esta detención?',
         confirmButton: 'Si, eliminar',
         cancelButton: 'No, cancelar',
         action: () => deleteDetention({ id_pausa }),
      })
   }

   // actualiza la prioridad to-do de la actividad
   const onChangePriority = (number, id) => {

      const validate = validateMod()

      const action = async () => {

         if (validate) await onSave()

         updatePriority({
            prioridad_numero: number,
            id_actividad: id,
         })

      }

      if (validate) {
         Alert({
            title: '¡Atención!',
            content: 'Se han realizado modificaciones que no han sido guardadas, ¿Desea guardar antes de continuar?',
            confirmText: 'Si, Guardar y continuar',
            cancelText: 'Cancelar',
            action,
         })

         return
      }

      action()

   }

   // abre el modal de detenciones y valida si hay modificaciones sin guardar
   const handleOpenModalTimer = () => {

      const validate = validateMod()

      const action = async () => {

         if (validate) await onSave()

         toggleModalTimer(true)

      }

      if (validate) {
         Alert({
            title: '¡Atención!',
            content: 'Se han realizado modificaciones que no han sido guardadas, ¿Desea guardar antes de continuar?',
            confirmText: 'Si, Guardar y continuar',
            calcelText: 'Cancelar',
            action
         })
         return
      }

      action()

   }

   // abre el modal de editar o agrregar nota y valida si hay modificaciones sin guardar
   const handleOpenModalAddOrEdit = (isAddOrEdit) => {

      const validate = validateMod()

      const action = async () => {

         if (validate) await onSave()

         isAddOrEdit ? toggleModalAdd(true) : toggleModalEdit(true)

      }

      if (validate) {
         Alert({
            title: '¡Atención!',
            content: 'Se han realizado modificaciones que no han sido guardadas, ¿Desea guardar antes de continuar?',
            confirmText: 'Si, Guardar y continuar',
            calcelText: 'Cancelar',
            action
         })
         return
      }

      action()

   }

   const handleCancel = () => {

      const validate = validateMod()

      const action = async () => {

         navigate(routes.activity, { replace: true })

      }

      if (validate) {
         Alert({
            title: '¡Atención!',
            content: 'Se han realizado modificaciones que no han sido guardadas, si continua estas se perderan, ¿Desea continuar?',
            confirmText: 'Si y continuar',
            cancelText: 'Volver',
            action
         })

         return
      }

      action()

   }

   // cambia el estado de la actividad de pendiente a en trabajo, asigna un tiempo estimado
   // ademas valida antes de hacer la accion si hay modificaciones sin guardar
   const handleRunActivityPending = () => {

      const userAbrev = users.find(u => u.id === user.id).label

      const playValidate = activity.encargado_actividad !== userAbrev

      const action = () => {

         const validate = validateMod()

         const callback = async () => {

            try {
               const resp = await fetchToken('task/get-times')
               const body = await resp.json()

               if (body.ok) {

                  const userState = body.tiempos.find(item => item.usuario === userAbrev).estado

                  if (userState) {
                     Alert({
                        icon: 'warn',
                        title: 'Atención',
                        content: 'Actualemnte el encargado de esta actividad cuenta con una actividad en la cual esta trabajando </br> ¿Desea poner en marcha igualemnte esta actividad?',
                        confirmText: 'si, poner en marcha',
                        cancelText: 'no, cancelar',
                        action: async () => {

                           if (validate) await onSave()

                           runActivityPending({ tiempo_estimado })
                        }
                     })
                     return
                  }

                  if (validate) await onSave()

                  runActivityPending({ tiempo_estimado })

               }
            } catch (error) {
               console.log('getTimes error: ', error)
            }

         }

         if (validate) {
            Alert({
               title: '¡Atención!',
               content: 'Se han realizado modificaciones que no han sido guardadas, si continua estas se perderan, ¿Desea continuar?',
               confirmText: 'Si y continuar',
               cancelText: 'Volver',
               action: () => callback()
            })

            return
         }

         callback()

      }

      if (playValidate) {
         Alert({
            icon: 'warn',
            title: 'Atención',
            content: `No eres el encargado de esta actividad </br> ¿Deseas poner en marcha igualmente esta actividad?`,
            confirmText: 'si, poner en marcha',
            cancelText: 'no, cancelar',
            action
         })

         return
      }

      action()

   }

   useEffect(() => {
      if (Object.keys(activity).length > 0) {
         setFields({
            ...fields,
            title: activity?.actividad ?? 'Sin titulo',
            description: activity?.func_objeto ?? '',
            gloss: activity?.glosa_explicativa ?? '',
            ticket: activity?.num_ticket_edit ?? '',
            priority: activity?.num_prioridad ?? '',
            time: activity?.tiempo_estimado ?? '',
         })

         setOptions({
            pr: projects?.find(p => p.value === activity.id_proy),
            sp: subProjects?.find(s => s.value === activity.id_sub_proyecto) || initOptions.sp,
            us: users?.find(u => u.label === activity.user_solicita),
            ue: users?.find(u => u.label === activity.encargado_actividad),
            ur: users?.find(u => u.id === activity.id_revisor),
            ptc: initOptions.ptc
         })

         setTimeValues(
            detentions?.map(d => {
               return {
                  id: d.id_pausa,
                  fecha_detencion: d.fecha_detencion,
                  fecha_inicio: d.fecha_inicio,
                  hora_detencion: d.hora_detencion,
                  hora_inicio: d.hora_inicio,
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

   useEffect(() => {

      setOptionDetentions(detentions.map(d => {
         return {
            id: d.id_pausa,
            tipo_pausa: d.id_tipo_pausa,
         }
      }))


   }, [detentions])

   return (
      <>
         {Object.keys(activity).length > 0 && (
            <>
               <ViewContainer>
                  <View
                     title={activity.actividad}
                     priority={activity.prioridad_etiqueta}
                     type={{ desc: activity.desc_tipo_actividad, id: activity.tipo_actividad }}
                     onHigh={() => onChangePriority(100, activity.id_det)}
                     onMid={() => onChangePriority(400, activity.id_det)}
                     onLow={() => onChangePriority(600, activity.id_det)}
                     onNone={() => onChangePriority(1000, activity.id_det)}
                     id={activity.id_det}
                     idFather={activity.id_det_padre}
                     isChildren={activity.es_hijo === 1 && activity.es_padre === 0}
                     isFather={isFather}
                     isChildrenAndChildren={activity.es_hijo === 1 && activity.es_padre === 1}
                     isCoorActivity={activity.id_tipo_actividad === 4}
                     isReviewedActivity={activity.id_tipo_actividad === 2}
                     isDeliveryActivity={activity.id_tipo_actividad === 3}
                     isTicket={activity.num_ticket_edit > 0}
                     isPR={type_detail === 'pr'}
                     validateMod={validateMod}
                     callback={onSave}
                     lastDetention={activity.pausas}
                     {...activity}
                  >

                     {type_detail !== 'pr' &&
                        <AlertBar
                           validation={validation().isSave}
                           isCustom={options?.ur?.id !== options?.ue?.id}
                           customMsg='Revisor y Encargado no pueden ser asignados a la misma persona'
                           position='top-20'
                        />
                     }

                     <Button
                        hidden={activity.es_padre === 0}
                        className='bg-slate-100 hover:bg-slate-200 mx-auto'
                        onClick={() => setShowChilds(!showChilds)}
                     >
                        {showChilds ? 'Ocultar actividades Hijas' : 'ver actividades Hijas'}
                        <i className='fas fa-child' />
                     </Button>

                     {showChilds &&
                        <ChildContainer data={activity.familyTree} {...activity} />
                     }

                     <ViewSection lg cols={8}>

                        <aside className='col-span-1 md:col-span-2'>
                           <header className='text-sm'>
                              <P tag='ID' value={activity.id_det} />
                              <P
                                 tag='Ticket'
                                 value={activity.num_ticket_edit}
                              />
                              <P
                                 tag='Creación'
                                 value={moment(activity.fecha_tx).format(
                                    'DD/MM/YYYY'
                                 )}
                              />
                              {/* <P
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
                                 tag='Solicita'
                                 value={activity.user_solicita}
                              /> */}
                              <P
                                 tag='Estado'
                                 value={
                                    activity.estado === 1
                                       ? ' pendiente'
                                       : ' en trabajo'
                                 }
                              />
                              <P
                                 tag='Transcurridos'
                                 value={
                                    moment(date).diff(TODAY, 'days') -
                                    moment(date).diff(TODAY, 'days') * 2
                                 }
                              />
                              {/* <P
                                 tag='Prioridad'
                                 value={
                                    <>
                                       <span
                                          className={`h-4 w-4 rounded-full mx-1 inline-block align-middle ${userStyles.styles}`}
                                       />
                                       {userStyles.priority} ({activity.num_prioridad})
                                    </>
                                 }
                              /> */}

                              <span
                                 className={`
                                    px-3 py-0.5 rounded-full font-semibold mt-3 block w-max
                                    ${activity.prioridad_etiqueta === 1000
                                       ? 'bg-slate-200 text-slate-600'
                                       : activity.prioridad_etiqueta === 600
                                          ? 'text-green-700 bg-green-100'
                                          : activity.prioridad_etiqueta === 400
                                             ? 'text-yellow-600 bg-yellow-100'
                                             : activity.prioridad_etiqueta === 100 && 'text-red-500 bg-red-100'
                                    }
                                 `}
                              >

                                 Prioridad: {activity.num_prioridad}
                              </span>

                              <span className='px-2 py-0.5 font-semibold rounded-full text-sm mt-2 block w-max bg-orange-100 text-orange-500'>
                                 Tipo: {activity.desc_tipo_actividad}
                              </span>
                           </header>

                           <hr className='my-5' />

                           <section className='grid gap-2'>
                              <CloneSelect
                                 isDefaultOptions
                                 isRequired={type_detail !== 'pr'}
                                 disabled={type_detail === 'pr'}
                                 field='Proyecto'
                                 options={projects}
                                 value={options.pr}
                                 onChange={option =>
                                    setOptions({ ...options, pr: option, sp: initOptions.sp })
                                 }
                              />
                              <CloneSelect
                                 isDefaultOptions
                                 disabled={type_detail === 'pr'}
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
                                 isRequired={type_detail !== 'pr'}
                                 disabled={type_detail === 'pr'}
                                 field='Solicita'
                                 options={users}
                                 value={options.us}
                                 onChange={option =>
                                    setOptions({ ...options, us: option })
                                 }
                              />
                              <CloneSelect
                                 isDefaultOptions
                                 isRequired={type_detail !== 'pr'}
                                 disabled={type_detail === 'pr'}
                                 field='Encargado'
                                 options={users}
                                 value={options.ue}
                                 onChange={option =>
                                    setOptions({ ...options, ue: option })
                                 }
                              />
                              <CloneSelect
                                 hidden={activity.id_tipo_actividad === 4 || activity.id_tipo_actividad === 3}
                                 isDefaultOptions
                                 isRequired={type_detail !== 'pr'}
                                 disabled={type_detail === 'pr'}
                                 field='Revisor'
                                 options={users}
                                 value={options.ur}
                                 onChange={option =>
                                    setOptions({ ...options, ur: option })
                                 }
                              />
                           </section>
                        </aside>

                        <section className='col-span-1 md:col-span-3 grid mt-2 lg:mt-0 gap-2'>
                           <Input
                              disabled={type_detail === 'pr'}
                              isRequired={type_detail !== 'pr'}
                              highlight
                              field='título'
                              value={title}
                              onChange={e =>
                                 setFields({ ...fields, title: e.target.value })
                              }
                           />
                           <TextArea
                              disabled={type_detail === 'pr'}
                              isRequired={type_detail !== 'pr'}
                              highlight
                              field='descripción'
                              value={description}
                              onChange={e =>
                                 setFields({
                                    ...fields,
                                    description: e.target.value,
                                 })
                              }
                           />
                           <TextArea
                              disabled={type_detail === 'pr'}
                              highlight
                              field='glosa'
                              value={gloss}
                              onChange={e =>
                                 setFields({ ...fields, gloss: e.target.value })
                              }
                           />
                           <div className='grid grid-cols-1 lg:grid-cols-3 gap-2'>
                              <Input
                                 disabled={type_detail === 'pr'}
                                 highlight
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
                                 highlight
                                 disabled={type_detail === 'pr'}
                                 isRequired={type_detail !== 'pr'}
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
                                 highlight
                                 disabled={type_detail === 'pr'}
                                 isRequired={type_detail !== 'pr'}
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

                        <aside className='col-span-1 md:col-span-3 mt-5 lg:mt-0'>

                           <div className='flex justify-between items-center mb-3'>

                              <h5 className='text-sm font-semibold'>Notas (Informes)</h5>

                              {type_detail !== 'pr' &&
                                 <section className='flex gap-2'>

                                    <Button
                                       className='text-slate-600 bg-slate-100 hover:bg-slate-200'
                                       onClick={() => handleOpenModalAddOrEdit(true)}>
                                       <i className='fas fa-plus' />
                                    </Button>

                                    <Button
                                       disabled={activity?.notas?.length === 0}
                                       className='text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:hover:bg-slate-200/50'
                                       onClick={() => handleOpenModalAddOrEdit(false)}>
                                       <i className='fas fa-pen' />
                                    </Button>

                                 </section>
                              }

                           </div>

                           <ul className='max-h-[540px] overflow-custom'>
                              {activity?.notas?.length > 0 && activity?.notas !== undefined ?
                                 activity?.notas?.map((note, i) => (

                                    <li
                                       key={note.id_nota}
                                       className='bg-black/5 rounded-lg py-1.5 px-3 mr-1.5 mb-2.5 shadow-md shadow-gray-400/20 hover:bg-black/10 transition duration-200 relative'>
                                       {/* <i className='fas fa-list-ul mr-2' /> */}

                                       <section className='flex justify-between gap-2'>

                                          <span className='text-sm  font-semibold'>
                                             {i + 1}. Creado por: {note.usuario.abrev_user}
                                          </span>

                                          <span className='text-xs text-zinc-500/80 flex gap-2 items-center'>
                                             {moment(note.fecha_hora_crea).format('DD-MM-yyyy, HH:MM')}
                                             {user.id !== note.usuario.id_user &&
                                                <i className='fas fa-bell fa-sm' />
                                             }
                                          </span>

                                       </section>

                                       <p className='text-sm text-zinc-500/80 px-2'>
                                          {note.desc_nota}
                                       </p>

                                    </li>

                                 ))
                                 :
                                 <li className='text-sm text-slate-400 ml-2'>
                                    No hay notas...
                                 </li>
                              }
                           </ul>

                        </aside>
                     </ViewSection>

                     <hr className='my-5' />

                     <ViewSection md cols={2}>
                        <aside>
                           <h5 className='text-sm mb-3 font-semibold flex gap-2'>
                              Archivos:
                              <span className='font-normal text-zinc-500'>(Para guardar un archivo debes agregar una descripción)</span>
                           </h5>
                           <ul className='h-28 overflow-custom border-x p-1.5'>
                              {activity?.tarea_documentos?.length > 0 ? (
                                 activity?.tarea_documentos?.map((file, i) => (
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
                                          hidden={type_detail === 'pr'}
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
                           {type_detail !== 'pr' &&
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
                           }
                        </aside>

                        <aside>
                           <h5 className='text-sm mb-5 text-center font-semibold'>
                              Tiempos de la actividad:
                           </h5>

                           <div className={`
                                 grid content-center place-content-center
                                 ${type_detail === 'pr' ? 'grid-cols-2' : 'grid-cols-3'}
                              `}
                           >
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
                                    refresh={activity}
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

                              {type_detail !== 'pr' &&
                                 <TimerContainer
                                    subtitle='hoy'
                                    color={
                                       activity.estado_play_pausa === 2 ? 'red' : 'green'
                                    }>
                                    <Timer
                                       pause={activity.estado_play_pausa === 2}
                                       refresh={activity}
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
                              }
                           </div>

                           <div className='flex justify-center mt-5 '>
                              <Button
                                 hidden={detentions.length === 0}
                                 className='bg-orange-50 hover:bg-orange-100 text-orange-500'
                                 onClick={handleOpenModalTimer}
                              >
                                 <i className='far fa-clock' />

                                 {type_detail !== 'pr' ? 'Modificar tiempos' : 'Ver Tiempos'}

                              </Button>
                           </div>

                        </aside>
                     </ViewSection>

                     {type_detail !== 'pr' &&
                        <ViewFooter>
                           <section className='flex gap-1 items-center'>

                              <Menu
                                 direction='top'
                                 align='start'
                                 menuButton={
                                    <MenuButton
                                       className='flex items-center gap-3 bg-slate-100 hover:bg-slate-200/60 text-slate-600 disabled:text-opacity-40 px-2 h-9 rounded-lg font-semibold transition duration-200 disabled:line-through disabled:cursor-not-allowed disabled:bg-slate-50'
                                       disabled={validation().isSave}
                                    >
                                       <i className='fas fa-bars' />
                                       Acciones
                                    </MenuButton>
                                 }>
                                 <MenuItem
                                    className='flex justify-between items-center gap-2 border-y border-zinc-200/60'
                                    onClick={() =>
                                       deleteActivity({
                                          id_actividad: activity.id_det,
                                          encargado: optionsArray.users.find(ou => ou.label === activity.encargado_actividad),
                                          isFather,
                                          isTicket
                                       })
                                    }
                                 >
                                    Eliminar
                                    <i className='fas fa-trash text-red-400' />
                                 </MenuItem>

                                 {(activity.id_tipo_actividad !== 3) &&
                                    <MenuItem
                                       className='flex justify-between items-center gap-2 border-b border-zinc-200/60'
                                       onClick={openModalClone}
                                    >
                                       Clonar
                                       <i className='fas fa-clone text-zinc-600' />
                                    </MenuItem>
                                 }

                                 {isTicket &&
                                    <MenuItem
                                       className='flex justify-between items-center gap-2 border-b border-zinc-200/60'
                                    >
                                       <a
                                          className='w-full flex items-center justify-between gap-2'
                                          target='_blank'
                                          rel='noreferrer'
                                          title='Tickets (Eventos)'
                                          href={`https://tickets.zproduccion.cl/#/in/${activity.num_ticket_edit}`}>
                                          Ticket
                                          <i className='fas fa-ticket-alt text-blue-400' />
                                       </a>
                                    </MenuItem>
                                 }

                                 {!(activity.estado !== 2 || activity.id_tipo_actividad !== 1 || (isFather && isTicket)) &&
                                    <MenuItem
                                       className='flex justify-between items-center gap-2 border-b border-zinc-200/60'
                                       onClick={handleOpenModalRevision}
                                    >
                                       Para Revisión
                                       <i className='fas fa-eye text-orange-400' />
                                    </MenuItem>
                                 }

                                 {!((activity.id_tipo_actividad === 1 && !isFather) || activity.estado === 1 || !isTicket) &&
                                    <MenuItem
                                       className='flex justify-between items-center gap-2 border-b border-zinc-200/60'
                                       onClick={() => finishActivity(activity.id_tipo_actividad, isFather)}
                                    >
                                       {isFather ? 'Terminar' : 'Procesar'}
                                       <i className='fas fa-check-double text-indigo-400' />
                                    </MenuItem>
                                 }
                              </Menu>

                              <Button
                                 disabled={validation().isSave}
                                 hidden={activity.estado === 1 || (activity.es_padre === 1 && activity.es_hijo === 0 && isTicket)}
                                 className={
                                    activity.estado_play_pausa === 2
                                       ? 'text-red-400 bg-red-50 hover:bg-red-100'
                                       : 'text-emerald-400 bg-emerald-50 hover:bg-emerald-100'
                                 }
                                 title={activity.estado_play_pausa === 2 ? 'Pausar' : 'Reanudar'}
                                 onClick={handleOnPlayPause}>
                                 <i
                                    className={
                                       activity.estado_play_pausa === 2
                                          ? 'fas fa-pause fa-sm'
                                          : 'fas fa-play fa-sm'
                                    }
                                 />
                              </Button>

                              <FloatMenu
                                 disabled={validation().isSave}
                                 hidden={activity.estado === 2 || (isFather && isTicket)}
                                 size='w-11 h-9'
                                 className='bg-slate-100 hover:bg-slate-200/60 text-slate-600'
                                 name='tiempo_estimado'
                                 value={tiempo_estimado}
                                 onChange={onChangeValues}
                                 onClick={handleRunActivityPending}
                                 reset={reset}
                              />

                           </section>

                           <section className='flex justify-end gap-2'>
                              <Button
                                 className='text-red-500 hover:bg-red-100 disabled:hover:bg-transparent'
                                 onClick={handleCancel}>
                                 Cancelar
                              </Button>
                              <Button
                                 disabled={validation().isSave || !validateMod(true).res}
                                 className='text-emerald-500 hover:bg-emerald-100 place-self-end disabled:hover:bg-transparent'
                                 onClick={onSave}>
                                 Guardar
                              </Button>
                           </section>
                        </ViewFooter>
                     }
                  </View>
               </ViewContainer>

               {/* modal reject */}
               {modalReject &&
                  <Modal
                     showModal={modalReject}
                     isBlur={false}
                     onClose={onCloseModals}
                     className='max-w-xl'
                     padding='p-4 md:p-6'
                     title='Terminar actividad de entrega'>

                     <div>

                        <p className='text-center mt-10'>
                           ¿La actividad fue aprobada o rechazada por el cliente?
                        </p>

                        <section className='flex justify-around mt-5 w-80 mx-auto'>

                           <Switch
                              value={sw.a.value}
                              name='Aprobada'
                              onChange={(value) => setSw({ a: { ...sw.a, value }, b: { ...sw.b, value: false } })}
                           />

                           <Switch
                              value={sw.b.value}
                              name='Rechazada'
                              onChange={(value) => setSw({ a: { ...sw.a, value: false }, b: { ...sw.b, value } })}
                           />

                        </section>

                        <section className='flex justify-between mt-10'>
                           <Button
                              className='text-red-500 hover:bg-red-100'
                              onClick={onCloseModals}>
                              Cancelar
                           </Button>
                           <Button
                              className='text-emerald-500 hover:bg-emerald-100'
                              onClick={handleFinshDeliveryActivity}>
                              terminar actividad
                           </Button>
                        </section>
                     </div>
                  </Modal>}

               {/* modal PR */}
               {modalPR &&
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
                              isNumber
                           />

                           <Input
                              field='Tiempo Zionit  (hrs)'
                              name='tiempo_zionit'
                              value={tiempo_zionit}
                              onChange={onChangeValues}
                              isNumber
                           />

                           <div className='mt-2 text-center'>
                              <h5 className='text-xs mb-2.5'>Tiempo Total  (hrs)</h5>
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
                              onClick={handleUpdateActivityState}>
                              pasar a revisión
                           </Button>
                        </section>
                     </div>
                  </Modal>}

               {/* modal detentions */}
               {modalTimer &&
                  <Modal
                     showModal={modalTimer}
                     isBlur={false}
                     onClose={onCloseModals}
                     className='max-w-7xl'
                     padding='p-4 md:p-6'
                     title={type_detail !== 'pr'
                        ? `Detenciones de actividad ${activity.id_det}`
                        : `Detenciones de actividad ${activity.id_det}`
                     }
                  >

                     <div className='grid gap-1 mt-10 w-[1216px] pr-6 xl:pr-0 overflow-auto'>

                        <Box
                           colCount={type_detail !== 'pr' ? 8 : 7}
                           className='bg-zinc-100'
                           isBlock
                        >

                           <Span />

                           <Span colCount={2}>desde</Span>

                           <Span colCount={2}>hasta</Span>

                           <Span colCount={type_detail !== 'pr' ? 2 : 3} >control</Span>

                        </Box>

                        <Box
                           colCount={type_detail !== 'pr' ? 8 : 7}
                           className='bg-zinc-100'
                           isBlock
                        >

                           <Span>Nº</Span>

                           <Span>fecha</Span>

                           <Span>hora</Span>

                           <Span>fecha</Span>

                           <Span >hora</Span>

                           <Span >tipo pausa</Span>

                           <Span>tiempo (hrs)</Span>

                        </Box>

                        <Box
                           hidden={type_detail === 'pr'}
                           colCount={type_detail !== 'pr' ? 8 : 7}
                           isBlock
                        >

                           <Span>Nueva detención</Span>

                           <Input
                              className='my-2'
                              padding='py-1.5 px-2'
                              type='date'
                              name='finicio'
                              value={finicio}
                              onChange={onChangeValues}
                           />

                           <InputMask
                              mask='99:99:99'
                              maskChar=''
                              name='hinicio'
                              value={hinicio}
                              onChange={onChangeValues}>
                              {inputProps => (
                                 <Input
                                    className='my-2'
                                    placeholder='ej: hh:mm:ss'
                                    name={inputProps.name}
                                    onChange={inputProps.onChange}
                                    value={inputProps.value}
                                 />
                              )}
                           </InputMask>

                           <Input
                              className='my-2'
                              type='date'
                              padding='py-1.5 px-2'
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
                                    className='my-2'
                                    placeholder='ej: hh:mm:ss'
                                    name={inputProps.name}
                                    onChange={inputProps.onChange}
                                    value={inputProps.value}
                                 />
                              )}
                           </InputMask>

                           <CustomSelect
                              isDefaultOptions
                              options={pause_type}
                              value={options.ptc}
                              onChange={option => setOptions({ ...options, ptc: option })}
                           />

                           <Span>
                              {moment(`${fdetencion} ${hdetencion}`).isValid() && moment(`${finicio} ${hinicio}`).isValid() ?
                                 <NumberFormat
                                    value={moment(`${fdetencion} ${hdetencion}`).diff(moment(`${finicio} ${hinicio}`), 'hours', true)}
                                    decimalScale={4}
                                    fixedDecimalScale={false}
                                    displayType='text'
                                 />
                                 : 0
                              }
                           </Span>

                           {type_detail !== 'pr' &&
                              <Button
                                 className='bg-emerald-100 hover:bg-emerald-200 text-emerald-500 mx-auto'
                                 onClick={handleCreateDetention}>
                                 agregar
                              </Button>
                           }
                        </Box>

                        {type_detail !== 'pr' &&

                           <section className='flex items-center gap-2'>
                              <h5 className='py-3 px-3'>Detenciones</h5>

                              <p className='bg-orange-100 text-orange-400 px-3 font-semibold py-0.5 rounded-full'>ATENCION: Debe guardar cambios linea por linea</p>

                           </section>
                        }

                        <div className='max-h-72 overflow-custom grid gap-1'>

                           {detentions.length > 0 && optionDetentions.length === detentions.length &&
                              detentions.map((d, i) => (

                                 <Box
                                    colCount={type_detail !== 'pr' ? 8 : 7}
                                    isBlock
                                    key={d.id_pausa}
                                 >

                                    <Numerator className='mx-auto' number={i + 1} />

                                    <Input
                                       disabled={type_detail === 'pr'}
                                       className='my-2'
                                       padding='py-1.5 px-2'
                                       type='date'
                                       value={timeValues[i]?.fecha_inicio || ''}
                                       onChange={e =>
                                          setTimeValues(
                                             timeValues.map(t => {
                                                if (t.id === d.id_pausa) {
                                                   return { ...t, fecha_inicio: e.target.value }
                                                }
                                                return t
                                             }))
                                       }
                                    />

                                    <InputMask
                                       mask='99:99:99'
                                       maskChar=''
                                       value={timeValues[i]?.hora_inicio || ''}
                                       readOnly={type_detail === 'pr'}
                                       onChange={e =>
                                          setTimeValues(
                                             timeValues.map(t => {
                                                if (t.id === d.id_pausa) {
                                                   return { ...t, hora_inicio: e.target.value }
                                                }
                                                return t
                                             }))
                                       }
                                    >
                                       {inputProps => (
                                          <Input
                                             disabled={inputProps.readOnly}
                                             className='my-2'
                                             onChange={inputProps.onChange}
                                             value={inputProps.value}
                                          />
                                       )}
                                    </InputMask>

                                    <Input
                                       disabled={type_detail === 'pr'}
                                       className='my-2'
                                       padding='py-1.5 px-2'
                                       type='date'
                                       value={timeValues[i]?.fecha_detencion || ''}
                                       onChange={e =>
                                          setTimeValues(
                                             timeValues.map(t => {
                                                if (t.id === d.id_pausa) {
                                                   return { ...t, fecha_detencion: e.target.value }
                                                }
                                                return t
                                             }))
                                       }
                                    />

                                    <InputMask
                                       mask='99:99:99'
                                       maskChar=''
                                       value={timeValues[i]?.hora_detencion || ''}
                                       readOnly={type_detail === 'pr'}
                                       onChange={e =>
                                          setTimeValues(
                                             timeValues.map(t => {
                                                if (t.id === d.id_pausa) {
                                                   return { ...t, hora_detencion: e.target.value }
                                                }
                                                return t
                                             }))
                                       }
                                    >
                                       {inputProps => (
                                          <Input
                                             disabled={inputProps.readOnly}
                                             className='my-2'
                                             onChange={inputProps.onChange}
                                             value={inputProps.value}
                                          />
                                       )}
                                    </InputMask>

                                    <CustomSelect
                                       isDefaultOptions
                                       options={pause_type}
                                       value={pause_type.find(pt => pt.value === optionDetentions[i].tipo_pausa) || { value: null, label: 'ninguno' }}
                                       onChange={option => {
                                          setOptionDetentions(optionDetentions.map(od => {
                                             if (od.id === d.id_pausa) {
                                                return { ...od, tipo_pausa: option.value }
                                             }
                                             return od
                                          }))
                                       }}
                                    />

                                    <Span>
                                       {moment(`${d.fecha_detencion} ${d.hora_detencion}`).isValid() && moment(`${d.fecha_inicio} ${d.hora_inicio}`).isValid() &&
                                          <NumberFormat
                                             value={moment(`${d.fecha_detencion} ${d.hora_detencion}`).diff(moment(`${d.fecha_inicio} ${d.hora_inicio}`), 'hours', true)}
                                             decimalScale={4}
                                             fixedDecimalScale={false}
                                             displayType='text'
                                          />
                                       }
                                    </Span>

                                    {type_detail !== 'pr' &&
                                       <div className='flex justify-center gap-2'>

                                          <Button
                                             disabled={!moment(`${d.fecha_detencion} ${d.hora_detencion}`).isValid()}
                                             className='bg-emerald-100 hover:bg-emerald-200 text-emerald-500 disabled:hover:bg-emerald-200/50'
                                             onClick={() =>
                                                handleUpdateDetention({
                                                   id_pausa: d.id_pausa,
                                                   fecha_inicio: timeValues[i]?.fecha_inicio,
                                                   fecha_detencion: timeValues[i]?.fecha_detencion,
                                                   hora_inicio: timeValues[i]?.hora_inicio,
                                                   hora_detencion: timeValues[i]?.hora_detencion,
                                                   tipo_pausa: optionDetentions[i].tipo_pausa
                                                })
                                             }
                                          >
                                             <i className='fas fa-check' />
                                          </Button>

                                          <Button
                                             disabled={!moment(`${d.fecha_detencion} ${d.hora_detencion}`).isValid()}
                                             className='bg-red-100 hover:bg-red-200 text-red-500 disabled:hover:bg-red-200/50'
                                             onClick={() => handleDeleteDetention(d.id_pausa)}
                                          >
                                             <i className='fas fa-trash' />
                                          </Button>

                                       </div>
                                    }
                                 </Box>
                              ))}
                        </div>
                     </div>
                  </Modal>}

               {/* modal edit */}
               {modalEdit &&
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
                                    className={`flex items-center justify-between bg-black/5 rounded-lg py-1.5 px-3 mr-1.5 cursor-pointer shadow-md shadow-gray-400/20 mb-1.5 hover:bg-black/10 transition duration-200 ${values.id === note.id_nota &&
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
                           onClick={onUpdateNote}>
                           modificar nota
                        </Button>
                     </div>
                  </Modal>}

               {/* modal add */}
               {modalAdd &&
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
                           onClick={onAddNote}>
                           crear nota
                        </Button>
                     </div>
                  </Modal>}

               {/* modal pause */}
               {modalPause &&
                  <Modal
                     showModal={modalPause}
                     isBlur={false}
                     onClose={onCloseModals}
                     className='max-w-2xl'
                     padding='p-4 md:p-6'
                     title={`Pausar actividad: ${activity.actividad}, ${activity.id_det}`}
                  >

                     <div className='grid gap-5'>
                        <h5 className='text-sm'>Descripcion actividad: </h5>
                        <p className='text-sm whitespace-pre-wrap max-h-44 overflow-custom p-1.5 rounded-lg bg-black/5'>
                           {values.content}
                        </p>

                        <CustomSelect
                           label='Tipo de pausa'
                           options={optionsArray?.pause_type}
                           isDefaultOptions
                           value={options?.pt}
                           onChange={(option) => setOptions({ ...options, pt: option })}
                        />

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
                                    onClick={() => onPause({ isDefaultPause: true, mensaje: pause.desc })}>
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
                              onClick={() => onPause({ isDefaultPause: false })}>
                              Pausar actividad
                           </Button>
                        </footer>
                     </div>

                  </Modal>}

               {/* modal clone */}
               {modalClone &&
                  <Modal
                     showModal={modalClone}
                     isBlur={false}
                     onClose={onCloseModals}
                     padding='p-4 md:p-6'
                     title={`Clonar actividad: ${activity.id_det}, ${activity.actividad || 'Sin titulo'
                        }`}>

                     <AlertBar
                        validation={validation().isClone}
                        isCustom={cloneOptions?.ur?.id !== cloneOptions?.ue?.id}
                        customMsg='Revisor y Encargado no pueden ser asignados a la misma persona'
                     />

                     <div className='grid gap-5'>

                        <header className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                           <aside className='flex-row space-y-2'>

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
                                 field='Solicita'
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
                                 hidden={cloneOptions?.ta?.value !== 1}
                                 isRequired={cloneOptions?.ta?.value === 1}
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

                              <div className='border-2 border-amber-200 rounded p-0.5 mb-3'>
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
                                 highlight
                                 className='mb-3'
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
                                 highlight
                                 className='mb-3'
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
                                 highlight
                                 className='mb-3'
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
                                 highlight
                                 className='mb-3'
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
                              field='descripción'
                              highlight
                              isRequired
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
                  </Modal>}
            </>
         )}
      </>
   )
}

export default Detail
