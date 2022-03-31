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
      isCoorActivity,
      isReviewedActivity,
      isChildrenAndFather,
      isDeliveryActivity,
      isChildrenAndFatherAndCoor,
      isTicket,
      className,
   } = props

   return (
      <div
         className={`

            p-3 pb-2 rounded-xl shadow-lg grid content-between transition duration-200 hover:scale-[1.01] transform 
            text-sm shadow-zinc-400/40 hover:shadow-xl hover:shadow-zinc-400/40 relative
            ${priority === 1000
               ? 'bg-white text-slate-600'
               : priority === 600
                  ? 'text-white bg-emerald-500/80'
                  : priority === 400
                     ? 'text-white bg-amber-500/70'
                     : priority === 100 && 'text-white bg-red-600/70'
            }

            ${className}

         `}
         onDoubleClick={onDoubleClick}
      >
         {children}

         <PingIndicator hidden={!showPing} />

         <MarkActivity
            condicion={isTicket}
            hidden={!isChildren}
            id={props?.id_det_padre}
         >
            <i className='fas fa-child fa-lg' />
            {/* {props?.id_det_padre} */}
         </MarkActivity>

         <MarkActivity
            condicion={isTicket}
            hidden={!isFather}
            id={props?.id_det}
         >
            <i className='fas fa-hat-cowboy fa-lg' />
            {/* {props?.id_det} */}
         </MarkActivity>

         <MarkActivity
            condicion={isTicket}
            hidden={!isCoorActivity}
            id={props?.id_det_padre}
         >
            <i className='far fa-calendar-alt fa-lg' />
            {/* {props?.id_det_padre} */}
         </MarkActivity>

         <MarkActivity
            condicion={isTicket}
            hidden={!isReviewedActivity}
            id={props?.id_det_padre}
         >
            <i className='fas fa-calendar-check fa-lg' />
            {/* {props?.id_det_padre} */}
         </MarkActivity>

         <MarkActivity
            condicion={isTicket}
            hidden={!isChildrenAndFather}
            id={props?.id_det_padre}
         >
            <i className='fas fa-child' />
            <i className='fas fa-hat-cowboy' />
            {/* {props?.id_det_padre} */}
         </MarkActivity>

         <MarkActivity
            condicion={isTicket}
            hidden={!isChildrenAndFatherAndCoor}
            id={props?.id_det_padre}
         >
            <i className='far fa-calendar-alt' />
            <i className='fas fa-hat-cowboy' />
            <i className='fas fa-child' />
            {/* {props?.id_det_padre} */}
         </MarkActivity>

         <MarkActivity
            condicion={isTicket}
            hidden={!isDeliveryActivity}
            id={props?.id_det_padre}
         >
            <i className='fas fa-truck fa-lg' />
            {/* {props?.id_det_padre} */}
         </MarkActivity>

      </div>
   )
}

export default Card
