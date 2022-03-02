import { useContext, useEffect, useState } from 'react'
import { ActivityContext } from '../context/ActivityContext'
import { UiContext } from '../context/UiContext'
// import { Alert } from '../helpers/alerts'
import { fetchToken } from '../helpers/fetch'

export const useActivityPr = () => {
   const { setIsLoading } = useContext(UiContext)
   const { prFilters, prOrder } = useContext(ActivityContext)
   const [activitiesPR, setActivitiesPR] = useState([])
   const [total, setTotal] = useState(0)

   const fetchActivities = async () => {
      try {
         setIsLoading(true)
         const resp = await fetchToken(
            'task/get-finished-task',
            { ...prFilters, ...prOrder},
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

   const toggleCheckActivity = async ({id_actividad, estado, revisado}) => {
      try {
         const resp = await fetchToken('task/checked-activity', {id_actividad, estado, revisado}, 'PUT')
         const body = await resp.json()

         console.log('togglecheck',body)
      } catch (err) {
         console.log(err)
      }
   }

   useEffect(() => {
      fetchActivities()
      // eslint-disable-next-line
   }, [prFilters, prOrder])

   return {
      activitiesPR, 
      total,
      toggleCheckActivity
   }

}