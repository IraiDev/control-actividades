import { useState } from 'react'
import OnOutsiceClick from 'react-outclick'
import Button from './Button'

const FloatMenu = ({ name, value, onChange, onClick, reset }) => {
   const [showContextMenu, setShowContextMenu] = useState(false)

   const validation = value === '' || value === '0'

   return (
      <main className='relative z-5s0'>
         <Button
            size='w-11 h-7'
            title='pasa actividad a E.T'
            className='hover:bg-black/5'
            onClick={() => {
               reset()
               setShowContextMenu(true)
            }}>
            <i className='fas fa-hammer fa-sm' />
            <i className='fas fa-chevron-right fa-sm' />
         </Button>
         {showContextMenu && (
            <OnOutsiceClick
               onOutsideClick={() => {
                  setShowContextMenu(false)
                  reset()
               }}>
               <div className='p-4 pb-2.5 bg-white absolute bottom-8 left-5 text-slate-600 rounded-md shadow-lg border z-50'>
                  <h1 className='text-xs font-semibold'>
                     Ingrese tiempo estimado
                  </h1>
                  <p className='text-xs text-slate-400 my-3'>
                     (Por defecto 1 hora)
                  </p>
                  <div className='relative'>
                     <input
                        type='text'
                        className={`border-b outline-none p-1 ${
                           validation
                              ? 'focus:border-red-500 border-red-500'
                              : 'focus:border-blue-500'
                        }`}
                        placeholder='EJ: 2.4'
                        name={name}
                        value={value}
                        onChange={onChange}
                        onKeyPress={e => {
                           if (!/[\d.]/.test(e.key)) {
                              // Allow only numbers and dots
                              e.preventDefault()
                           }
                        }}
                     />
                     {validation && (
                        <span className='text-red-500 absolute -bottom-5 right-4'>
                           valor no valido
                        </span>
                     )}
                  </div>
                  <footer className='flex items-baseline gap-2 mt-4'>
                     <Button
                        className='text-red-500 hover:bg-red-100 rounded-full'
                        onClick={() => setShowContextMenu(false)}>
                        Cancelar
                     </Button>
                     <Button
                        disabled={validation}
                        className='text-emerald-500 hover:bg-emerald-100 rounded-full disabled:hover:bg-transparent'
                        onClick={() => {
                           onClick()
                           setShowContextMenu(false)
                        }}>
                        Aceptar
                     </Button>
                  </footer>
                  <div className='w-4 h-4 bg-white absolute -bottom-1 left-3 transform rotate-45 z-10' />
               </div>
            </OnOutsiceClick>
         )}
      </main>
   )
}

export default FloatMenu
