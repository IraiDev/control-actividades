import React from 'react'

const TimerContainer = ({ children, subtitle }) => (
  <span
    className='
      font-semibold rounded-full grid h-24 w-24 border-4 border-emerald-400
      mx-auto bg-slate-100 hover:bg-emerald-50 transition duration-200 
      content-center place-content-center capitalize
    '>
    {children}
    <span className='text-xs text-slate-500 text-center'>{subtitle}</span>
  </span>
)

export default TimerContainer
