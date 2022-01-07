import { useState, useEffect, useContext } from 'react'
import { fetchToken } from '../../helpers/fetch'
import { useForm } from '../../hooks/useForm'
import Button from '../ui/Button'
import moment from 'moment'
import { UiContext } from '../../context/UiContext'

const TODAY = moment(new Date()).format('yyyy-MM-DD')

const Times = () => {

  const { setIsLoading } = useContext(UiContext)
  const [check, setCheck] = useState(false)
  const [data, setData] = useState([])
  const [{ date }, onChangeValues] = useForm({ date: TODAY })

  const getData = async () => {
    setIsLoading(true)
    try {
      const resp = await fetchToken(`times/get-times-info?fecha=${date}`)
      const body = await resp.json()
      setIsLoading(false)

      console.log(date);

      console.log(body)

    } catch (err) {
      setIsLoading(false)
      console.log(err)
    }

  }

  useEffect(() => {
    getData()
    // eslint-disable-next-line
  }, [date])

  return (
    <main className='py-10'>
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
            icon='fas fa-check' />
        </div>
      </header>
      <section className='mt-10 text-center'>
        no hay data para mostrar...
      </section>
    </main>
  )
}

export default Times
