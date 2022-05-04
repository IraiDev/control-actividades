import React from 'react'
import Box from '../ui/Box'
import Numerator from '../ui/Numerator'
import P from '../ui/P'
import moment from 'moment'

const EventContainer = ({ ticket, id, events }) => {
  return (
    <section className='rounded-lg bg-zinc-100 border mb-8 relative'>

      <header className='flex items-center justify-between py-2 px-4 border-b bg-white rounded-t-lg'>

        <h5 className='font-semibold'>Eventos plataforma cliente</h5>

        <P tag='Ticket' value={ticket} />

        <P tag='ID Padre' value={id} />


        <span />

        {/* <div className='flex items-center gap-2 min-w-max' title='Filtrar por padres...'>
          Padres:
          <Select
            className='w-56'
            placeholder='inactivo'
            options={arrayOptionsData}
            value={option.coor}
            name='coor'
            onChange={(otp) => setOption({ ...option, coor: otp })}
          />
        </div>

        <div className='flex items-center gap-2 min-w-max' title='Filtrar por estados...'>
          estado:
          <Select
            className='w-56'
            placeholder='inactivo'
            options={[{ value: '', label: 'Todos' }, ...optionsArray?.status]}
            value={option.status}
            onChange={(otp) => setOption({ ...option, status: otp })}
          />
        </div> */}

      </header>

      <div className='p-4 max-h-[60vh] overflow-custom flex-col space-y-2'>

        <Box colCount={10} className='bg-slate-500 text-white' isBlock>
          <span className='flex justify-around'>
            <p>#</p>
            <p>Estado</p>
          </span>
          <span className='col-span-2'>Fecha</span>
          <span>Actividad</span>
          <span>Emisor</span>
          <span>Receptor</span>
          <span className='col-span-4'>Contenido</span>
        </Box>

        {events.map((event, index) => (
          <Box key={event.id_evento} colCount={10} isBlock className='bg-white shadow-sm py-3 content-start'>
            <span className='flex justify-around col-span-1'>
              <Numerator number={index + 1} />
              {event.est_evento}
            </span>
            <span className='text-sm col-span-2'>{moment(event.fecha_hora).format('DD-MM-YYYY, HH:MM')}</span>
            <span>{event.id_actividad}</span>
            <span className='uppercase'>{event.nombre_emisor}</span>
            <span className='uppercase'>{event.nombre_receptor || 'Equipo'}</span>
            <span className='col-span-4'>{event.contenido}</span>
          </Box>
        ))}

      </div>

    </section>
  )
}

export default EventContainer