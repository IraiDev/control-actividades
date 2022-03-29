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

   const { optionsArray, user } = useContext(ActivityContext)

   const [{ desc, time }, onChangeValues, reset] = useForm({
      desc: '',
      time: props.tiempo_estimado,
   })

   const [values, setValues] = useState({ desc: '', id: null })
   const [options, setOptions] = useState({ value: null, label: 'ninguno' })

   // modals
   const [modalEdit, toggleModalEdit] = useState(false)
   const [modalAdd, toggleModalAdd] = useState(false)
   const [modalPause, toggleModalPause] = useState(false)

   // variables
   const ESTADO_PAUSA = estado === 1
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
      toggleModalEdit(false)
      toggleModalAdd(false)
      toggleModalPause(false)
      setValues({ desc: '', id: null })
      setOptions({ value: null, label: 'ninguno' })
   }

   const handleNavigate = () => {
      navigate(`detalle-actividad/${props.id_det}`, { replace: true })
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

                     <span className='block text-transparent h-1.5' ></span>

                     <P tag='solicita' value={props.user_solicita} />

                     <P tag='revisor' value={props.abrev_revisor || '--'} />

                  </aside>

                  <section className='capitalize'>

                     <span className='block text-transparent' >h</span>

                     <P tag='creacion' value={moment(fecha_tx).format('DD-MM-YY')} />

                     <span className='block text-transparent h-1.5' ></span>

                     {/* <P tag='Tipo' value={props.desc_tipo_actividad} /> */}

                     <P tag='estado' value={ESTADO_PAUSA ? ' pendiente' : ' en trabajo'} />

                  </section>

                  <aside className='capitalize'>

                     <P tag='proy' value={props.abrev} />

                     <P tag='sub p' value={props.nombre_sub_proy || '- -'} />

                     <span className='block text-transparent h-1.5' ></span>

                     <span className='flex gap-1 max-w-max rounded'>
                        <strong>ID:</strong>
                        <p className={`

                              px-1 rounded font-semibold
                              ${(isFather || isChildrenAndFather) && isTicket ? 'text-amber-600 bg-amber-200/80'
                              : isFather || isChildrenAndFather ? 'text-indigo-600 bg-indigo-200/80' : ''}
                           
                           `}
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

                  <div className='flex gap-3'>

                     <Tag>
                        Tipo: {props.desc_tipo_actividad}
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
                  hidden={!ESTADO_PAUSA || (isFather && isTicket)}
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
                  hidden={ESTADO_PAUSA || (isFather && isTicket)}
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
                        className='flex items-center justify-between bg-black/5 rounded-lg py-1.5 px-3 mr-1.5 shadow-md shadow-gray-400/20 mb-1.5 hover:bg-black/10 transition duration-200'>
                        <p className='text-gray-600 text-sm'>{pause.desc}</p>
                        <button
                           className='ml-2 text-red-400 hover:text-red-600 transition duration-200 transform hover:hover:scale-125'
                           onClick={() => handlePauseActivity({ isDefaultPause: true, mensaje: pause.desc })}>
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
      </>
   )
}

export default ActivityCard
