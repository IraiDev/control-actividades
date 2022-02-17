import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'

const TodoCard = props => {
  const { title, body, importance } = props
  const styles =
    importance === 'high'
      ? 'bg-gray-700 text-white transition duration-200'
      : 'bg-white transition duration-200 border'

  return (
    <div
      onDoubleClick={props.editTodo}
      className={`
            p-4 rounded-md shadow-md max-h-96
            hover:shadow-xl hover:scale-98 transform
            ${styles}
         `}
    >
      <header className='flex items-center justify-between mb-2'>
        <h1 className='font-semibold capitalize flex items-center gap-3'>
          {importance === 'high' && (
            <i className='fas fa-star text-yellow-500' />
          )}
          {title}
        </h1>
        <span>
          <Menu
            direction='bottom'
            align='end'
            className={styles}
            menuButton={
              <MenuButton className='hover:text-blue-400 transition duration-200'>
                <i className='fas fa-bars'></i>
              </MenuButton>
            }
          >
            <MenuItem
              className='hover:bg-gray-400 transition duration-200 hover:bg-opacity-30 font-semibold'
              onClick={props.editTodo}
            >
              Editar
            </MenuItem>
            <MenuItem
              className='hover:bg-gray-400 transition duration-200 hover:bg-opacity-30 font-semibold'
              onClick={props.deleteTodo}
            >
              Eliminar
            </MenuItem>
          </Menu>
        </span>
      </header>
      <section className='max-h-60 overflow-custom'>
        <p
          className={`
               ${importance === 'high' ? 'bg-opacity-10' : 'bg-opacity-5'}
               whitespace-pre-wrap p-1.5 text-sm bg-black rounded-md
            `}
        >
          {body.content}
        </p>
      </section>
    </div>
  )
}

export default TodoCard
