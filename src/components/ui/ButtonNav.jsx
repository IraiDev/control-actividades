import { useNavigate } from 'react-router-dom'
import Button from './Button'

const ButtonNav = ({
   id,
   title,
   icon,
   isAction = true,
   onDelete,
   onUpdate,
   onClick,
   active,
}) => {
   const navigate = useNavigate()

   const handleNavigate = () => {
      navigate(`to-do/${id}?title_list=${title}&icon_list=${icon}`)
      onClick(id)
   }

   return (
      <div
         className={`
            ${active ? 'text-purple-500' : ''}
            hover:bg-gray-100 border-l-4 border-transparent hover:border-purple-500 hover:text-purple-400
            transition duration-500 w-full text-left flex items-center justify-between`}>
         <section
            className='flex gap-2 items-center py-3 w-full cursor-pointer pl-6'
            onClick={handleNavigate}>
            <i className={icon}></i>
            {title}
         </section>
         {isAction && (
            <section className='flex pr-6'>
               <Button
                  className='text-zinc-400/70 hover:bg-gray-200 hover:text-green-500'
                  onClick={onUpdate}>
                  <i className='fas fa-pen' />
               </Button>
               <Button
                  className='text-zinc-400/70 hover:bg-gray-200 hover:text-red-500'
                  onClick={onDelete}>
                  <i className='fas fa-trash-alt' />
               </Button>
            </section>
         )}
      </div>
   )
}

export default ButtonNav
