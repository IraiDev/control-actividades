

const AlertBar = ({ validation, customMsg, isCustom = false, position = '-top-4', fields = [] }) => {
   return (
      <span
         className={`

            rounded-md text-red-500 text-sm py-2 px-2.5 block w-max mx-auto my-2
            sticky z-30 font-semibold
            ${validation ? 'bg-red-100' : 'bg-transparent'}
            ${position}
            
         `}
      >
         {validation && (
            <>
               {isCustom ?
                  <>
                     completa los campos requeridos para crear/clonar una actividad,
                     <p className='font-bold inline'> campos requeridos (*)</p>
                     <div className='flex gap-1 mt-2'>
                        Campos faltantes:
                        {
                           fields.length > 0 &&
                           fields.map((f, i) => (
                              <span className='font-bold' key={f.label}>
                                 {f.label}{i === fields.length - 1 ? '.' : ', '}
                              </span>
                           ))
                        }
                     </div>
                  </>
                  :
                  <>{customMsg}</>
               }
            </>
         )}
      </span>
   )
}

export default AlertBar
