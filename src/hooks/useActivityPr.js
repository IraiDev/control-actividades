import { useContext, useEffect, useState } from 'react'
import { ActivityContext } from '../context/ActivityContext'
import { UiContext } from '../context/UiContext'
import { Alert } from '../helpers/alerts'
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
            { ...prFilters, ...prOrder },
            'POST'
         )
         const body = await resp.json()
         const { ok, tareas, total_tareas } = body

         setIsLoading(false)
         if (ok) {
            setActivitiesPR(tareas)
            setTotal(total_tareas)
         } else {
            console.log('Error')
            Alert({
               icon: 'error',
               title: 'Error',
               content: body.response,
               showCancelButton: false,
            })
         }
      } catch (e) {
         console.log(e)
         setIsLoading(false)
      }
   }

   const toggleCheckActivity = async ({
      id_actividad,
      estado,
      revisado,
      glosa_rechazo,
   }) => {
      try {
         setIsLoading(true)
         const resp = await fetchToken(
            'task/checked-activity',
            { id_actividad, estado, revisado, glosa_rechazo },
            'PUT'
         )
         const body = await resp.json()

         if (body.ok) {
            fetchActivities()
            Alert({
               statusIcon: 'success',
               content: `La actividad ID: <strong>${id_actividad}</strong> ha sido ${revisado ? 'aprobada' : 'rechazada'}`,
               showCancelButton: false,
               showConfirmButton: false,
               timer: 2000
            })
         }
         else {
            Alert({
               message: 'error',
               title: 'Atención',
               content: body.response,
               showCancelButton: false,
            })
            setIsLoading(false)
         }
      } catch (err) {
         console.log(err)
         setIsLoading(false)
      }
   }

   const onDistribution = async ({ distribuciones = [], id_actividad }) => {
      try {
         setIsLoading(true)
         const resp = await fetchToken(
            'task/time-distribution',
            { distribuciones, id_actividad },
            'POST'
         )
         const body = await resp.json()

         if (body.ok) {
            fetchActivities()
            setIsLoading(true)
         }
         else{
            Alert({
               icon: 'error',
               title: 'Atención',
               content: body.response,
               showCancelButton: false,
            })
            setIsLoading(false)
         }

      } catch (err) {
         console.log(err)
         setIsLoading(false)
      }
   }

    const onPlayPause = async ({ id_actividad, mensaje, tipo_pausa }) => {
      setIsLoading(true)
      try {
         const resp = await fetchToken('task/play-pause', { id_actividad, mensaje, tipo_pausa }, 'POST')
         const body = await resp.json()

         setIsLoading(false)
         if (body.ok) fetchActivities()
         else {
            Alert({
               icon: 'error',
               title: 'Error',
               content: body.response,
               showCancelButton: false,
            })
         }
      } catch (err) {
         console.log(err)
         setIsLoading(false)
      }
   }

   useEffect(() => {
      fetchActivities()
      // eslint-disable-next-line
   }, [prFilters, prOrder]) 

   return {
      activitiesPR,
      total,
      toggleCheckActivity,
      onDistribution,
      onPlayPause
   }
}
