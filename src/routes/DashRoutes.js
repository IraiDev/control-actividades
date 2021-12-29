import { Routes, Route } from 'react-router-dom'
import Activity from '../components/screen/Activity'
import Detail from '../components/screen/Detail'
import Planner from '../components/screen/Planner'
import Todo from '../components/screen/Todo'
import NavBar from '../components/ui/NavBar'

const DashRoutes = () => {
   return (
      <>
         <NavBar />
         <Routes>
            <Route path="actividades" element={<Activity />} />
            <Route path="actividades/detalle-actividad/:id" element={<Detail />} />
            <Route path="informe-tiempos" element={<h1>Home</h1>} />
            <Route path="planner" element={<Planner />} />
            <Route path="to-do/:id" element={<Todo />} />
            <Route path="/" element={<Planner />} />
         </Routes>
      </>
   )
}

export default DashRoutes
