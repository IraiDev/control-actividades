const PingIndicator = ({
   tooltip = 'Trabajando en esta actividad',
   size = 'normal',
   hidden = false
}) => {

   if(hidden) return null

   if (size === 'small') {
      return (
         <div className='absolute -top-1 -left-1' title={tooltip}>
            <span className='h-2 w-2 rounded-full bg-red-400 absolute z-40 -top-0 -left-0' />
            <span className='h-2 w-2 rounded-full bg-red-400 absolute z-40 -top-0 -left-0 animate-ping' />
         </div>
      )
   }

   return (
      <div className='absolute -top-1 -left-1' title={tooltip}>
         <span className='h-3.5 w-3.5 rounded-full bg-red-400 fixed' />
         <span className='h-3.5 w-3.5 rounded-full bg-red-400 animate-ping fixed' />
      </div>
   )
   
}

export default PingIndicator
