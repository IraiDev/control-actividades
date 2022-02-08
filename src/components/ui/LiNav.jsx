import { NavLink } from 'react-router-dom'

const LiNav = ({ name, onClick, icon = 'fas fa-list-ul', to }) => {
  return (
    <li
      className='hover:bg-gray-100 border-l-4 border-transparent hover:border-purple-500 hover:text-purple-400 transition duration-500'
      onClick={onClick}
    >
      <NavLink
        className={({ isActive }) =>
          `block px-6 py-3 capitalize ${
            isActive && 'text-purple-500 font-semibold'
          }`
        }
        to={to}
      >
        <div className='flex items-center gap-4'>
          <i className={icon} />
          {name}
        </div>
      </NavLink>
    </li>
  )
}

export default LiNav
