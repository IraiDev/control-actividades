import { useEffect, useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Activity from '../components/screen/Activity'
import Detail from '../components/screen/Detail'
import Planner from '../components/screen/Planner'
import Todo from '../components/screen/Todo'
import NavBar from '../components/ui/NavBar'
import { ActivityContext } from '../context/ActivityContext';
import { routes } from '../types/types'

const { home, activity, planner, times, todo } = routes

const DashRoutes = () => {

   const { getFilters } = useContext(ActivityContext)

   useEffect(() => {
      getFilters()
      // eslint-disable-next-line
   }, [])

   return (
      <>
         <NavBar />
         <Routes>
            <Route path={activity} element={<Activity />} />
            <Route path={activity + '/detalle-actividad/:id'} element={<Detail />} />
            <Route path={times} element={<h1>Home</h1>} />
            <Route path={planner} element={<Planner />} />
            <Route path={todo} element={<Todo />} />
            <Route path={home} element={<Planner />} />
         </Routes>
      </>
   )
}

export default DashRoutes
