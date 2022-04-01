import { useEffect, useState } from 'react'
import ChildItem from './ChildItem'
import Select from 'react-select'
import P from '../ui/P'


const ChildContainer = (props) => {

   const { data } = props

   const [arrayOptionsData, setArrayOptionsData] = useState([])
   const [option, setOption] = useState({ value: null, label: 'Todos' })
   const [dataProcesada, setDataProcesada] = useState([])

   useEffect(() => {

      setDataProcesada(data)

      const padres = data.filter(d => d.es_padre === 1)

      const options = padres.map(p => {
         return {
            value: p.id_det,
            label: <span dangerouslySetInnerHTML={{
               __html: `
                  <div class="text-sm w-48 flex gap-1" title="${p.actividad}">
                     <span class="text-orange-500 bg-orange-200 rounded px-2 font-semibold">${p.nivel}</span>
                     - <p class="max-w-[5rem] truncate">${p.actividad}</p>
                     - ${p.id_det}
                  </div>
                  `
            }} />
         }
      })

      setArrayOptionsData([{ value: null, label: 'Todos' }, ...options])
   }, [data])

   const handleChangeOption = (option) => {

      setOption(option)

      if (option.value === null) {
         setDataProcesada(data)
         return
      }

      setDataProcesada(data.filter(d => d.id_det_padre === option.value))

   }


   return (
      <section className='rounded-lg bg-zinc-100 border mb-8 relative'>

         <header className='flex items-center justify-between py-2 px-4 border-b bg-white rounded-t-lg'>

            <h5 className='font-semibold'>Actividades Hijas</h5>

            <P tag='ID Padre' value={props.id_det} />

            <P tag='Ticket' value={props.num_ticket_edit} />

            <span />

            <div className='flex items-center gap-2 min-w-max' title='Agrupar por hijas de...'>
               Agrupar:
               <Select
                  className='w-56'
                  placeholder='inactivo'
                  options={arrayOptionsData}
                  value={option}
                  onChange={handleChangeOption}
               />
            </div>

         </header>

         <div className='p-4 max-h-[60vh] overflow-custom flex-col space-y-2'>

            {
               dataProcesada.length > 0 ?
                  dataProcesada.map(data => (
                     <ChildItem
                        {...data}
                        key={data.id_det}
                        number={data.nivel}
                        onPlay={() => props.onPlay({ id_actividad: data.id_det })}
                        onPause={({ mensaje }) => props.onPause({ mensaje, id_actividad: data.id_det })}
                        hideChilds={(status) => props.hideChilds(status)}
                     />
                  ))
                  : <span className='block mx-auto text-zinc-600 text-sm'>No hay hijas para listar</span>
            }

         </div>

      </section>
   )
}

export default ChildContainer