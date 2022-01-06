import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UiContext } from '../context/UiContext'
import { Alert } from '../helpers/alerts'
import { fetchToken, fetchTokenFile } from '../helpers/fetch'
import { routes } from '../types/types'

export const useDetail = (id) => {

  const navigate = useNavigate()
  const { setIsLoading } = useContext(UiContext)
  const [activity, setActivity] = useState({})

  const fetchDetail = async () => {
    try {
      setIsLoading(true)
      const resp = await fetchToken('task/get-task-ra', { id_actividad: id, es_detalle: true }, 'POST')
      const body = await resp.json()
      const { ok, tareas } = body

      setIsLoading(false)
      if (ok) { setActivity(tareas[0]) }
      else { console.log('Error') }

    } catch (e) {
      console.log(e)
      setIsLoading(false)
    }
  }

  const newNote = async ({ id_actividad, description }) => {
    setIsLoading(true)
    try {
      const resp = await fetchToken('task/create-note', { id_actividad, description }, 'POST')
      const body = await resp.json()
      if (body.ok) { fetchDetail() }
      else {
        Alert({
          icon: 'error',
          title: 'Error',
          content: 'Error al crear nota',
          showCancelButton: false
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
      const resp = await fetchToken('task/update-note', { id_nota, description, id_actividad }, 'PUT')
      const body = await resp.json()
      setIsLoading(false)
      if (body.ok) { fetchDetail() }
      else {
        Alert({
          icon: 'error',
          title: 'Error',
          content: 'Error al modificar nota',
          showCancelButton: false
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
      const resp = await fetchToken('task/delete-note', { id_nota }, 'DELETE')
      const body = await resp.json()
      setIsLoading(false)
      if (body.ok) { fetchDetail() }
      else {
        Alert({
          icon: 'error',
          title: 'Error',
          content: 'Error al eliminar nota',
          showCancelButton: false
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
      const resp = await fetchToken('task/update-priority', { prioridad_numero, id_actividad }, 'POST')
      const body = await resp.json()
      setIsLoading(false)
      if (body.ok) { fetchDetail() }
      else {
        Alert({
          icon: 'error',
          title: 'Error',
          content: 'Error al actualziar prioridad de actividad',
          showCancelButton: false
        })
      }
    } catch (err) {
      setIsLoading(false)
      console.log(err)
    }
  }

  const updatePriorityAndAddNote = async ({ prioridad_numero, id_actividad, description }) => {
    setIsLoading(true)
    try {
      const resp = await fetchToken('task/update-priority', { prioridad_numero, id_actividad }, 'POST')
      const body = await resp.json()
      const resp2 = await fetchToken('task/create-note', { id_actividad, description }, 'POST')
      const body2 = await resp2.json()
      setIsLoading(false)
      if (body.ok && body2.ok) { fetchDetail() }
      else {
        Alert({
          icon: 'error',
          title: 'Error',
          content: 'Error al actualziar prioridad de actividad y agregar nota',
          showCancelButton: false
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
      const resp = await fetchToken('task/play-pause', { id_actividad, mensaje }, 'POST')
      const body = await resp.json()
      setIsLoading(false)
      if (body.ok) { fetchDetail() }
      else {
        Alert({
          icon: 'error',
          title: 'Error',
          content: 'Error al pausar/reanudar actividad',
          showCancelButton: false
        })
      }
    } catch (err) {
      console.log(err)
      setIsLoading(false)
    }
  }

  const saveActivity = async (payload) => {
    setIsLoading(true)
    try {
      const resp = await fetchTokenFile('task/editar-detalle-actividad', payload, 'POST')
      const body = await resp.json()
      setIsLoading(false)

      if (body.ok) {
        fetchDetail()
        Alert({
          title: 'Actividad actualizada',
          content: 'Cambios guardados correctamente',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 2000
        })
      } else {
        Alert({
          icon: 'error',
          title: 'Error',
          content: body.response,
          showCancelButton: false
        })
      }
    } catch (err) {
      console.log(err)
      setIsLoading(false)
    }
  }

  const cloneActivity = async (payload) => {
    setIsLoading(true)
    try {
      const resp = await fetchTokenFile('task/clone-activity', payload, 'POST')
      const body = await resp.json()
      setIsLoading(false)

      if (body.ok) {
        Alert({
          title: 'Atención',
          content: 'Actividad creada!',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 2000
        })
        return body.ok
      } else {
        Alert({
          icon: 'error',
          title: 'Error',
          content: body.response,
          showCancelButton: false
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
        const resp = await fetchToken('task/delete-actividad', { id_actividad }, 'DELETE')
        const body = await resp.json()

        if (body.ok) { navigate(routes.activity, { replace: true }) }
        else {
          Alert({
            icon: 'error',
            title: 'Error',
            content: 'Error al eliminar actividad',
            showCancelButton: false
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
      action
    })
  }

  const deleteDocument = ({ id_docum, doc_name }) => {

    const action = async () => {
      setIsLoading(true)
      try {
        const resp = await fetchToken('task/delete-docum', { id_docum }, 'DELETE')
        const body = await resp.json()
        setIsLoading(false)

        if (body.ok) {
          setActivity({ ...activity, tarea_documentos: activity.tarea_documentos.filter(doc => doc.id_docum !== id_docum) })
        } else {
          Alert({
            icon: 'error',
            title: 'Error',
            content: body.msg,
            showCancelButton: false
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
      action
    })

  }

  useEffect(() => {
    fetchDetail()
    // eslint-disable-next-line
  }, [])

  return {
    activity,
    newNote,
    updateNote,
    deleteNote,
    updatePriority,
    onPlayPause,
    updatePriorityAndAddNote,
    saveActivity,
    cloneActivity,
    deleteDocument,
    deleteActivity
  }

}