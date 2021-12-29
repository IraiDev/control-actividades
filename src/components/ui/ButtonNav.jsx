import { useNavigate } from 'react-router-dom'
import Button from './Button'

const ButtonNav = ({ id, title, icon, isAction = true, onDelete, onUpdate, onClick, active }) => {

   const navigate = useNavigate()

   const handleNavigate = () => {
      navigate(`to-do/${id}?title_list=${title}&icon_list=${icon}`)
      onClick(id)
   }

   return (
      <span
         className={`
            ${active ? 'text-purple-500' : ''}
            hover:bg-gray-100 border-l-4 border-transparent hover:border-purple-500 hover:text-purple-400
            transition duration-500 w-full text-left flex items-center justify-between`}
      >
         <section
            className='flex gap-2 items-center py-3 w-full cursor-pointer pl-6'
            onClick={handleNavigate}
         >
            <i className={icon}></i>
            {title}
         </section>
         {isAction &&
            <section className='flex pr-6'>
               <Button
                  type='icon'
                  icon='fas fa-pen'
                  className='rounded-lg hover:bg-gray-200 hover:text-green-500'
                  onClick={onUpdate}
               />
               <Button
                  type='icon'
                  icon='fas fa-trash-alt'
                  className='rounded-lg hover:bg-gray-200 hover:text-red-500'
                  onClick={onDelete}
               />
            </section>
         }
      </span>
   )
}

export default ButtonNav
