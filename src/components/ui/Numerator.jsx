const Numerator = ({ number, className }) => {
   return (
      <span
         className={`bg-amber-200/80 text-amber-600 shadow rounded py-0.5 px-2.5 mb-2
         ${className}
      `}>
         {number}
      </span>
   )
}

export default Numerator
