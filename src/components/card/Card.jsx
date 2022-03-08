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
      className,
   } = props

   return (
      <div
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

         <PingIndicator hidden={!showPing} />

         <MarkActivity hidden={!isChildren} >
            <i className='fas fa-child fa-lg' />
            {props?.id_det_padre}
         </MarkActivity>

         <MarkActivity hidden={!isFather} >
            <i className='fas fa-hat-cowboy fa-lg' />
            {props?.id_det} 
         </MarkActivity>

         <MarkActivity hidden={!isCoorActivity} >
            <i className='far fa-calendar-alt fa-lg' />
            {props?.id_det_padre} 
         </MarkActivity>

         <MarkActivity hidden={!isReviewedActivity} >
            <i className='fas fa-calendar-check fa-lg' />
            {props?.id_det_padre} 
         </MarkActivity>

         <MarkActivity hidden={!isChildrenAndFather} >
            <i className='fas fa-child' />
            <i className='fas fa-hat-cowboy' />
            {props?.id_det_padre} 
         </MarkActivity>

         <MarkActivity hidden={!isDeliveryActivity} >
            <i className='fas fa-truck fa-lg' />
            {props?.id_det_padre} 
         </MarkActivity>

      </div>
   )
}

export default Card
