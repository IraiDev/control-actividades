import React from 'react'

const Button = ({
  name = 'boton',
  icon = 'fas fa-bars',
  className = 'rounded-lg bg-blue-500 hover:bg-blue-600 text-white',
  block = false,
  shadow = false,
  onClick,
  type,
  disabled = false,
  iconFirst = false,
}) => {

  if (disabled) {
    return null
  }

  if (type === 'icon') {
    return (
      <button
        onClick={onClick}
        className={`focus:outline-none transition duration-500 h-8 w-8 ${className} ${shadow && 'shadow-xl'}`}>
        <i className={icon}></i>
      </button>
    )
  }

  if (type === 'iconText') {
    return (
      <button
        onClick={onClick}
        className={`focus:outline-none transition duration-500 capitalize py-1.5 px-4 font-semibold ${className} ${shadow && 'shadow-xl'} ${block && 'block w-full'}`}
      >
        {iconFirst ?
          <>
            <i className={`${icon} mr-2`}></i>
            {name}
          </>
          :
          <>
            {name}
            <i className={`${icon} ml-2`}></i>
          </>
        }

      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`focus:outline-none transition duration-500 capitalize py-1.5 px-4 font-semibold ${className} ${shadow && 'shadow-xl'}  ${block && 'block w-full'}`}>
      {name}
    </button>
  )
}

export default Button