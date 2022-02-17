import { useState, useEffect, useContext } from 'react'
import { fetchToken } from '../helpers/fetch'
import { useForm } from '../hooks/useForm'
import { UiContext } from '../context/UiContext'
import Button from '../components/ui/Button'
import Table from '../components/table/Table'
import TBody from '../components/table/TBody'
import THead from '../components/table/THead'
import TFooter from '../components/table/TFooter'
import Th from '../components/table/Th'
import Td from '../components/table/Td'
import { Alert } from '../helpers/alerts';
import moment from 'moment'

const TODAY = moment(new Date()).format('yyyy-MM-DD')

const hideValue = (value) => value === '0,00' ? '--' : value

const Times = () => {

  const { setIsLoading } = useContext(UiContext)
  const [check, setCheck] = useState(true)
  const [data, setData] = useState([])
  const [{ date }, onChangeValues] = useForm({ date: TODAY })

  const getData = async () => {
    setIsLoading(true)
    try {
      const resp = await fetchToken(`times/get-times-info?fecha=${date}`)
      const body = await resp.json()
      setIsLoading(false)
      if (body.ok) {
        setData(body.msg[0])
      }
      else {
        Alert({
          icon: 'error',
          title: 'Atención',
          message: 'Error al obtener el informe de tiempos',
          showCancelButton: false
        })
      }

    } catch (err) {
      setIsLoading(false)
      console.log(err)
    }

  }

  useEffect(() => {
    getData()
    // eslint-disable-next-line
  }, [])

  return (
    <main className='pt-8 pb-5'>
      <header className='flex items-center justify-center gap-4 bg-white rounded-full shadow-lg w-max py-2 px-3 mx-auto'>
        <label htmlFor='id_reset'>
          <input
            className='cursor-pointer'
            type='checkbox'
            id='id_reset'
            checked={check}
            onChange={e => setCheck(e.target.checked)} />
          <span className={`ml-2 cursor-pointer ${!check && 'text-slate-400 line-through'}`}>Cobrables</span>
        </label>
        <div>
          <input
            className='bg-slate-100 p-3 rounded-full mr-2'
            type='date'
            name='date'
            value={date}
            onChange={onChangeValues} />
          <Button
            className='text-blue-500 bg-blue-100 hover:bg-blue-200 rounded-lg'
            type='icon'
            icon='fas fa-check'
            onClick={getData} />
        </div>
      </header>
      {
        data.length > 1 ?
          <section className='text-center px-5 xl:px-20'>
            <Table height='max-h-[75vh]'>
              <THead>
                <tr className='text-white bg-slate-700'>
                  <Th>Proyecto</Th>
                  {
                    data.length > 0 &&
                    data[0].usuarios.map((user, i) => (
                      <Th className={i % 2 === 0 ? 'bg-slate-600' : ''} key={user.usuario}>{user.usuario}</Th>
                    ))
                  }
                </tr>
                <tr className='text-white bg-slate-700'>
                  <Th></Th>
                  {
                    data[0].usuarios.map((user, i) => (
                      <Th className={i % 2 === 0 ? 'bg-slate-600' : ''} key={user.usuario}>
                        <div className='w-full flex justify-around'>
                          <span>Mes</span>
                          <span>5D</span>
                          <span>3D</span>
                          <span>1D</span>
                        </div>
                      </Th>
                    ))
                  }
                </tr>
              </THead>
              <TBody>
                {
                  data.map((item, i) => (
                    item.proy !== 'TOTAL' ?
                      <tr key={i}>
                        <Td className='border-b border-gray-500'>{item.proy}</Td>
                        {
                          item.usuarios.map((user, i) => (
                            <Td className={`${i % 2 === 0 ? 'bg-black/10' : 'bg-black/20'} border-b border-gray-500`} key={i + item.proy}>
                              <div className='w-full flex justify-around'>
                                <span>{check ? hideValue(user.tiempos.mc) : hideValue(user.tiempos.mnc)}</span>
                                <span>{check ? hideValue(user.tiempos.d5c) : hideValue(user.tiempos.d5nc)}</span>
                                <span>{check ? hideValue(user.tiempos.d3c) : hideValue(user.tiempos.d3nc)}</span>
                                <span>{check ? hideValue(user.tiempos.d1c) : hideValue(user.tiempos.d1nc)}</span>
                              </div>
                            </Td>
                          ))
                        }
                      </tr>
                      :
                      null
                  ))
                }
              </TBody>
              <TFooter>
                {
                  data.map((item, i) => (
                    item.proy === 'TOTAL' ?
                      <tr className='bg-slate-600 text-white font-semibold' key={i}>
                        <Td>{item.proy}</Td>
                        {
                          item.usuarios.map((user, i) => (
                            <Td className={i % 2 === 0 ? 'bg-slate-500' : ''} key={i + item.proy}>
                              <div className='w-full flex justify-around'>
                                <span>{check ? hideValue(user.tiempos.mc) : hideValue(user.tiempos.mnc)}</span>
                                <span>{check ? hideValue(user.tiempos.d5c) : hideValue(user.tiempos.d5nc)}</span>
                                <span>{check ? hideValue(user.tiempos.d3c) : hideValue(user.tiempos.d3nc)}</span>
                                <span>{check ? hideValue(user.tiempos.d1c) : hideValue(user.tiempos.d1nc)}</span>
                              </div>
                            </Td>
                          ))
                        }
                      </tr> : null
                  ))
                }
              </TFooter>
            </Table>
          </section>
          :
          <p className='text-center text-slate-500 w-full mt-10'>
            No hay datos para mostrar...
            <span className='block'>(Intente con otra fecha)</span>
          </p>
      }
    </main>
  )
}

export default Times
