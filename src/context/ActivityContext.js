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
}

export const ActivityContext = createContext()

function ActivityProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false)
  const [user, setUser] = useState({ ok: false })
  const [optionsArray, setOptionsArray] = useState({})
  const [filters, setFilters] = useState(initFilters)
  const [order, setOrder] = useState({})

  const login = async (email) => {
    try {
      const resp = await fetchToken('auth/login', { email }, 'POST')
      const body = await resp.json()

      if (body.ok) {
        localStorage.setItem('tokenBackend', body.token)
        setUser(body.usuario)
      } else {
        Alert({ icon: 'error', content: body.msg, title: 'Error inicio de sesion', timer: 3000, showCancelButton: false })
      }
      // UiFunc.setIsLoading(false)
    } catch (error) {
      console.log("login error: ", error)
    }
  }

  const logout = () => {
    localStorage.removeItem('tokenBackend')
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
              id: item.id_proyecto
            }
          }),
          projects: body.proyectos.map(item => {
            return {
              label: item.abrev,
              value: item.id_proy
            }
          }),
          priorities: body.prioridades.map(item => {
            return {
              label: item.nombre,
              value: item.color
            }
          }),
          status: body.estados.map(item => {
            return {
              label: item.desc_estado,
              value: item.id_estado
            }
          }),
          users: body.usuarios.map(item => {
            return {
              label: item.abrev_user,
              value: item.abrev_user
            }
          })
        })
      } else {
        Alert({ icon: 'error', title: 'Error', content: 'Error al obtener los filtros', showCancelButton: false })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const saveFilters = ({ reset = false, payload }) => {
    if (reset) {
      setFilters(initFilters)
    } else {
      setFilters(Object.assign({}, filters, payload))
    }
  }

  const getTimes = async () => {
    try {
      const resp = await fetchToken('task/get-times')
      const body = await resp.json()

      if (body.ok) { }
      else Alert({ icon: 'error', title: 'Error', content: 'Error al obtener los tiempos de los usuarios', timer: 3000, showCancelButton: false })

    } catch (error) {
      console.log("getTimes error: ", error)
    }
  }

  const value = {
    setIsLogin,
    isLogin,
    login,
    user,
    getFilters,
    optionsArray,
    filters,
    saveFilters,
    setOrder,
    order
  }
  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  )
}

export default ActivityProvider
