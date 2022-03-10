const Numerator = ({ number, className }) => {
   return (
      <div className={`rounded bg-white shadow w-max ${className}`}>
         <span
            className='bg-amber-200/80 text-amber-600 rounded py-0.5 px-2.5'
         >
            {number}
         </span>
      </div>
   )
}

export default Numerator
