import { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { ActivityContext } from '../../context/ActivityContext'

const Indicator = ({ user, isWorking }) => {

   const {
      saveFilters,
      savePRFilters,
      setPager,
      pager,
      setPRPager,
      prPager,
      optionsArray,
      filters,
      prFilters
   } = useContext(ActivityContext)

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

   const onClear = () => {

      if (pathname === '/revision-actividades') {

         setPRPager({ ...prPager, page: 1 })
         savePRFilters({ payload: { offset: 0, revisor: [] } })

         return
      }

      setPager({ ...pager, page: 1 })
      saveFilters({ payload: { offset: 0, encargado: [] } })
   }

   const userColor = () => {

      if (pathname === '/revision-actividades') {

         const userId = optionsArray?.users?.find(op => op.label === user).id

         if (isWorking) {
            const color = prFilters.revisor[0] === userId ? 'border-red-400 hover:bg-red-500 bg-red-400 text-white'
               : 'border-red-400 hover:bg-red-400'

            return { color }
         }
         else {
            const color = prFilters.revisor[0] === userId ? 'border-emerald-400 hover:bg-emerald-500 bg-emerald-400 text-white'
               : 'border-emerald-400 hover:bg-emerald-400'

            return { color }
         }
      }

      if (isWorking) {
         const color = filters.encargado[0] === user ? 'border-red-400 hover:bg-red-500 bg-red-400 text-white'
            : 'border-red-400 hover:bg-red-400'

         return { color }
      }
      else {
         const color = filters.encargado[0] === user ? 'border-emerald-400 hover:bg-emerald-500 bg-emerald-400 text-white'
            : 'border-emerald-400 hover:bg-emerald-400'

         return { color }
      }

   }

   const handler = () => {

      const userId = optionsArray?.users?.find(op => op.label === user).id

      if (pathname === '/revision-actividades') {

         prFilters.revisor.includes(userId) ? onClear() : onFilter()
         return
      }

      filters.encargado.includes(user) ? onClear() : onFilter()

   }

   return (
      <span
         onClick={handler}
         className={`
         uppercase rounded-full border-2 inline-block text-center align-middle
         h-8 w-8 cursor-pointer transition duration-500 hover:text-white
         ${userColor().color}
         `}>
         {user}
      </span>
   )
}

export default Indicator
