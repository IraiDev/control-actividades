

const AlertBar = ({ validation, customMsg, isCustom = false, position = '-top-4'}) => {
   return (
      <span
         className={`

            rounded-md text-red-500 text-sm py-2 px-2.5 block w-max mx-auto my-2
            sticky z-50
            ${validation ? 'bg-red-100' : 'bg-transparent'}
            ${position}
            
         `}
      >
         {validation && (
            <>
               {isCustom ? 
                  <>
                     completa los campos requeridos para crear/clonar una actividad,
                     <strong> campos requeridos (*)</strong>
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
