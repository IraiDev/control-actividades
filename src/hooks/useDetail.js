import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActivityContext } from '../context/ActivityContext'
import { UiContext } from '../context/UiContext'
import { Alert } from '../helpers/alerts'
import { fetchToken, fetchTokenFile } from '../helpers/fetch'
import { routes } from '../types/types'

export const useDetail = id => {
   const navigate = useNavigate()
   const { setIsLoading } = useContext(UiContext)
   const { filters, saveFilters, refresh, setRefresh } = useContext(ActivityContext)
   const [activity, setActivity] = useState({})
   const [detentions, setDetentions] = useState([])

   const fetchDetail = async () => {
      try {
         setIsLoading(true)
         const resp = await fetchToken(
            'task/get-task-ra',
            { id_actividad: id, es_detalle: true },
            'POST'
         )
         const body = await resp.json()
         const { ok, tareas } = body

         setIsLoading(false)
         if (ok) {
            setActivity(tareas[0])
         } else {
            navigate(routes.activity, { replace: true })
            Alert({
               icon: 'warn',
               title: 'Atención',
               content: 'La actividad apuntada no se encuentra disponible',
               showCancelButton: false,
               showConfirmButton: false,
               timer: 3000,
            })
         }
      } catch (e) {
         navigate(routes.activity, { replace: true })
         console.log('error fetch detail', e)
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
            fetchDetail()
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
            fetchDetail()
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

   const deleteNote = async ({ id_nota }) => {
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
            fetchDetail()
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
            fetchDetail()
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
            fetchDetail()
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

   const onPlayPause = async ({ id_actividad, mensaje }) => {
      setIsLoading(true)
      try {
         const resp = await fetchToken(
            'task/play-pause',
            { id_actividad, mensaje },
            'POST'
         )
         const body = await resp.json()
         setIsLoading(false)
         if (body.ok) {
            fetchDetail()
            getDetentions({ id_actividad: id })
         } else {
            Alert({
               icon: 'error',
               title: 'Error',
               content: 'Error al pausar/reanudar actividad',
               showCancelButton: false,
            })
         }
      } catch (err) {
         console.log(err)
         setIsLoading(false)
      }
   }

   const saveActivity = async payload => {
      setIsLoading(true)
      try {
         const resp = await fetchTokenFile(
            'task/editar-detalle-actividad',
            payload,
            'POST'
         )
         const body = await resp.json()
         setIsLoading(false)

         if (body.ok) {
            fetchDetail()
            Alert({
               content: 'Actividad actualizada',
               showCancelButton: false,
               showConfirmButton: false,
               statusIcon: 'success',
               timer: 1500,
            })
         } else {
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

   const cloneActivity = async payload => {
      setIsLoading(true)
      try {
         const resp = await fetchTokenFile(
            'task/clone-activity',
            payload,
            'POST'
         )
         const body = await resp.json()
         setIsLoading(false)

         if (body.ok) {
            Alert({
               content: 'Actividad clonada',
               statusIcon: 'success',
               showCancelButton: false,
               showConfirmButton: false,
               timer: 1500,
            })
            return body.ok
         } else {
            Alert({
               icon: 'error',
               title: 'Error',
               content: body.response,
               showCancelButton: false,
            })
            return body.ok
         }
      } catch (err) {
         console.log(err)
         setIsLoading(false)
      }
   }

   const deleteActivity = ({ id_actividad }) => {
      const action = async () => {
         try {
            const resp = await fetchToken(
               'task/delete-actividad',
               { id_actividad },
               'DELETE'
            )
            const body = await resp.json()

            if (body.ok) {
               navigate(routes.activity, { replace: true })
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

      Alert({
         icon: 'warn',
         title: 'Atención',
         content: '¿Está seguro que desea eliminar esta actividad?',
         cancelText: 'No, cancelar',
         confirmText: 'Si, eliminar',
         action,
      })
   }

   const deleteDocument = ({ id_docum, doc_name }) => {
      const action = async () => {
         setIsLoading(true)
         try {
            const resp = await fetchToken(
               'task/delete-docum',
               { id_docum },
               'DELETE'
            )
            const body = await resp.json()
            setIsLoading(false)

            if (body.ok) {
               setActivity({
                  ...activity,
                  tarea_documentos: activity.tarea_documentos.filter(
                     doc => doc.id_docum !== id_docum
                  ),
               })
            } else {
               Alert({
                  icon: 'error',
                  title: 'Error',
                  content: body.msg,
                  showCancelButton: false,
               })
            }
         } catch (err) {
            setIsLoading(false)
            console.log(err)
         }
      }

      Alert({
         icon: 'warn',
         title: 'Atención',
         content: `¿Desea eliminar el siguiente documento: <strong>${doc_name}</strong> ?`,
         confirmText: 'Si, eliminar',
         cancelText: 'No, cancelar',
         action,
      })
   }

   const getDetentions = async ({ id_actividad }) => {
      try {
         const resp = await fetchToken(
            'task/get-detentions',
            { id_actividad },
            'POST'
         )
         const body = await resp.json()
         const { ok, response } = body

         if (ok) {
            setDetentions(response)
            await fetchDetail()
         }
         else {
            Alert({
               icon: 'error',
               title: 'Atención',
               content: response,
               showCancelButton: false,
            })
         }
      } catch (err) {
         console.log(err)
      }
   }

   const createDetention = async ({
      id_det = id,
      fecha_inicio,
      fecha_detencion,
      hora_inicio,
      hora_detencion,
   }) => {
      try {
         const resp = await fetchToken(
            'task/create-pause',
            {
               id_det,
               fecha_inicio,
               fecha_detencion,
               hora_inicio,
               hora_detencion,
            },
            'POST'
         )
         const body = await resp.json()

         if (body.ok) {
            getDetentions({ id_actividad: id })
            Alert({
               content: 'Detención creada',
               statusIcon: 'success',
               showCancelButton: false,
               showConfirmButton: false,
               timer: 1500,
            })
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

   const updateDetention = async ({
      id_pausa,
      fecha_inicio,
      fecha_detencion,
      hora_inicio,
      hora_detencion,
   }) => {
      try {
         const resp = await fetchToken(
            'task/update-pause',
            {
               id_pausa,
               fecha_inicio,
               fecha_detencion,
               hora_inicio,
               hora_detencion,
            },
            'PUT'
         )
         const body = await resp.json()

         if (body.ok) {
            getDetentions({ id_actividad: id })
            Alert({
               content: 'Detención actualizada',
               statusIcon: 'success',
               showCancelButton: false,
               showConfirmButton: false,
               timer: 1500,
            })
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

   const deleteDetention = async ({ id_pausa }) => {
      try {
         const resp = await fetchToken(
            'task/delete-pause',
            { id_pausa },
            'DELETE'
         )
         const body = await resp.json()

         if (body.ok) {
            getDetentions({ id_actividad: id })
            Alert({
               content: 'Detención eliminada',
               statusIcon: 'success',
               showCancelButton: false,
               showConfirmButton: false,
               timer: 1500,
            })
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

   const toggleState = async ({
      id_actividad = id,
      estado = 3,
      mensaje_revision,
      tiempo_cliente = 0,
      tiempo_zionit = 0,
      rechazada = false 
   }) => {
      try {
         const resp = await fetchToken(
            'task/change-activity-state',
            { id_actividad, estado, mensaje_revision, tiempo_cliente, tiempo_zionit, rechazada },
            'POST'
         )
         const body = await resp.json()

         if (body.ok) {
            saveFilters({ payload: { reload: !filters.reload } })
            Alert({
               content: `La actividad ID: <strong>${id}</strong> paso a : <strong>Revisión</strong>`,
               statusIcon: 'success',
               showCancelButton: false,
               showConfirmButton: false,
               timer: 2000,
            })
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

   const getPredecessor = async ({ id_actividad = id, id_ticket }) => {
      try {
         setIsLoading(true)
         const resp = await fetchToken('task/get-predecesoras', { id_actividad, id_ticket }, 'POST')
         const body = await resp.json()

      if (body.ok) {
         setIsLoading(false)
         return {
            ok: body.ok,
            list: body.predecesoras,
            activities: body.actividades_relacionadas,
         }
      }
      else{
         setIsLoading(false)
         Alert({
            icon: 'error',
            title: 'Atención',
            content: body.response,
            showCancelButton: false,
         })
         return {
            ok: body.ok,
            list: [],
            activities: [],
         }
      }
      } catch (err) {
         console.log('error',err)
         setIsLoading(false)
      }
   }

   const updatePredecessor = async ({id_actividad = id, predecesoras  = []}) => {
      try {
         setIsLoading(true)
         const resp = await fetchToken('task/manage-predecesoras', { id_actividad, predecesoras  }, 'POST')
         const body = await resp.json()

      if (body.ok) {
         setRefresh(!refresh)
         setIsLoading(false)
      }
      else{
            setIsLoading(false)
            Alert({
               icon: 'error',
               title: 'Atención',
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
      id && fetchDetail()
      id && getDetentions({ id_actividad: id })

      return () => null
      // eslint-disable-next-line
   }, [id, refresh])

   return {
      activity,
      detentions,
      newNote,
      updateNote,
      deleteNote,
      updatePriority,
      onPlayPause,
      updatePriorityAndAddNote,
      saveActivity,
      cloneActivity,
      deleteDocument,
      deleteActivity,
      createDetention,
      updateDetention,
      deleteDetention,
      toggleState,
      updatePredecessor,
      getPredecessor
   }
}
