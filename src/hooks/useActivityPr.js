import { useContext, useEffect, useState } from 'react'
import { ActivityContext } from '../context/ActivityContext'
import { UiContext } from '../context/UiContext'
// import { Alert } from '../helpers/alerts'
import { fetchToken } from '../helpers/fetch'

export const useActivityPr = () => {
   const { setIsLoading } = useContext(UiContext)
   const { filters, order } = useContext(ActivityContext)
   const [activitiesPR, setActivitiesPR] = useState([])
   const [total, setTotal] = useState(0)

   const fetchActivities = async () => {
      try {
         setIsLoading(true)
         const resp = await fetchToken(
            'task/get-finished-task',
            { },
            'POST'
         )
         const body = await resp.json()
         const { ok, tareas, total_tareas } = body

         console.log(tareas)
         setIsLoading(false)
         if (ok) {
            setActivitiesPR(tareas)
            setTotal(total_tareas)
         } else {
            console.log('Error')
         }
      } catch (e) {
         console.log(e)
         setIsLoading(false)
      }
   }

   useEffect(() => {
      fetchActivities()
      // eslint-disable-next-line
   }, [filters, order])

   return {activitiesPR, total}

}