import { useContext } from "react"
import { ActivityContext } from "../../context/ActivityContext"

const MapItem = ({ id, title, state, margin }) => {

   const { optionsArray } = useContext(ActivityContext)

   return (
      <li 
         style={ { marginLeft: `${margin}rem` } }
         className='list-inside list-disc w-max flex gap-4 justify-between items-center py-1 px-2 rounded-md border hover:border-blue-400 bg-zinc-100 mb-1 transition duration-300'
      >
         <div className='font-semibold flex'>
            <span>{id} - </span>
            <span 
               className='truncate w-20'
               title={ title }
            >
               {title}
            </span>
            <span> - { optionsArray?.status.find(os => os.value === state).label }</span>
         </div>
         <i className='fas fa-check' />
      </li>
   )
}

export default MapItem