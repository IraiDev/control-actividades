import { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { ActivityContext } from '../../context/ActivityContext'

const Indicator = ({ user, isWorking }) => {

   const { saveFilters, savePRFilters, setPager, pager, optionsArray } = useContext(ActivityContext)
   const { pathname } = useLocation()

   const onFilter = () => {

      setPager({ ...pager, page: 1 })

      if (pathname === '/revision-actividades') {

         const userId = optionsArray.users.find(op => op.label === user).id

         const filters = {
            revisor: [userId],
            offset: 0,
         }

         savePRFilters({ payload: filters })
         return

      }

      const filters = {
         encargado: [user],
         offset: 0,
      }

      saveFilters({ payload: filters })
      
   }

   return (
      <span
         onClick={ onFilter }
         className={`
         uppercase rounded-full border-2 inline-block text-center align-middle
         h-8 w-8 cursor-pointer transition duration-500 bg-white hover:text-white
         ${
            isWorking
               ? 'border-red-400 hover:bg-red-400'
               : 'border-emerald-400 hover:bg-emerald-400'
         }
         `}>
         {user}
      </span>
   )
}

export default Indicator
