const MarkActivity = ({
   content, 
   color = 'bg-amber-200/80', 
   isChild, 
   position = 'absolute -top-3 right-1/2 transform translate-x-1/2'
}) => {
   return (
      <div className={`bg-white rounded-md ${position}`}>
         <span 
            className={`
               flex items-center gap-2 text-amber-600 font-bold px-2 py-1 rounded-md shadow-md text-xs
               ${color}
            `}
            title={isChild ? 'ID actividad padre' : 'Actividad padre'}
         >
            <i className={isChild ? 'fas fa-child': 'fas fa-hat-cowboy' } />
            {content}
         </span>
      </div>
   )
}

export default MarkActivity