import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { ActivityContext } from '../context/ActivityContext'
import { routes } from '../types/types'

const PrivateRoutes = ({ children }) => {

   const { user } = useContext(ActivityContext)
   const { pathname, search } = useLocation()

   window.localStorage.setItem('to-do-lastPath', pathname + search)

   return user.ok ? children : <Navigate to={routes.login} />
}

export default PrivateRoutes
