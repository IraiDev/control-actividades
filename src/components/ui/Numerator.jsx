const Numerator = ({ number, className }) => {
   return (
      <div className={`rounded bg-white shadow w-max ${className}`}>
         <span
            className='bg-orange-200/80 text-orange-600 rounded py-0.5 px-2.5 font-semibold'
         >
            {number}
         </span>
      </div>
   )
}

export default Numerator
