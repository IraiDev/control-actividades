import React, { useState } from 'react'
import { useEffect } from 'react/cjs/react.development'

const Timer = (props) => {

  const { time: t } = props

  const [time, setTime] = useState({ s: t?.seconds, m: t?.minutes, h: t?.hours })
  const [interv, setInterv] = useState()

  const start = () => {
    run()
    setInterv(setInterval(run, 1000))
  }

  let updatedS = time.s, updatedM = time.m, updatedH = time.h

  const run = () => {
    if (updatedM === 60) {
      updatedH++
      updatedM = 0
    }
    if (updatedS === 60) {
      updatedM++
      updatedS = 0
    }
    updatedS++
    return setTime({ s: updatedS, m: updatedM, h: updatedH })
  }

  const stop = () => clearInterval(interv)

  useEffect(() => {
    props.pause ? start() : stop()
    return () => stop()
    // eslint-disable-next-line
  }, [props.pause])

  return (
    <div className='flex'>
      <span>{(time.h >= 10) ? time.h : "0" + time.h}</span>:
      <span>{(time.m >= 10) ? time.m : "0" + time.m}</span>:
      <span>{(time.s >= 10) ? time.s : "0" + time.s}</span>
    </div>
  )
}

export default Timer
