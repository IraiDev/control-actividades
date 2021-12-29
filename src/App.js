import { useContext, useEffect } from 'react'
import useIsSignedIn from './hooks/useSignedIn'
import { getFetch } from './helpers/fetchingGraph'
import { ActivityContext } from './context/ActivityContext'
import AppRouter from './routes/AppRouter'

const App = () => {

  const { login, setIsLogin } = useContext(ActivityContext)
  const [isSigendIn] = useIsSignedIn()

  useEffect(() => {
    // !isSigendIn && ActFunc.logout()
    setIsLogin(isSigendIn)

    const onLogin = async () => {
      await getFetch('/me/').then(resp => {
        login(resp.mail)
      })
    }

    if (isSigendIn) {
      onLogin()
    }
    console.log('estado login', isSigendIn)
  }, [isSigendIn])

  return (
    <AppRouter />
  )
}

export default App