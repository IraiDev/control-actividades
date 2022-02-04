import { useContext, useEffect, useState } from 'react'
import { ActivityContext } from '../context/ActivityContext'
import { UiContext } from '../context/UiContext'
import { Alert } from '../helpers/alerts'
import { fetchToken } from '../helpers/fetch'

export const useActivity = () => {
  const { setIsLoading } = useContext(UiContext)
  const { filters, order } = useContext(ActivityContext)
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
      const resp = await fetchToken('task/delete-note', { id_nota }, 'DELETE')
      const body = await resp.json()
      setIsLoading(false)
      if (body.ok) {
        setActivities(
          activities.map(act =>
            act.id_det === id_actividad
              ? {
                  ...act,
                  notas: act.notas.filter(note => note.id_nota !== id_nota),
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
          content: 'Error al actualziar prioridad de actividad y agregar nota',
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
        fetchActivities()
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
  }
}
