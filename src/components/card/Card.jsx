import PingIndicator from '../ui/PingIndicator'

const Indicator = ({content, color = 'bg-amber-200/80', isChild}) => {
   return (
      <div className='bg-white'>
         <span className={`
            flex items-center gap-2 absolute -top-3 right-1/2 transform translate-x-1/2 text-amber-600 font-bold 
            px-2 py-1 rounded-md shadow-md text-xs
            ${color}
            `}
         >
            <i className={isChild ? 'fas fa-child': 'fas fa-hat-cowboy' } />
            {content}
         </span>
      </div>
   )
}

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
            <Indicator 
               isChild
               content={props?.id_det_padre}
            />
         }

         {isFather && <Indicator content={props?.id_det} />}

      </main>
   )
}

export default Card
