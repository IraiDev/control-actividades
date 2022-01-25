import React, { createContext, useState } from 'react'
import { fetchToken } from '../helpers/fetch'
import { Alert } from '../helpers/alerts'

const initFilters = {
  estado: '',
  proyecto: [],
  encargado: [],
  solicitante: [],
  subProy: [],
  color: '',
  id_actividad: '',
  titulo: '',
  prioridad_ra: '',
  usuario_no_mostrar: '',
  entrabajo: '',
  offset: 0,
  limit: 12,
}

export const ActivityContext = createContext()

function ActivityProvider({ children }) {
  const [user, setUser] = useState({ ok: false })
  const [optionsArray, setOptionsArray] = useState({})
  const [filters, setFilters] = useState(initFilters)
  const [order, setOrder] = useState({})
  const [pager, setPager] = useState({ page: 1, limit: 12 })

  const login = async ({ email }) => {
    try {
      const resp = await fetchToken('auth/login', { email }, 'POST')
      const body = await resp.json()

      if (body.ok) {
        localStorage.setItem('tokenBackend', body.token)
        setUser({
          ok: true,
          name: body.usuario.nombre,
          id: body.usuario.id,
          email: body.usuario.email,
          low_priority: body.usuario.color_prioridad_baja,
          medium_priority: body.usuario.color_prioridad_media,
          high_priority: body.usuario.color_prioridad_alta,
        })
      } else {
        Alert({
          icon: 'error',
          content: `Error al inciar sesion en el registro de avances, 
                  no podras acceder a las funcionalidades del RA, por favor recarga la pagina, 
                  si el error persiste comunicate con Ignacio, saludos.`,
          title: 'Error inicio de sesion',
          showCancelButton: false,
        })
      }
    } catch (error) {
      console.log('login error: ', error)
    }
  }

  const getFilters = async () => {
    try {
      const resp = await fetchToken('task/get-filters')
      const body = await resp.json()

      if (body.ok) {
        setOptionsArray({
          subProjects: body.subproyectos.map(item => {
            return {
              label: item.nombre_sub_proy,
              value: item.id_sub_proyecto,
              id: item.id_proyecto,
            }
          }),
          projects: body.proyectos.map(item => {
            return {
              label: item.abrev,
              value: item.id_proy,
            }
          }),
          priorities: body.prioridades.map(item => {
            return {
              label: item.nombre,
              value: item.color,
            }
          }),
          status: body.estados.map(item => {
            return {
              label: item.desc_estado,
              value: item.id_estado,
            }
          }),
          users: body.usuarios.map(item => {
            return {
              label: item.abrev_user,
              value: item.abrev_user,
            }
          }),
        })
      } else {
        Alert({
          icon: 'error',
          title: 'Error',
          content: 'Error al obtener los filtros',
          showCancelButton: false,
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const saveFilters = ({ reset = false, payload }) => {
    if (reset) {
      setFilters(initFilters)
      setPager({ page: 1, limit: 12 })
    } else {
      setFilters(Object.assign({}, filters, payload))
    }
  }

  const value = {
    login,
    user,
    getFilters,
    optionsArray,
    filters,
    saveFilters,
    setOrder,
    order,
    setPager,
    pager,
  }
  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  )
}

export default ActivityProvider
