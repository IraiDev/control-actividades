const LiLink = ({ name, onClick, icon = 'fas fa-list-ul', to, target }) => {
  return (
    <li
      className='hover:bg-gray-100 border-l-4 border-transparent hover:border-purple-500 hover:text-purple-400 transition duration-500'
      onClick={onClick}
    >
      <a
        className='block px-6 py-3 capitalize'
        href={to}
        target={target}
        rel='noreferrer'
      >
        <div className='flex items-center gap-4'>
          <i className={icon} />
          {name}
        </div>
      </a>
    </li>
  )
}

export default LiLink
