const TICKET_URL = process.env.REACT_APP_TICKETS_URL

export const routes = {
   home: '/',
   login: '/login',
   activity: '/actividades',
   planner: '/planner',
   times: '/informe-tiempos',
   todo: '/to-do/:id',
   plataforma_clientes: TICKET_URL,
}
