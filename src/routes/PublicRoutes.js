import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { ActivityContext } from '../context/ActivityContext'

const PublicRoutes = ({ children }) => {

   const { isLogin } = useContext(ActivityContext)

   return isLogin ? <Navigate to='/' /> : children
}

export default PublicRoutes
