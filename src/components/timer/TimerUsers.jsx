import { useState } from 'react'
import moment from 'moment'
import Indicator from './Indicator'
import Timer from './Timer'
import Button from '../ui/Button'
import OnOutsiceClick from 'react-outclick'

const timeFormat = (time) => {
  let hours = time._data.hours
  let minutes = time._data.minutes
  let seconds = time._data.seconds
  if (hours < 10) hours = '0' + hours
  if (minutes < 10) minutes = '0' + minutes
  if (seconds < 10) seconds = '0' + seconds


  return {
    complete: hours + ':' + minutes + ':' + seconds,
    section: {
      hours: time._data.hours,
      minutes: time._data.minutes,
      seconds: time._data.seconds
    }
  }
}

const Times = ({ time, pause, user }) => (
  <div
    className={`
    ${pause ? 'border-red-400 text-red-400' : 'border-emerald-400 text-emerald-400'}
      flex items-center gap-2 rounded-full p-1 pr-3 shadow-md border font-semibold
    `}>
    <span className={`
      h-9 w-9 rounded-full text-center p-1
      ${pause ? 'bg-red-100' : 'bg-emerald-100'}
    `}>
      {user}
    </span>
    <Timer
      pause={pause}
      time={timeFormat(moment.duration(time, 'hours')).section}
    />
  </div>
)

const TimerUsers = ({ data, type, onClick = () => false }) => {

  const [show, setShow] = useState(false)

  if (type === 'button') {
    return (
      <main className='md:hidden' >
        <OnOutsiceClick onOutsideClick={() => setShow(false)}>
          <Button
            className='hover:bg-slate-200 rounded-lg text-slate-700'
            type='icon'
            icon='fas fa-clock'
            onClick={() => {
              onClick()
              setShow(!show)
            }
            }
          />
          <section
            className={`absolute top-14 right-28 w-max mx-auto grid grid-cols-2 gap-2 
              bg-white border shadow-xl rounded-md p-1.5 animate__animated animate__faster
              ${show ? 'animate__fadeIn' : 'hidden'}
            `}>
            {
              data.length > 0 &&
              data.map((user, i) => (
                <Times key={i} time={user.tiempo} pause={user.estado} user={user.usuario} />
              ))
            }
          </section>
        </OnOutsiceClick>
      </main>
    )
  }

  return (
    <main
      className='hidden md:flex gap-2 hover:bg-gray-100 p-2 rounded-full transition duration-500 relative'
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {
        data.length > 0 &&
        data.map((user, i) => (
          <Indicator key={i} user={user.usuario} isWorking={user.estado} />
        ))
      }
      <section
        className={`absolute top-12 -left-5 w-max mx-auto grid grid-cols-2 gap-2 
              bg-white border shadow-xl rounded-md p-1.5 animate__animated animate__faster
              ${show ? 'animate__fadeIn' : 'hidden'}
            `}>
        {
          data.length > 0 &&
          data.map((user, i) => (
            <Times key={i} time={user.tiempo} pause={user.estado} user={user.usuario} />
          ))
        }
      </section>
    </main>
  )
}

export default TimerUsers
