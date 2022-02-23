const AlertBar = ({ validation }) => {
   return (
      <span
         className={`rounded-md text-red-500 text-sm py-2 px-2.5 block w-max mx-auto my-2
      ${validation ? 'bg-red-100' : 'bg-transparent'}`}>
         {validation && (
            <>
               completa los campos requeridos para crear/clonar una actividad,
               <strong> campos requeridos (*)</strong>
            </>
         )}
      </span>
   )
}

export default AlertBar
