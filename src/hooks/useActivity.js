import { useContext, useEffect, useState } from 'react'
import { ActivityContext } from '../context/ActivityContext'
import { UiContext } from '../context/UiContext'
import { Alert } from '../helpers/alerts'
import { fetchToken } from '../helpers/fetch'

export const useActivity = () => {
   const { setIsLoading } = useContext(UiContext)
   const { filters, order, setActivityRunning } = useContext(ActivityContext)
   const [activities, setActivities] = useState([])
   const [total, setTotal] = useState(0)

   const fetchActivities = async () => {
      try {
         setIsLoading(true)
         const resp = await fetchToken(
            `task/get-task-ra`,
            { ...filters, ...order },
            'POST'
         )
         const body = await resp.json()
         const { ok, tareas, total_tareas } = body
         
         setIsLoading(false)

         if (ok) {
            setActivities(tareas)
            setTotal(total_tareas)
         } else {
            console.log('Error')
         }
      } catch (e) {
         console.log(e)
         setIsLoading(false)
      }
   }

   const newNote = async ({ id_actividad, description }) => {
      setIsLoading(true)
      try {
         const resp = await fetchToken(
            'task/create-note',
            { id_actividad, description },
            'POST'
         )
         const body = await resp.json()
         if (body.ok) {
            fetchActivities()
         } else {
            Alert({
               icon: 'error',
               title: 'Error',
               content: 'Error al crear nota',
               showCancelButton: false,
            })
            setIsLoading(false)
         }
      } catch (err) {
         console.log(err)
         setIsLoading(false)
      }
   }

   const updateNote = async ({ id_nota, description, id_actividad }) => {
      setIsLoading(true)
      try {
         const resp = await fetchToken(
            'task/update-note',
            { id_nota, description, id_actividad },
            'PUT'
         )
         const body = await resp.json()
         setIsLoading(false)
         if (body.ok) {
            setActivities(
               activities.map(act =>
                  act.id_det === id_actividad
                     ? {
                          ...act,
                          notas: act.notas.map(note =>
                             note.id_nota === id_nota
                                ? { ...note, desc_nota: description }
                                : note
                          ),
                       }
                     : act
               )
            )
         } else {
            Alert({
               icon: 'error',
               title: 'Error',
               content: 'Error al modificar nota',
               showCancelButton: false,
            })
         }
      } catch (err) {
         setIsLoading(false)
         console.log(err)
      }
   }

   const deleteNote = async ({ id_nota, id_actividad }) => {
      setIsLoading(true)
      try {
         const resp = await fetchToken(
            'task/delete-note',
            { id_nota },
            'DELETE'
         )
         const body = await resp.json()
         setIsLoading(false)
         if (body.ok) {
            setActivities(
               activities.map(act =>
                  act.id_det === id_actividad
                     ? {
                          ...act,
                          notas: act.notas.filter(
                             note => note.id_nota !== id_nota
                          ),
                       }
                     : act
               )
            )
         } else {
            Alert({
               icon: 'error',
               title: 'Error',
               content: 'Error al eliminar nota',
               showCancelButton: false,
            })
         }
      } catch (err) {
         setIsLoading(false)
         console.log(err)
      }
   }

   const updatePriority = async ({ prioridad_numero, id_actividad }) => {
      setIsLoading(true)
      try {
         const resp = await fetchToken(
            'task/update-priority',
            { prioridad_numero, id_actividad },
            'POST'
         )
         const body = await resp.json()
         setIsLoading(false)
         if (body.ok) {
            setActivities(
               activities.map(act =>
                  act.id_det === id_actividad
                     ? { ...act, prioridad_etiqueta: prioridad_numero }
                     : act
               )
            )
         } else {
            Alert({
               icon: 'error',
               title: 'Error',
               content: 'Error al actualziar prioridad de actividad',
               showCancelButton: false,
            })
         }
      } catch (err) {
         setIsLoading(false)
         console.log(err)
      }
   }

   const updatePriorityAndAddNote = async ({
      prioridad_numero,
      id_actividad,
      description,
   }) => {
      setIsLoading(true)
      try {
         const resp = await fetchToken(
            'task/update-priority',
            { prioridad_numero, id_actividad },
            'POST'
         )
         const body = await resp.json()
         const resp2 = await fetchToken(
            'task/create-note',
            { id_actividad, description },
            'POST'
         )
         const body2 = await resp2.json()
         setIsLoading(false)
         if (body.ok && body2.ok) {
            fetchActivities()
         } else {
            Alert({
               icon: 'error',
               title: 'Error',
               content:
                  'Error al actualziar prioridad de actividad y agregar nota',
               showCancelButton: false,
            })
         }
      } catch (err) {
         setIsLoading(false)
         console.log(err)
      }
   }

   const onPlayPause = async ({ id_actividad, mensaje, tipo_pausa }) => {
      setIsLoading(true)
      try {
         const resp = await fetchToken('task/play-pause', { id_actividad, mensaje, tipo_pausa }, 'POST')
         const body = await resp.json()

         setIsLoading(false)
         if (body.ok) {
            setActivityRunning({id: id_actividad, isRunning: mensaje === undefined})
            fetchActivities()
         }
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

   const toggleState = async ({ id_actividad, estado, tiempo_estimado}) => {
      try {
         const resp = await fetchToken(
            'task/change-activity-state',
            { id_actividad, estado, tiempo_estimado },
            'POST'
         )
         const body = await resp.json()

         if (body.ok) {
            setActivityRunning({id: id_actividad, isRunning: Number(tiempo_estimado) > 0})
            fetchActivities()
         } else {
            Alert({
               icon: 'error',
               title: 'Atención',
               content: body.response,
               showCancelButton: false,
            })
         }
      } catch (err) {
         console.log(err)
      }
   }

   const deleteActivity = async ({ id_actividad }) => {
      try {
         const resp = await fetchToken('task/delete-actividad',  { id_actividad }, 'DELETE')
         const body = await resp.json()

         if (body.ok) {
            fetchActivities()
            Alert({
               content: 'Actividad eliminada!',
               statusIcon: 'success',
               showCancelButton: false,
               showConfirmButton: false,
               timer: 1500,
            })
         } else {
            Alert({
               icon: 'error',
               title: 'Error',
               content: 'Error al eliminar actividad',
               showCancelButton: false,
            })
         }
      } catch (err) {
         console.log(err)
      }
   }

   useEffect(() => {
      fetchActivities()
      // eslint-disable-next-line
   }, [filters, order])

   return {
      activities,
      total,
      newNote,
      updateNote,
      deleteNote,
      updatePriority,
      onPlayPause,
      updatePriorityAndAddNote,
      getActivities: fetchActivities,
      toggleState,
      deleteActivity,
   }
}
