import { HashRouter, Route, Routes } from 'react-router-dom'
import Login from '../components/screen/Login'
import DashRoutes from './DashRoutes'
import PrivateRoutes from './PrivateRoutes'
import PublicRoutes from './PublicRoutes'

const AppRouter = () => (
   <HashRouter>
      <Routes>
         <Route path="/login" element={
            <PublicRoutes>
               <Login />
            </PublicRoutes>
         } />

         <Route path="/*" element={
            <PrivateRoutes>
               <DashRoutes />
            </PrivateRoutes>
         } />
      </Routes>
   </HashRouter>
)

export default AppRouter
