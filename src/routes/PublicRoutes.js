import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { ActivityContext } from '../context/ActivityContext'
import { routes } from '../types/types'

const PublicRoutes = ({ children }) => {

   const { user } = useContext(ActivityContext)

   const lastPath = window.localStorage.getItem('to-do-lastPath') || routes.activity

   return user.ok ? <Navigate to={lastPath} /> : children
}

export default PublicRoutes
