const Numerator = ({ number, className }) => {
   return (
      <div className='rounded bg-white shadow'>
         <span
            className={`bg-amber-200/80 text-amber-600 rounded py-0.5 px-2.5 w-max
               ${className}
            `}
         >
            {number}
         </span>
      </div>
   )
}

export default Numerator
