import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'

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

const View = ({ children, title, priority, onHigh, onMid, onLow, onNone }) => {
   const navigate = useNavigate()

   return (
      <div className='bg-white p-4 sm:p-10 rounded-lg shadow-lg shadow-gray-600/10 border grid gap-5'>
         <header className='flex flex-wrap items-center justify-between'>
            <Button
               className='hover:text-blue-500'
               onClick={() => navigate('/actividades', { replace: true })}>
               <i className='fas fa-arrow-left fa-lg' />
            </Button>

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
      </div>
   )
}

export default View
