import PingIndicator from '../ui/PingIndicator'

const Card = ({
   onDoubleClick,
   priority = 1000,
   children,
   showPing = false,
   className,
}) => {
   return (
      <main
         className={`
         p-4 pb-2 rounded-xl shadow-lg grid content-between transition duration-200 hover:scale-[0.985] transform 
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
         ${className}
         `}
         onDoubleClick={onDoubleClick}>
         {children}

         {showPing && <PingIndicator />}
      </main>
   )
}

export default Card
