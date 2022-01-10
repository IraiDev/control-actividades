import { useContext, useEffect } from 'react'
import useIsSignedIn from './hooks/useSignedIn'
import { getFetch } from './helpers/fetchingGraph'
import { ActivityContext } from './context/ActivityContext'
import AppRouter from './routes/AppRouter'

const App = () => {

  const { login } = useContext(ActivityContext)
  const [isSigendIn] = useIsSignedIn()

  const onLogin = async () => {
    await getFetch('/me/').then(resp => {
      login({ email: resp.mail })
    })
  }

  useEffect(() => {
    isSigendIn && onLogin()
    // eslint-disable-next-line
  }, [isSigendIn])

  return (
    <AppRouter />
  )
}

export default App