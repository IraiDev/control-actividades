import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import { useForm } from '../../../hooks/useForm'
import LiNote from '../../ui/LiNote'
import Modal from '../../ui/Modal'
import TextArea from '../../ui/TextArea'
import Button from '../../ui/Button'
import P from '../../ui/P'
import Card from '../Card'
import CardSection from '../CardSection'
import CardFooter from '../CardFooter'
import CardContent from '../CardContent'
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
const itemStyle = 'hover:bg-blue-400 hover:text-white flex items-center justify-between gap-2'

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
      notas,
   } = props

   const navigate = useNavigate()

   const [{ desc }, onChangeValues, reset] = useForm({ desc: '' })
   const [values, setValues] = useState({ desc: '', id: null })

   // modals
   const [modalEdit, toggleModalEdit] = useState(false)
   const [modalAdd, toggleModalAdd] = useState(false)
   const [modalPause, toggleModalPause] = useState(false)

   // variables
   const ESTADO_PAUSA = estado === 1
   const ESTADO_play = estado_play_pausa === 2
   const DATE = moment(fecha_tx).format('yyyy-MM-DD')
   const TRANSCURRIDOS = moment(DATE).diff(TODAY, 'days') - moment(DATE).diff(TODAY, 'days') * 2
   const PRIORIDAD = prioridad_etiqueta === 600 ? 'Baja' : 
                     prioridad_etiqueta === 400 ? 'Media'  : 
                     prioridad_etiqueta === 100 ? 'Alta' : 
                                                  'S/P'
   const MENU = prioridad_etiqueta === 600 ? 'text-white bg-green-800' : 
                prioridad_etiqueta === 400 ? 'text-white bg-yellow-500'  : 
                prioridad_etiqueta === 100 ? 'text-white bg-red-800' : 
                                             'text-white bg-green-800'
   
   const onCloseModals = () => {
      reset()
      toggleModalEdit(false)
      toggleModalAdd(false)
      toggleModalPause(false)
      setValues({ desc: '', id: null })
   }

   const handleNavigate = () => {
      navigate(`detalle-actividad/${props.id_det}`, { replace: true })
   }

   return (
      <>
         <Card
            showPing={props.estado_play_pausa === 2}
            priority={props.prioridad_etiqueta}
            onDoubleClick={handleNavigate}>
               
            <CardContent title={props.actividad} cardNum={numberCard}>

               <CardSection colCount={2}>
                  <aside className='capitalize'>
                     <P tag='encargado' value={props.encargado_actividad} />
                     <P tag='proyecto' value={props.abrev} />
                     <P tag='sub proyecto' value={props.nombre_sub_proy} />
                     <P tag='solicita' value={props.user_solicita} />
                     <P tag='estado' value={ESTADO_PAUSA ? ' pendiente' : ' en trabajo'} />
                  </aside>

                  <aside className='capitalize'>
                     <P tag='ID' value={props.id_det} />
                     <P tag='ticket' value={props.num_ticket_edit} />
                     <P tag='fecha' value={moment(fecha_tx).format('DD-MM-YYYY')} />
                     <P tag='transcurridos' value={TRANSCURRIDOS} />
                     <P tag='Prioridad' value={<>{PRIORIDAD} ({props.num_prioridad})</>} />
                  </aside>
               </CardSection>

               <CardSection subtitle='descripcion'>
                  <div className='overflow-custom max-h-36 mix-blend-luminosity'>
                     <p className={`bg-black/5 min-h-[144px] whitespace-pre-wrap rounded-md p-1.5`}>
                        {props.func_objeto}
                     </p>
                  </div>
               </CardSection>

               <CardSection subtitle='notas (informes)'>
                  <ul className='max-h-36 overflow-custom whitespace-pre-wrap mix-blend-luminosity'>
                     {props.notas.length > 0 ? 
                        props.notas.map((note, i) => (
                           <LiNote
                              key={note.id_nota}
                              numberNote={i + 1}
                              className={prioridad_etiqueta === 1000 ? 'text-slate-700/50' : 'text-white/60'}
                              {...note}
                           />
                        ))
                      : <p className='text-xs'>No hay notas...</p>}
                  </ul>
               </CardSection>

            </CardContent>

            <CardFooter>
               {ESTADO_PAUSA ? 
                  <span />
                  :
                  <button
                     onClick={
                        ESTADO_play ? () => toggleModalPause(true)
                                    : () => playActivity({ id_actividad: props.id_det })
                  }>
                     <i className={ESTADO_play ? 'fas fa-pause fa-sm' : 'fas fa-play fa-sm'} />
                  </button>
               }
               <div>
                  <Menu
                     className={MENU}
                     direction='top'
                     align='end'
                     menuButton={
                        <MenuButton>
                           <i className='fas fa-bars' />
                        </MenuButton>
                     }>
                     <MenuItem
                        className={itemStyle}
                        onClick={() => toggleModalAdd(true)}>
                        Nueva nota
                        <i className='fas fa-plus' />
                     </MenuItem>

                     <MenuItem
                        disabled={notas.length === 0}
                        className={` ${itemStyle} 
                           ${
                              prioridad_etiqueta === 1000
                                 ? 'hover:bg-transparent hover:text-zinc-400 text-zinc-400'
                                 : notas.length === 0 &&
                                    'hover:bg-transparent hover:text-white/70 text-white/70'
                           }
                           `}
                        onClick={() => toggleModalEdit(true)}>
                        Editar nota
                        <i className='fas fa-pen' />
                     </MenuItem>

                     <MenuItem
                        disabled={prioridad_etiqueta === 100}
                        className={`${itemStyle} 
                           ${
                              prioridad_etiqueta === 100 &&
                              'hover:bg-transparent hover:text-white/70 text-white/70'
                           }`}
                        onClick={highPriority}>
                        Prioridad alta
                        <span className='h-4 w-4 rounded-full bg-red-400' />
                     </MenuItem>

                     <MenuItem
                        disabled={prioridad_etiqueta === 400}
                        className={`${itemStyle} ${
                           prioridad_etiqueta === 400 &&
                           'hover:bg-transparent hover:text-white/70 text-white/70'
                        }`}
                        onClick={mediumPriority}>
                        Prioridad media
                        <span className='h-4 w-4 rounded-full bg-yellow-400' />
                     </MenuItem>

                     <MenuItem
                        disabled={prioridad_etiqueta === 600}
                        className={`${itemStyle} ${
                           prioridad_etiqueta === 600 &&
                           'hover:bg-transparent hover:text-white/70 text-white/70'
                        }`}
                        onClick={lowPriority}>
                        Prioridad baja
                        <span className='h-4 w-4 rounded-full bg-green-400' />
                     </MenuItem>

                     <MenuItem
                        disabled={prioridad_etiqueta === 1000}
                        className={`${itemStyle} ${
                           prioridad_etiqueta === 1000 &&
                           'hover:bg-transparent hover:text-zinc-400/90 text-zinc-400/90'
                        }`}
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
            title='Modificar Notas'>
            <div className='grid gap-5'>
               <h5 className='text-sm'>Notas actuales: </h5>
               <ul className='max-h-56 overflow-custom'>
                  {props.notas.length > 0 ? (
                     props.notas.map(note => (
                        <li
                           key={note.id_nota}
                           className={`flex items-center justify-between bg-black/5 rounded-lg py-1.5 px-3 mr-1.5 shadow mb-1.5 hover:bg-black/10 transition duration-200 ${
                              values.id === note.id_nota &&
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
            title={`Pausar actividad: ${props.actividad || 'Sin titulo'}, ${
               props.id_det
            }`}>
            <div className='grid gap-5'>
               <h5 className='text-sm'>Descripcion actividad: </h5>
               <p className='text-sm whitespace-pre-wrap max-h-44 overflow-custom p-1.5 rounded-lg bg-black/5'>
                  {props.func_objeto}
               </p>
               <h5 className='text-sm'>Pausas rapidas: </h5>
               <ul className='max-h-56 overflow-custom'>
                  {defaultPauses.map(pause => (
                     <li
                        key={pause.id}
                        className='flex items-center justify-between bg-black/5 rounded-lg py-1.5 px-3 mr-1.5 shadow-md shadow-gray-400/20 mb-1.5 hover:bg-black/10 transition duration-200'>
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
                           }}>
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
