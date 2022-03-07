
const Switch = ({name, value, onChange}) => {
  return (
    <div className='flex gap-2 items-center justify-between px-7 w-full text-sm text-zinc-500 my-1'>
      {name}
      <div 
        className={`
          rounded-full p-[3px] flex w-10 transition duration-100
          ${value ? 'justify-start' : 'justify-end'}
          ${value ? 'bg-green-400' : 'bg-zinc-200'}
        `}
        onClick={() => onChange(!value)}
        >
          <span className='block rounded-full h-4 w-4 bg-white' />
      </div>
    </div>
  )
}

export default Switch