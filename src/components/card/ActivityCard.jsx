import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import LiNote from '../ui/LiNote'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'

const today = moment(new Date()).format('YYYY/MM/DD')

const ActivityCard = (props) => {

  const { addNote, updateNote, lowPriority, mediumPriority, highPriority, noPriority,
    numberCard, pausas, onPlayPause, estado } = props

  const navigate = useNavigate()

  const date = moment(props.fecha_tx)
  const pausaState = pausas?.length > 0 && pausas?.at(-1).boton === 2
  let userStyles = {
    priority: 'S/P',
    styles: 'border bg-white text-slate-700 hover:border-gray-400'
  }

  switch (props.prioridad_etiqueta) {
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
        styles: 'text-white bg-yellow-600/70',
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

  return (
    <div
      className={`
        p-4 rounded-lg shadow-md grid transition duration-200 hover:scale-95 transform text-sm
        shadow-slate-400/40 hover:shadow-xl hover:shadow-slate-400/40
       ${userStyles.styles}
    `}
      onDoubleClick={() => navigate(`detalle-actividad/${props.id_det}`, { replace: true })}
    >
      <div>
        <header className='flex items-start justify-between gap-3 capitalize font-semibold'>
          <h1 className='text-base'>
            {props.actividad || 'Sin Titulo'}
          </h1>
          <span className='bg-indigo-300 rounded-md py-0.5 px-2.5 text-indigo-600 mb-2'>
            {numberCard}
          </span>
        </header>
        <section className='grid grid-cols-2 gap-2'>
          <aside className='capitalize'>
            <p>
              <span className='font-semibold capitalize mr-1'>
                encargado:
              </span>
              {props.encargado_actividad}
            </p>
            <p>
              <span className='font-semibold capitalize mr-1'>
                proyecto:
              </span>
              {props.proyecto_tarea.abrev}
            </p>
            <p>
              <span className='font-semibold capitalize mr-1'>
                sub proyecto:
              </span>
              {props.subproyectos_tareas ? props.subproyectos_tareas.nombre_sub_proy : 'S/SP'}
            </p>
            <p>
              <span className='font-semibold capitalize mr-1'>
                solicitante:
              </span>
              {props.user_solicita}
            </p>
            <p>
              <span className='font-semibold capitalize'>
                estado:
              </span>
              {
                estado === 1 ? ' pendiente' : ' en trabajo'
              }
            </p>
          </aside>
          <aside className='capitalize'>
            <p>
              <span className='font-semibold mr-1'>
                ID:
              </span>
              {props.id_det}
            </p>
            <p>
              <span className='font-semibold mr-1'>
                ticket:
              </span>
              {props.num_ticket_edit}
            </p>
            <p>
              <span className='font-semibold mr-1'>
                fecha:
              </span>
              {date.format('DD/MM/YYYY')}
            </p>
            <p>
              <span className='font-semibold mr-1'>
                transcurridos:
              </span>
              {
                date.diff(today, 'days') - date.diff(today, 'days') * 2
              }
            </p>
            <p>
              <span className='font-semibold mr-1'>
                prioridad:
              </span>
              {userStyles.priority} ({props.num_prioridad})
            </p>
          </aside>
        </section>
        <section className={`
        ${userStyles.priority === 'S/P' ? 'bg-opacity-5' : 'bg-opacity-10'} 
          mt-2 bg-black bg-opacity-5 rounded-md p-1.5
        `}>
          <h5 className='font-semibold capitalize'>descripcion</h5>
          <p className='max-h-36 overflow-custom whitespace-pre-wrap mix-blend-luminosity'>
            {props.func_objeto}
          </p>
        </section>
        <section className='mt-2 p-1.5'>
          <h5 className='font-semibold capitalize'>notas (informes)</h5>
          <ul className='max-h-36 overflow-custom whitespace-pre-wrap mix-blend-luminosity'>
            {
              props.notas.length > 0 ?
                props.notas.map((note, i) => (
                  <LiNote
                    key={note.id_nota}
                    numberNote={i + 1}
                    className={userStyles.priority === 'S/P' ? 'text-slate-700/50'
                      : 'text-white/60'}
                    {...note}
                  />
                ))
                :
                <li className={
                  userStyles.priority === 'S/P' ? 'text-slate-700/50'
                    : 'text-white/60'}>
                  No hay notas...
                </li>
            }
          </ul>
        </section>
      </div>
      <footer className='place-self-end flex justify-between items-center border-t w-full pt-2 mt-2'>
        <span className='flex items-center gap-2'>
          <p>estado</p>
          <button
            onClick={() => onPlayPause({ props, pausaState })}
            className={estado === 1 ? 'hidden' : ''}
          >
            {
              pausaState ?
                <i className='fas fa-pause fa-sm' />
                : <i className='fas fa-play fa-sm' />
            }
          </button>
        </span>
        <span>
          <Menu
            className={userStyles.menu}
            direction='top'
            align='end'
            menuButton={
              <MenuButton>
                <i className='fas fa-bars' />
              </MenuButton>
            }>
            <MenuItem
              className={userStyles.hoverMenu + ' flex items-center justify-between'}
              onClick={addNote}
            >
              Nueva nota
              <i className='fas fa-plus' />
            </MenuItem>
            <MenuItem
              className={userStyles.hoverMenu + ' flex items-center justify-between'}
              onClick={updateNote}
            >
              Editar nota
              <i className='fas fa-pen' />
            </MenuItem>
            <MenuItem
              className={userStyles.hoverMenu + ' flex items-center justify-between'}
              onClick={highPriority}
            >
              Prioridad alta
              <span className='h-4 w-4 rounded-full bg-red-400' />
            </MenuItem>
            <MenuItem
              className={userStyles.hoverMenu + ' flex items-center justify-between gap-2'}
              onClick={mediumPriority}
            >
              Prioridad media
              <span className='h-4 w-4 rounded-full bg-yellow-400' />
            </MenuItem>
            <MenuItem
              className={userStyles.hoverMenu + ' flex items-center justify-between'}
              onClick={lowPriority}
            >
              Prioridad baja
              <span className='h-4 w-4 rounded-full bg-green-400' />
            </MenuItem>
            <MenuItem
              className={userStyles.hoverMenu + ' flex items-center justify-between'}
              onClick={noPriority}
            >
              Sin Prioridad
              <span className='h-4 w-4 rounded-full bg-gray-300' />
            </MenuItem>
          </Menu>
        </span>
      </footer>
    </div >
  )
}

export default ActivityCard
