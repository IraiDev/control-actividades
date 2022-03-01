import PingIndicator from '../ui/PingIndicator'

const ChildIndicator = ({content, color}) => {
   return (
      <span className={`
         flex items-center gap-2 absolute -top-3 left-6 text-white font-semibold 
         px-2 py-1 rounded-md shadow-md text-xs
         ${color}
         `}
      >
         <i className='fas fa-handshake' />
         {content}
      </span>
   )
}

const Card = (props) => {
   const {
      onDoubleClick,
      priority = 1000,
      children,
      showPing = false,
      isChildren= false,
      isFather = false,
      className,
   } = props

   return (
      <main
         className={`

            p-3 pb-2 rounded-xl shadow-lg grid content-between transition duration-200 hover:scale-[1.01] transform 
            text-sm shadow-zinc-400/40 hover:shadow-xl hover:shadow-zinc-400/40 relative
            ${
               priority === 1000
                  ? 'bg-white text-slate-600'
                  : priority === 600
                  ? 'text-white bg-green-700/70'
                  : priority === 400
                  ? 'text-white bg-yellow-600/70'
                  : priority === 100 && 'text-white bg-red-800/70'
            }

            ${isFather && `border-2 ${props?.colors?.find(c => c?.id === props?.id_det)?.border}`}

            ${className}

         `}
         onDoubleClick={onDoubleClick}
      >
         {children}

         {showPing && <PingIndicator />}
         {isChildren && <ChildIndicator content={props?.id_det_padre} color={props?.colors?.find(c => c?.id === props?.id_det_padre)?.bg} />}

      </main>
   )
}

export default Card
