import { useEffect, useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import { routes } from '../types/types'
import { ActivityContext } from '../context/ActivityContext';
import Activity from '../components/screen/Activity'
import Detail from '../components/screen/Detail'
import Planner from '../components/screen/Planner'
import Times from '../components/screen/Times'
import Todo from '../components/screen/Todo'
import NavBar from '../components/ui/NavBar'

const { home, activity, planner, times, todo } = routes

const DashRoutes = () => {

   const { getFilters } = useContext(ActivityContext)

   useEffect(() => {
      getFilters()
      // eslint-disable-next-line
   }, [])

   return (
      <main className='bg-slate-50 min-h-screen w-full'>
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
