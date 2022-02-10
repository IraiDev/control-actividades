const TimerContainer = ({ children, subtitle, color }) => {
  let style = ''

  switch (color) {
    case 'red':
      style = 'border-red-400 hover:bg-red-50 text-red-500'
      break

    case 'green':
      style = 'border-emerald-400 hover:bg-emerald-50 text-emerald-500'
      break

    case 'orange':
      style = 'border-orange-400 hover:bg-orange-50 text-orange-500'
      break

    default:
      style = 'border-gray-400 hover:bg-emerald-50'
      break
  }

  return (
    <span
      className={`
      font-semibold rounded-full grid h-24 w-24 border-4 ${style}
      mx-auto bg-slate-100 transition duration-200 
      content-center place-content-center capitalize
    `}
    >
      {children}
      <span className='text-xs text-center'>{subtitle}</span>
    </span>
  )
}

export default TimerContainer
