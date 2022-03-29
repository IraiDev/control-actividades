import React, { createContext, useState } from 'react'
import Loading from '../components/ui/Loading'

export const UiContext = createContext()

const UiProvider = ({ children }) => {

  const [isLoading, setIsLoading] = useState(false)
  const [view, setView] = useState(true)
  const [idSelect, setIdSelect] = useState(null)

  return (
    <UiContext.Provider value={{
      isLoading,
      setIsLoading,
      view,
      setView,
      setIdSelect,
      idSelect
    }}>
      <>
        {children}
        <Loading show={isLoading} />
      </>
    </UiContext.Provider>
  )
}

export default UiProvider