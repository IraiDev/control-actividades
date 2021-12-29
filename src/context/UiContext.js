import React, { createContext, useState } from 'react'
import Loading from '../components/ui/Loading'
import { clearParams } from '../helpers/helpersFunc'

export const UiContext = createContext()

const UiProvider = ({ children }) => {

  const [isLoading, setIsLoading] = useState(false)

  const [filters, setFilters] = useState('')

  const saveFilters = (param, value = '') => {
    let clearing = clearParams(filters, param)
    let newValue = `${clearing}${value}`
    setFilters(newValue)
    return newValue === '' ? '_' : newValue
  }

  const saveFiltersController = (param1, param2, value = '') => {
    let clearing1 = clearParams(filters, param1)
    let clearing2 = clearParams(clearing1, param2)
    let newValue = `${clearing2}${value}`
    setFilters(newValue)
    return newValue
  }

  const saveFiltersInputs = (param1, param2, param3, value = '') => {
    let clearing1 = clearParams(filters, param1)
    let clearing2 = clearParams(clearing1, param2)
    let clearing3 = clearParams(clearing2, param3)
    let newValue = `${clearing3}${value}`
    setFilters(newValue)
    return newValue
  }

  return (
    <UiContext.Provider value={{
      isLoading,
      setIsLoading,
    }}>
      <>
        {children}
        <Loading show={isLoading} />
      </>
    </UiContext.Provider>
  )
}

export default UiProvider