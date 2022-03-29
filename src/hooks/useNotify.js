import { useState, useEffect } from 'react'
import { Alert } from '../helpers/alerts'
import { fetchToken } from '../helpers/fetch'

export const useNotify = () => {
  const [notify, setNotify] = useState([])

  const fetchNotify = async () => {
    try {
      const resp = await fetchToken('task/get-notifications')
      const body = await resp.json()
      const { ok, notificaciones } = body

      console.log(body)

      // TODO: aqui hay que trabajar mañana

      if (ok) {
        setNotify(notificaciones)
      }
      else { console.log('Error') }

    } catch (err) {
      console.log(err)
    }
  }

  const markNotifications = async ({ id_nota }) => {
    const resp = await fetchToken('task/update-notification', { id_nota }, 'POST')
    const body = await resp.json()

    if (body.ok) {
      if (id_nota === undefined) return setNotify([])
      setNotify(notify.filter(n => n.id_nota !== id_nota))
    }
    else Alert({
      icon: 'error',
      title: 'Error',
      content: 'Error al marcar las notificaciones',
      showCancelButton: false
    })
  }

  useEffect(() => {
    fetchNotify()
  }, [])

  return { notify, markNotifications }
}