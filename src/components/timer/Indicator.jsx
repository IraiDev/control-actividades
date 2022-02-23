const Indicator = ({ user, isWorking }) => {
   return (
      <span
         className={`
         uppercase rounded-full border-2 inline-block text-center align-middle
         h-8 w-8 cursor-pointer transition duration-500 bg-white hover:text-white
         ${
            isWorking
               ? 'border-red-400 hover:bg-red-400'
               : 'border-emerald-400 hover:bg-emerald-400'
         }
         `}>
         {user}
      </span>
   )
}

export default Indicator
