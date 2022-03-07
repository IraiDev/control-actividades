import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import MarkActivity from '../ui/MarkActivity'

const PrioritySelector = ({
   onClick,
   color = 'bg-slate-400',
   disabled = false,
}) => {
   return (
      <button
         disabled={disabled}
         className={`h-5 w-5 rounded-full ${color} transition duration-200 transform
      ${disabled ? 'hidden' : 'hover:scale-125'}
    `}
         onClick={onClick}></button>
   )
}

const View = ({ 
   children, 
   title, 
   priority, 
   onHigh, 
   onMid, 
   onLow, 
   onNone, 
   type,
   id,
   idFather,
   isChildren,
   isFather,
   isCoorActivity,
   isReviewedActivity,
   isChildrenAndChildren,
}) => {
   const navigate = useNavigate()

   return (
      <div className='relative bg-white p-4 sm:p-10 rounded-lg shadow-lg shadow-gray-600/10 border grid gap-3'>
         <header className='relative flex flex-wrap items-center justify-between'>
            <Button
               className='hover:text-blue-500'
               onClick={() => navigate('/actividades', { replace: true })}>
               <i className='fas fa-arrow-left fa-lg' />
            </Button>

            <span className={`
               px-2 py-0.5 font-semibold rounded-full text-sm absolute top-0 left-1/2 transform -translate-x-1/2
               ${type.id === 1 ? 
                                    'bg-indigo-100 text-indigo-500' 
                  : type.id === 2 ? 'bg-emerald-100 text-emerald-500' 
                  : type.id === 3 ? 'bg-orange-100 text-orange-500' 
                  :                 'bg-zinc-100 text-black'
               }
            `}>
               Tipo: {type.desc}
            </span>

            <div className='flex gap-1.5 p-1.5 rounded-full bg-black/10'>
               <PrioritySelector
                  disabled={priority === 1000}
                  onClick={onNone}
               />
               <PrioritySelector
                  disabled={priority === 600}
                  color='bg-green-500/70'
                  onClick={onLow}
               />
               <PrioritySelector
                  disabled={priority === 400}
                  color='bg-yellow-500/80'
                  onClick={onMid}
               />
               <PrioritySelector
                  disabled={priority === 100}
                  color='bg-red-500/70'
                  onClick={onHigh}
               />
            </div>
         </header>

         <h1 className='text-xl text-center font-semibold capitalize truncate'>
            {title || 'Sin titulo'}
         </h1>
         {children}

         <MarkActivity 
            position='absolute -top-3.5 left-1/2 transform -translate-x-1/2'
            hidden={!isChildren}
         >
            <i className='fas fa-child fa-lg' />
            {idFather}
         </MarkActivity>

         <MarkActivity 
            position='absolute -top-3.5 left-1/2 transform -translate-x-1/2'
            hidden={!isFather}
         >
            <i className='fas fa-hat-cowboy fa-lg' />
            {id} 
         </MarkActivity>

         <MarkActivity 
            position='absolute -top-3.5 left-1/2 transform -translate-x-1/2'
            hidden={!isCoorActivity}
         >
            <i className='far fa-calendar-alt fa-lg' />
            {idFather} 
         </MarkActivity>

         <MarkActivity 
            position='absolute -top-3.5 left-1/2 transform -translate-x-1/2'
            hidden={!isReviewedActivity}
         >
            <i className='fas fa-calendar-check fa-lg' />
            {idFather} 
         </MarkActivity>

         <MarkActivity 
            position='absolute -top-3.5 left-1/2 transform -translate-x-1/2'
            hidden={!isChildrenAndChildren}
         >
            <i className='fas fa-child' />
            <i className='fas fa-hat-cowboy' />
            {idFather} 
         </MarkActivity>

      </div>
   )
}

export default View
