import { useEffect, useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import { routes } from '../types/types'
import { ActivityContext } from '../context/ActivityContext';
import Detail from '../pages/Detail'
import Planner from '../pages/Planner'
import Times from '../pages/Times'
import Todo from '../pages/Todo'
import NavBar from '../components/ui/NavBar'
import Activity from '../pages/Activity';

const { home, activity, planner, times, todo } = routes

const DashRoutes = () => {

   const { getFilters } = useContext(ActivityContext)

   useEffect(() => {
      getFilters()
      // eslint-disable-next-line
   }, [])

   return (
      <main className='bg-neutral-100 min-h-screen w-full'>
         <NavBar />
         <Routes>
            <Route path={activity} element={<Activity />} />
            <Route path={activity + '/detalle-actividad/:id'} element={<Detail />} />
            <Route path={home + '/detalle-actividad/:id'} element={<Detail />} />
            <Route path={times} element={<Times />} />
            <Route path={planner} element={<Planner />} />
            <Route path={todo} element={<Todo />} />
            <Route path={home} element={<Activity />} />
         </Routes>
      </main>
   )
}

export default DashRoutes
