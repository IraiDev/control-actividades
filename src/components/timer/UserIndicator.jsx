import React from 'react'

const UserIndicator = ({ user, state = false }) => {


   return (
      <span className={`
         uppercase rounded-full border-2 inline-block text-center align-middle
         h-8 w-8 cursor-pointer transition duration-500 bg-white hover:text-white
         ${state ? 'border-red-400 hover:bg-red-400' : 'border-green-400 hover:bg-green-400'}
         `}>
         {user}
      </span>
   )
}

export default UserIndicator
