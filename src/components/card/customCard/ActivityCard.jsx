import { useContext, useState } from 'react'
import { ActivityContext } from '../../../context/ActivityContext'
import { useNavigate } from 'react-router-dom'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import { validatePredecessor } from '../../../helpers/helpersFunc'
import { useForm } from '../../../hooks/useForm'
import { Alert } from '../../../helpers/alerts'
import Modal from '../../ui/Modal'
import TextArea from '../../ui/TextArea'
import Button from '../../ui/Button'
import P from '../../ui/P'
import Card from '../Card'
import CardSection from '../CardSection'
import CardFooter from '../CardFooter'
import CardContent from '../CardContent'
import FloatMenu from '../../ui/FloatMenu'
import moment from 'moment'
import { fetchToken } from '../../../helpers/fetch'
import Tag from '../../ui/Tag'
import CustomSelect from '../../ui/CustomSelect'
import { UiContext } from '../../../context/UiContext'
import Select from 'react-select'
import AlertBar from '../../ui/AlertBar'
import Input from '../../ui/Input'
import { useDetail } from '../../../hooks/useDetail'
import NumberFormat from 'react-number-format'

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

const initOptionsAct = {
   pr: { value: 0, label: 'ninguno' },
   sp: { value: 0, label: 'ninguno' },
   ur: { value: 0, label: 'ninguno' },
   us: { value: 0, label: 'ninguno' },
   ue: { value: 0, label: 'ninguno' },
   ta: { value: 0, label: 'ninguno' },
}

const CloneSelect = ({ options, value, onChange, field, isRequired = false, isDefaultOptions = true, disabled = false, hidden = false }) => {

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

const ActivityCard = props => {
   const {
      addDefaultNote,
      addNote,
      updateNote,
      deleteNote,
      deleteActivity,
      lowPriority,
      mediumPriority,
      highPriority,
      noPriority,
      toggleState,
      numberCard,
      playActivity,
      pauseActivity,
      estado,
      estado_play_pausa,
      prioridad_etiqueta,
      fecha_tx,
      notas,
   } = props

   const navigate = useNavigate()

   const { cloneActivity } = useDetail(null)

   const { optionsArray, user, filters, saveFilters } = useContext(ActivityContext)
   const { idSelect, setIdSelect } = useContext(UiContext)

   const [files, setFiles] = useState(null)

   const [{ desc, time }, onChangeValues, reset] = useForm({
      desc: '',
      time: props.tiempo_estimado,
   })

   const [
      { desc_act, gloss_act, title_act, prio_act, time_act },
      onChangeValuesAct,
      resetAct,
      handlePresetActValues
   ] =
      useForm({
         desc_act: '',
         gloss_act: '',
         title_act: '',
         prio_act: '150',
         time_act: '1'
      })

   const [values, setValues] = useState({ desc: '', id: null })
   const [options, setOptions] = useState({ value: null, label: 'ninguno' })
   const [actOptions, setActOptions] = useState(initOptionsAct)

   // modals
   const [modalEdit, toggleModalEdit] = useState(false)
   const [modalAdd, toggleModalAdd] = useState(false)
   const [modalPause, toggleModalPause] = useState(false)
   const [modalClone, toggleModalClone] = useState(false)

   // variables
   // const ESTADO_PAUSA = estado === 1
   const ESTADO_play = estado_play_pausa === 2
   const isFather = props.es_padre === 1 && props.es_hijo === 0
   const isChildren = props.es_hijo === 1 && props.es_padre === 0
   const isChildrenAndFather = props.es_hijo === 1 && props.es_padre === 1
   const isChildrenAndFatherAndCoor = props.es_hijo === 1 && props.es_padre === 1 && props.id_tipo_actividad === 4
   const isReviewedActivity = props.id_tipo_actividad === 2
   const isCoorActivity = props.id_tipo_actividad === 4
   const isDeliveryActivity = props.id_tipo_actividad === 3
   const isTicket = props.num_ticket_edit > 0
   const isRestricted = props.predecesoras.length > 0

   const onCloseModals = () => {
      reset()
      resetAct()
      toggleModalEdit(false)
      toggleModalAdd(false)
      toggleModalPause(false)
      toggleModalClone(false)
      setValues({ desc: '', id: null })
      setOptions({ value: null, label: 'ninguno' })
      setActOptions(initOptionsAct)
      setFiles(null)
   }

   const handleNavigate = () => {
      navigate(`detalle-actividad/${props.id_det}`, { replace: false })
   }

   const handleUpdateState = () => {

      const userAbrev = optionsArray.users.find(u => u.id === user.id).label

      const playValidate = props.encargado_actividad !== userAbrev

      const action = () => {

         if (Number(time) <= 0) {
            Alert({
               icon: 'warn',
               title: 'Atencion',
               content:
                  'Ingrese un tiempo estimado valido (Campo no debe estar vacio ni debe ser 0)',
               showCancelButton: false,
            })
            return
         }

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
                        content: 'Actualemnte el encargado de esta actividad cuenta con una actividad en la cual esta trabajando </br> ¿Desea poner en marcha igualmente esta actividad?',
                        confirmText: 'si, poner en marcha',
                        cancelText: 'no, cancelar',
                        action: () => toggleState({ tiempo_estimado: time })
                     })
                     return
                  }

                  toggleState({ tiempo_estimado: time })

               }
            } catch (error) {
               console.log('getTimes error: ', error)
            }

         }

         validatePredecessor({
            array: props.predecesoras,
            callback,
            state: 2,
            options: optionsArray
         })

         reset()

      }

      if (playValidate) {
         Alert({
            icon: 'warn',
            title: 'Atención',
            content: `No eres el encargado de esta actividad </br> ¿Deseas ponerla en marcha igualmente?`,
            confirmText: 'si, poner en marcha',
            cancelText: 'no, cancelar',
            action
         })

         return
      }

      action()

   }

   const handleOpenModalPause = () => {

      const userAbrev = optionsArray.users.find(u => u.id === user.id).label

      const playValidate = props.encargado_actividad !== userAbrev

      if (playValidate) {
         Alert({
            icon: 'warn',
            title: 'Atención',
            content: `No eres el encargado de esta actividad </br> ¿Deseas pausarla igualmente?`,
            confirmText: 'si, pausar',
            cancelText: 'no, cancelar',
            action: () => toggleModalPause(true)
         })

         return
      }

      toggleModalPause(true)

   }

   const handlePauseActivity = ({ isDefaultPause, mensaje }) => {

      if (options.value === null) {
         Alert({
            icon: 'warn',
            title: 'Atención',
            content: 'Debe seleccionar un tipo de pausa',
            showCancelButton: false,
         })
         return
      }

      pauseActivity({
         flag: isDefaultPause,
         id_actividad: props.id_det,
         mensaje: isDefaultPause ? mensaje : values.desc,
         tipo_pausa: options.value,
      })

      onCloseModals()
   }

   const colorID = () => {

      if (idSelect === props.id_det) {
         return { color: 'bg-rose-500 text-white rounded-md px-1' }
      }

      if ((isFather || isChildrenAndFather) && isTicket) {
         return { color: 'text-amber-600 bg-amber-200/80 cursor-pointer' }
      }

      if (isFather || isChildrenAndFather) {
         return { color: 'text-indigo-600 bg-indigo-200/80 cursor-pointer' }
      }

      return { color: '' }

   }

   const openModalClone = () => {

      const data = {
         id: props.id_det,
         title: props.actividad,
         id_proy: props.id_proy,
         id_sub_proy: props.id_sub_proyecto,
         id_revisor: props.id_revisor,
         desc: props.func_objeto,
         encargado: props.encargado_actividad,
         solicita: props.user_solicita,
         ticket: props.num_ticket_edit,
         gloss: props.glosa_explicativa,
      }

      handlePresetActValues({
         desc_act: data.desc,
         gloss_act: data.gloss,
         title_act: data.title
      })

      setActOptions({
         ...actOptions,
         pr: optionsArray.projects.find(item => item.value === data.id_proy),
         sp: data.id_sub_proy !== 0 ? optionsArray.subProjects.find(item => item.value === data.id_sub_proy) : actOptions.sp,
         ur: data.id_revisor !== 0 ? optionsArray.users.find(item => item.id === data.id_revisor) : actOptions.ur,
         us: optionsArray.users.find(item => item.value === data.solicita),
         ue: optionsArray.users.find(item => item.value === data.encargado),
      })

      toggleModalClone(true)

   }

   const validation = () => {
      const vTitle = title_act.trim() === ''
      const vDesc = desc_act.trim() === ''
      const vPriority = prio_act?.toString().trim() === '' || Number(prio_act) <= 0
      const vTime = time_act?.toString().trim() === '' || Number(time_act) <= 0
      const vProject = actOptions.pr?.value === 0
      const vSolicita = actOptions.us?.value === 0
      const vEncargado = actOptions.ue?.value === 0
      const vRevisor = actOptions.ta?.value === 1 ? actOptions.ur?.value === undefined ? true : actOptions.ur?.value === 0 : false
      const vRdisE = actOptions.ta?.value === 1 ? actOptions.ur?.id === actOptions.ue?.id : false
      const vTipo_actividad = actOptions.ta?.value === 0 || actOptions.ta?.value === undefined

      const arrlabel = [
         { label: 'Título', value: vTitle },
         { label: 'Descripción', value: vDesc },
         { label: 'Prioridad', value: vPriority },
         { label: 'Tiempo', value: vTime },
         { label: 'Proyecto', value: vProject },
         { label: 'Solicita', value: vSolicita },
         { label: 'Encargado', value: vEncargado },
         { label: 'Revisor', value: vRevisor },
         { label: 'Tipo Actividad', value: vTipo_actividad },
      ]

      const filter = arrlabel.filter(item => item.value)

      const onSaveValidation =
         vTitle ||
         vDesc ||
         vPriority ||
         vTime ||
         vProject ||
         vSolicita ||
         vEncargado ||
         vRevisor ||
         vRdisE ||
         vTipo_actividad

      return {
         validation: onSaveValidation,
         values: filter
      }
   }

   const onClone = async () => {
      const formData = new FormData()
      actOptions?.pr && formData.append('proyecto', actOptions.pr.value)
      actOptions?.sp && formData.append('sub_proyecto', actOptions.sp.value)
      actOptions?.us && formData.append('solicita', actOptions.us.label)
      actOptions?.ue && formData.append('encargado', actOptions.ue.label)
      actOptions?.ta?.value === 1 && actOptions?.ur && formData.append('revisor', actOptions.ur.id)
      actOptions?.ta && formData.append('tipo_actividad', actOptions.ta.value)
      formData.append('prioridad', prio_act)
      formData.append('ticket', props.num_ticket_edit)
      formData.append('tiempo_estimado', time_act)
      formData.append('titulo', title_act)
      formData.append('descripcion', desc_act)
      formData.append('glosa', gloss_act)
      formData.append('id_actividad', props.id_det)
      files !== null && formData.append('archivos', files)

      console.log(files)

      const ok = await cloneActivity(formData)
      if (!ok) return
      saveFilters({
         payload: {
            offset: 0,
            reload: !filters.reload,
         },
      })
      onCloseModals()
   }

   return (
      <>
         <Card
            showPing={props.estado_play_pausa === 2}
            priority={props.prioridad_etiqueta}
            onDoubleClick={handleNavigate}
            isChildren={isChildren}
            isFather={isFather}
            isCoorActivity={isCoorActivity}
            isChildrenAndFather={isChildrenAndFather}
            isReviewedActivity={isReviewedActivity}
            isDeliveryActivity={isDeliveryActivity}
            isChildrenAndFatherAndCoor={isChildrenAndFatherAndCoor}
            isTicket={isTicket}
            {...props}
         >

            {isRestricted &&
               <span
                  className='h-7 w-7 flex justify-center items-center mx-auto absolute top-3 right-12'
                  title='Actividad con predecesores y restricciones'
               >
                  <i className='fas fa-link' />
               </span>
            }

            <CardContent title={props.actividad} cardNum={numberCard}>

               <CardSection colCount={3}>
                  <aside className='capitalize'>

                     <P tag='Encargado' value={props.encargado_actividad} />

                     <P tag='Prioridad' value={props.num_prioridad} />

                     <P tag='solicita' value={props.user_solicita} />

                     <P tag='revisor' value={props.abrev_revisor || '--'} />

                  </aside>

                  <section className='capitalize'>

                     <P tag='Orden' value={props?.orden || '- -'} />

                     <P tag='estado' value={optionsArray?.status?.find(st => st.value === estado).tooltip || ''} />

                     <P tag='fecha' value={moment(fecha_tx).format('DD-MM-YY')} />

                     {/* <P tag='tiempo' value={props.tiempo_trabajado.toFixed(2)} /> */}

                  </section>

                  <aside className='capitalize pl-3'>

                     <P tag='proy' value={props.abrev} />

                     <P tag='sub p' value={props.nombre_sub_proy || '- -'} />

                     {/* <span className='block text-transparent h-1.5' ></span> */}

                     <span className='flex gap-1 max-w-max rounded'>
                        <strong>ID:</strong>
                        <p className={`
                  
                              px-1 rounded font-semibold
                              ${colorID().color}
                           
                           `}
                           onClick={() => setIdSelect(props.id_det)}
                        >
                           {props.id_det}
                        </p>
                     </span>

                     <P
                        tag='ticket'
                        value={
                           props.num_ticket_edit === 0
                              ? '- -'
                              : props.num_ticket_edit
                        }
                     />

                  </aside>

               </CardSection>

               <br />

               <CardSection subtitle='descripcion'>
                  <p className='bg-black/5 whitespace-pre-wrap rounded-md p-2 overflow-custom max-h-36 mix-blend-luminosity'>
                     {props.func_objeto}
                  </p>

                  <div className='flex flex-wrap gap-3'>

                     <Tag hideIcon>
                        Tipo: {props.desc_tipo_actividad}
                     </Tag>

                     <Tag hideIcon title='tiempo trabajado'>
                        {/* Tiempo: {props?.tiempo_trabajado?.toFixed(props?.tiempo_trabajado > 0 ? 2 : 0) || '- -'} */}
                        T.T:
                        <NumberFormat
                           className='ml-1'
                           displayType='text'
                           decimalScale={2}
                           value={props?.tiempo_trabajado ?? '- -'} />
                     </Tag>

                     <Tag hideIcon title='tiempo estimado'>
                        T.E:
                        <NumberFormat
                           className='ml-1'
                           displayType='text'
                           decimalScale={2}
                           value={props?.tiempo_trabajado ?? '- -'} />
                     </Tag>

                     {props.notas.length > 0 &&
                        <Tag>
                           Tiene {props.notas.length} notas
                        </Tag>
                     }
                  </div>

               </CardSection>

            </CardContent>

            <CardFooter>
               <FloatMenu
                  hidden={estado !== 1 || (isFather && isTicket)}
                  name='time'
                  value={time}
                  onChange={onChangeValues}
                  onClick={() => {
                     reset()
                     handleUpdateState()
                  }}
                  reset={reset}
               />

               <Button
                  hidden={estado !== 2 || (isFather && isTicket)}
                  className='hover:bg-black/5'
                  size='w-7 h-7'
                  onClick={
                     ESTADO_play
                        ? () => handleOpenModalPause()
                        : () => playActivity({ id_actividad: props.id_det, encargado: props.encargado_actividad })
                  }>
                  <i
                     className={
                        ESTADO_play
                           ? 'fas fa-pause fa-sm'
                           : 'fas fa-play fa-sm'
                     }
                  />
               </Button>

               <span />

               <div>
                  <Menu
                     direction='top'
                     align='end'
                     menuButton={
                        <MenuButton className='pl-4'>
                           <i className='fas fa-ellipsis-v' />
                        </MenuButton>
                     }>
                     <MenuItem
                        className='flex justify-between items-center gap-2'
                        onClick={() => toggleModalAdd(true)}>
                        Nueva nota
                        <i className='fas fa-plus' />
                     </MenuItem>

                     <MenuItem
                        className='flex justify-between items-center gap-2'
                        disabled={notas.length === 0}
                        onClick={() => toggleModalEdit(true)}>
                        Editar nota
                        <i className='fas fa-pen' />
                     </MenuItem>

                     {props.id_tipo_actividad !== 3 && (estado === 1 || estado === 2) &&
                        <MenuItem
                           title='Solo se puede clonar actividad de tipo COORDINACION cuando esta esta andando'
                           disabled={props.id_tipo_actividad === 4 && !ESTADO_play}
                           className='flex justify-between items-center gap-2'
                           onClick={() => openModalClone(props)}>
                           Clonar Actividad
                           <i className='fas fa-clone' />
                        </MenuItem>
                     }

                     <MenuItem
                        className='flex justify-between items-center gap-2'
                        onClick={deleteActivity}>
                        Eliminar Actividad
                        <i className='fas fa-trash-alt' />
                     </MenuItem>

                     <MenuItem
                        className='flex justify-between items-center gap-2'
                        disabled={prioridad_etiqueta === 100}
                        onClick={highPriority}>
                        Prioridad alta
                        <span className='h-4 w-4 rounded-full bg-red-400' />
                     </MenuItem>

                     <MenuItem
                        className='flex justify-between items-center gap-2'
                        disabled={prioridad_etiqueta === 400}
                        onClick={mediumPriority}>
                        Prioridad media
                        <span className='h-4 w-4 rounded-full bg-yellow-400' />
                     </MenuItem>

                     <MenuItem
                        className='flex justify-between items-center gap-2'
                        disabled={prioridad_etiqueta === 600}
                        onClick={lowPriority}>
                        Prioridad baja
                        <span className='h-4 w-4 rounded-full bg-green-400' />
                     </MenuItem>

                     <MenuItem
                        className='flex justify-between items-center gap-2'
                        disabled={prioridad_etiqueta === 1000}
                        onClick={noPriority}>
                        Sin Prioridad
                        <span className='h-4 w-4 rounded-full bg-gray-300' />
                     </MenuItem>
                  </Menu>
               </div>
            </CardFooter>

         </Card>

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
                        className='flex items-center justify-between bg-black/5 rounded-lg py-1.5 px-3 mr-1.5 shadow-md shadow-gray-400/20 mb-1.5 hover:bg-black/10 transition duration-200'>
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
                           }}>
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
                  className='text-blue-500 hover:bg-blue-100 place-self-end'
                  onClick={() => {
                     addNote({ id_actividad: props.id_det, description: desc })
                     onCloseModals()
                  }}>
                  crear nota
               </Button>
            </div>
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
                  {props.notas.length > 0 ? (
                     props.notas.map(note => (
                        <li
                           key={note.id_nota}
                           className={`flex items-center justify-between bg-black/5 rounded-lg py-1.5 px-3 mr-1.5 shadow mb-1.5 hover:bg-black/10 transition duration-200 ${values.id === note.id_nota &&
                              'border-2 border-blue-400'
                              }`}>
                           <span
                              className='w-full cursor-pointer text-gray-600 hover:text-blue-400 transition duration-200'
                              onClick={() =>
                                 setValues({
                                    desc: note.desc_nota,
                                    id: note.id_nota,
                                 })
                              }>
                              <h1>
                                 {note.usuario.abrev_user}
                                 <span className='text-xs font-light ml-2'>
                                    {moment(note.date).format(
                                       'DD/MM/yyyy, HH:mm'
                                    )}
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
                              }}>
                              <i className='fas fa-trash fa-sm'></i>
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
                  onChange={e => setValues({ ...values, desc: e.target.value })}
               />
               <Button
                  className='text-blue-500 hover:bg-blue-100 place-self-end'
                  name='modificar nota'
                  onClick={() =>
                     updateNote({
                        id_nota: values.id,
                        description: values.desc,
                        id_actividad: props.id_det,
                     })
                  }>
                  modificar nota
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
            title={`Pausar actividad: ${props.actividad || 'Sin titulo'}, ${props.id_det
               }`}>
            <div className='grid gap-5'>
               <h5 className='text-sm'>Descripcion actividad: </h5>
               <p className='text-sm whitespace-pre-wrap max-h-44 overflow-custom p-1.5 rounded-lg bg-black/5'>
                  {props.func_objeto}
               </p>

               <CustomSelect
                  label='Tipo de pausa'
                  options={optionsArray?.pause_type}
                  isDefaultOptions
                  value={options}
                  onChange={(option) => setOptions(option)}
               />

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
                           onClick={() => handlePauseActivity({ isDefaultPause: true, mensaje: pause.desc })}
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
                     className='text-blue-500 hover:bg-blue-100 place-self-end'
                     name='cancelar'
                     onClick={() => onCloseModals()}>
                     cancelar
                  </Button>
                  <Button
                     className='text-red-500 hover:bg-red-100 place-self-end'
                     onClick={() => handlePauseActivity({ isDefaultPause: false })}>
                     pausar actividad
                  </Button>
               </footer>
            </div>
         </Modal>

         {/* modal clone */}
         {modalClone &&
            <Modal
               showModal={modalClone}
               isBlur={false}
               onClose={onCloseModals}
               padding='p-4 md:p-6'
               title={`Clonar actividad: ${props.id_det}, ${props.actividad || 'Sin titulo'
                  }`}>

               <AlertBar
                  validation={validation().validation}
                  isCustom={actOptions?.ur?.id !== actOptions?.ue?.id}
                  customMsg='Revisor y Encargado no pueden ser asignados a la misma persona'
                  fields={validation().values}
               />

               <div className='grid gap-5'>

                  <header className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                     <aside className='flex-row space-y-2'>

                        <CloneSelect
                           isRequired
                           field='Proyecto'
                           options={optionsArray?.projects}
                           value={actOptions.pr}
                           onChange={option =>
                              setActOptions({
                                 ...actOptions,
                                 pr: option,
                              })
                           }
                        />

                        <CloneSelect
                           field='Sub proyecto'
                           options={
                              options.pr?.value
                                 ? optionsArray?.subProjects?.filter(
                                    s => s.id === options.pr?.value
                                 )
                                 : optionsArray?.subProjects
                           }
                           value={actOptions.sp}
                           onChange={option =>
                              setActOptions({
                                 ...actOptions,
                                 sp: option,
                              })
                           }
                        />

                        <CloneSelect
                           isRequired
                           field='Solicita'
                           options={optionsArray?.users}
                           value={actOptions.us}
                           onChange={option =>
                              setActOptions({
                                 ...actOptions,
                                 us: option,
                              })
                           }
                        />

                        <CloneSelect
                           isRequired
                           field='Encargado'
                           options={optionsArray?.users}
                           value={actOptions.ue}
                           onChange={option =>
                              setActOptions({
                                 ...actOptions,
                                 ue: option,
                              })
                           }
                        />

                        <CloneSelect
                           hidden={actOptions?.ta?.value !== 1}
                           isRequired={actOptions?.ta?.value === 1}
                           field='Revisor'
                           options={optionsArray?.users}
                           value={actOptions.ur}
                           onChange={option =>
                              setActOptions({
                                 ...actOptions,
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
                              options={optionsArray?.activity_type}
                              value={actOptions.ta}
                              onChange={option =>
                                 setActOptions({
                                    ...actOptions,
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
                           value={title_act}
                           name='title_act'
                           onChange={onChangeValuesAct}
                        />

                        <Input
                           disabled
                           highlight
                           className='mb-3'
                           field='ticket'
                           isNumber
                           value={props.num_ticket_edit}
                        />

                        <Input
                           isRequired
                           highlight
                           className='mb-3'
                           field='prioridad'
                           isNumber
                           value={prio_act}
                           name='prio_act'
                           onChange={onChangeValuesAct}
                        />

                        <Input
                           isRequired
                           highlight
                           className='mb-3'
                           field='T. estimado'
                           value={time_act}
                           name='time_act'
                           isNumber
                           onChange={onChangeValuesAct}
                        />
                     </aside>
                  </header>

                  <section className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                     <TextArea
                        field='descripción'
                        highlight
                        isRequired
                        value={desc_act}
                        name='desc_act'
                        onChange={onChangeValuesAct}
                     />
                     <TextArea
                        field='glosa'
                        value={gloss_act}
                        name='gloss_act'
                        onChange={onChangeValuesAct}
                     />
                  </section>

                  <footer className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-10'>

                     <input
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

                     <div className='place-self-end flex gap-2'>

                        <Button
                           className='text-red-500 hover:bg-red-100'
                           onClick={onCloseModals}>
                           Cancelar
                        </Button>

                        <Button
                           disabled={validation().validation}
                           className='text-yellow-500 hover:bg-yellow-100 place-self-end disabled:hover:bg-transparent'
                           onClick={onClone}>
                           clonar actividad
                        </Button>

                     </div>

                  </footer>
               </div>
            </Modal>
         }
      </>
   )
}

export default ActivityCard
