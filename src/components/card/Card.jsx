import MarkActivity from '../ui/MarkActivity'
import PingIndicator from '../ui/PingIndicator'

const Card = (props) => {
   const {
      onDoubleClick,
      priority = 1000,
      children,
      showPing = false,
      isChildren,
      isFather,
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

            ${className}

         `}
         onDoubleClick={onDoubleClick}
      >
         {children}

         {showPing && <PingIndicator />}

         {isChildren && 
            <MarkActivity 
               isChild
               content={props?.id_det_padre}
            />
         }

         {isFather && <MarkActivity content={props?.id_det} />}

      </main>
   )
}

export default Card
