import { HashRouter, Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import DashRoutes from './DashRoutes'
import PrivateRoutes from './PrivateRoutes'
import PublicRoutes from './PublicRoutes'
import { routes } from '../types/types'

const AppRouter = () => (
   <HashRouter>
      <Routes>
         <Route path={routes.login} element={
            <PublicRoutes>
               <Login />
            </PublicRoutes>
         } />

         <Route path='/*' element={
            <PrivateRoutes>
               <DashRoutes />
            </PrivateRoutes>
         } />
      </Routes>
   </HashRouter>
)

export default AppRouter
