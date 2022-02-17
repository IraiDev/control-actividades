import { Login as MSFLogin } from '@microsoft/mgt-react'
import logo25x25 from '../assets/img/logo25x25.png'
import login from '../assets/img/login.jpg'

const Login = () => {
   return (
      <main className='flex items-center h-screen w-full relative'>
         <div className='fixed top-0 right-0 left-0 bottom-0 z-10'>
            <img className='object-cover w-full h-full' src={login} alt='wall-login' />
         </div>
         <section className='mx-auto bg-white rounded-md shadow-2xl w-96 p-7 z-20 text-center grid gap-4'>
            <header className='flex justify-center'>
               <img className='h-full pt-1 mr-2' src={logo25x25} alt='Zionit' />
               <h1 className='text-2xl font-semibold'>ZionIT</h1>
            </header>
            <h1 className='text-lg'>Control de Actividades</h1>
            <h5 className='text-sm text-gray-500'>
               Inicia sesion con tu cuenta de microsoft
            </h5>
            <button className='border border-blue-500 w-max mx-auto'>
               <MSFLogin />
            </button>
         </section>
      </main>
   )
}

export default Login
