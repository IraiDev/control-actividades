import { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import { ActivityContext } from '../context/ActivityContext'

const PrivateRoutes = ({ children }) => {

   const { isLogin } = useContext(ActivityContext)

   return isLogin ? children : <Navigate to='/login' />
}

export default PrivateRoutes
