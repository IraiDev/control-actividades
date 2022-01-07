import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { ActivityContext } from '../context/ActivityContext'
import { routes } from '../types/types'

const PublicRoutes = ({ children }) => {

   const { isLogin } = useContext(ActivityContext)

   const lastPath = window.localStorage.getItem('to-do-lastPath') || routes.activity

   return isLogin ? <Navigate to={lastPath} /> : children
}

export default PublicRoutes
