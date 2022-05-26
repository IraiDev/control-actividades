import React, { useContext, useEffect, useState, memo } from 'react'
import { isEqual } from 'lodash';
import NumberFormat from 'react-number-format'
import { useNavigate } from 'react-router-dom'
import { ActivityContext } from '../../context/ActivityContext'
import { Alert } from '../../helpers/alerts'
import { useDetail } from '../../hooks/useDetail'
import { useForm } from '../../hooks/useForm'
import { routes } from '../../types/types'
import Box from '../ui/Box'
import Button from '../ui/Button'
import CustomSelect from '../ui/CustomSelect'
import Input from '../ui/Input'
import Numerator from '../ui/Numerator'

const DistributionForm = (props) => {

  const { padre_original_terminado } = props

  const { optionsArray } = useContext(ActivityContext)
  const { toggleState } = useDetail(props.id)
  const navigate = useNavigate()

  const [options, setOptions] = useState({ value: 'empty', label: 'Ninguno' })
  const [distributions, setDistributions] = useState([])
  const [tiempo_restante, setTiempo_restante] = useState(0)
  const [tiempo_pantalla, setTiempo_pantalla] = useState(0)

  const cliente_acumulado = distributions.reduce((acum, item) => acum + Number(item.distr_cliente), 0)
  const zionit_acumulado = distributions.reduce((acum, item) => acum + Number(item.distr_zionit), 0)
  const total_acumulado = Number((cliente_acumulado + zionit_acumulado).toFixed(4))

  const [
    {
      distr_cliente,
      distr_zionit,
      distr_glosa
    },
    hanldeChange,
    reset
  ] = useForm({
    distr_cliente: 0,
    distr_zionit: 0,
    distr_glosa: ''
  })

  useEffect(() => {
    setDistributions(props.tiempos_distribuidos.map(dis => {
      return {
        id_dist_tiempo_act: dis.id_dist_tiempo_act,
        id_producto: dis.id_producto,
        tiempo_dist_act: dis.tiempo_dist_act,
        distr_cliente: dis.distr_cliente,
        distr_zionit: dis.distr_zionit,
        glosa_dist_tiempos_act: dis.glosa_dist_tiempos_act,
      }
    }))
    setTiempo_pantalla(props.tiempo_trabajado)
  }, [props.tiempos_distribuidos])

  useEffect(() => {

    setTiempo_restante(Number((props.tiempo_trabajado - total_acumulado).toFixed(4)))
    setTiempo_pantalla(Number((props.tiempo_trabajado - total_acumulado).toFixed(4)))

  }, [total_acumulado])

  useEffect(() => {

    if (Number(distr_cliente) > 0 || Number(distr_zionit) > 0) {
      setTiempo_pantalla(Number((tiempo_restante - (Number(distr_cliente) + Number(distr_zionit))).toFixed(4)))
      return
    }

  }, [distr_cliente, distr_zionit])

  const handleCreateTimes = () => {

    const empty_field = distr_glosa === '' && options.value === 'empty'
    const val_time_is_zero = Number(distr_cliente) === 0 && Number(distr_zionit) === 0

    if (tiempo_restante < 0) {
      Alert({
        icon: 'warn',
        title: 'Atención',
        content: `El tiempo ingresado es mayor al tiempo restante, por favor modifique el valor y vuelva a intentarlo`,
        showCancelButton: false,
      })
      return
    }

    if (empty_field) {
      Alert({
        icon: 'warn',
        title: 'Atención',
        content: 'Por favor llene todos los campos para agregar una linea de distribución',
        showCancelButton: false,
      })
      return
    }

    if (val_time_is_zero) {
      Alert({
        icon: 'warn',
        title: 'Atención',
        content: 'No puedes crear una distribucion con tiempo zionit y tiempo cliente iguales a 0',
        showCancelButton: false,
      })

      return
    }

    setDistributions(distributions => [
      ...distributions,
      {
        id_dist_tiempo_act: Math.random(),
        id_producto: Number(options?.value),
        tiempo_dist_act: Number(distr_cliente) + Number(distr_zionit),
        distr_cliente,
        distr_zionit,
        glosa_dist_tiempos_act: distr_glosa,
      },
    ])
    setOptions({ value: 'empty', label: 'Ninguno' })
    reset()
  }

  const handleDeleteTimes = id => {

    const filter = distributions.filter(dis => dis.id_dist_tiempo_act !== id)

    setDistributions(filter)
  }

  const handleApplyChanges = async ({ type, reject, status }) => {

    const val_rest_time = distributions.some(dis => Number(dis.distr_cliente) === 0 && Number(dis.distr_zionit) === 0)
    const time_cliente = distributions.reduce((acc, item) => acc + Number(item.distr_cliente), 0)
    const time_zionit = distributions.reduce((acc, item) => acc + Number(item.distr_zionit), 0)
    const hashTableEstado = {
      1: 3, // normal
      3: 13, // de entrega
      4: 13 // coordinacion
    }

    if (val_rest_time) {
      Alert({
        icon: 'warn',
        title: 'Atención',
        content: 'No pueden existir lineas de distribucion de tiempo done el T. cliente y T. zionit sean igual a 0',
        showCancelButton: false,
      })
      return
    }

    if (status !== 2 && status !== 1) {
      props.callback(distributions)
    }

    else {

      await toggleState({
        estado: hashTableEstado[type],
        tiempo_cliente: time_cliente,
        tiempo_zionit: time_zionit,
        distribuciones: distributions,
        rechazada: type === 3 ? reject : false,
        id_actividad: props.id_det,
      })
      navigate(routes.activity, { replace: true })

    }

    setTiempo_restante(0)
    setTiempo_pantalla(0)
    setOptions({ value: 'empty', label: 'Ninguno' })
    setDistributions(props.tiempos_distribuidos)
    reset()
    props.onClose()
  }

  const onCloseForm = () => {

    const is_longer = distributions.length > props.tiempos_distribuidos.length

    const action = () => {
      props.onClose()
      setTiempo_restante(0)
      setOptions({ value: 'empty', label: 'Ninguno' })
      setDistributions(props.tiempos_distribuidos)
      reset()
    }

    if (is_longer) {
      Alert({
        icon: 'warn',
        title: 'Atención!',
        content: 'Al cancelar o cerrar el formulario se perdera toda la distribucion realizada ¿Esta seguro de continuar?',
        confirmText: 'Si y continuar',
        cancelText: 'Volver',
        action
      })
      return
    }

    props.onClose()
  }

  return (
    <div className='mt-5 w-full pr-6 lg:pr-0'>

      <section className='p-3.5 mb-5 bg-zinc-100 rounded-md'>

        <h1 className='first-letter:uppercase mb-2'><b className='font-bold'>Titulo</b>: {props?.actividad}</h1>

        <section className='flex gap-1 items-baseline'>
          <h1 className='capitalize font-semibold text-sm'><b className='font-bold'>ID</b>: {props?.id_det}</h1>,
          <h1 className='capitalize font-semibold text-sm'><b className='font-bold'>Encargado</b>: {props.encargado_actividad}</h1>,
          <h1 className='capitalize font-semibold text-sm'><b className='font-bold'>Proyecto</b>: {props.abrev}</h1>,
          <h1 className='capitalize font-semibold text-sm mb-2'><b className='font-bold'>Ticket</b>: {props.num_ticket_edit === 0 ? '- -' : props.num_ticket_edit}</h1>
        </section>

        <h1 className='capitalize font-semibold text-sm'><b className='font-bold'>descripción</b></h1>

        <p className='text-zinc-500 text-xs'>{props?.func_objeto}</p>

      </section>

      <Box className='bg-white' isBlock colCount={10} >

        <section className='col-span-6 flex gap-4 font-bold w-full'>

          <div className='text-yellow-500 flex gap-2'>
            Tiempo Total:

            <NumberFormat
              value={props?.tiempo_trabajado}
              decimalScale={4}
              fixedDecimalScale
              displayType='text'
            />
          </div>

          |

          <div
            className={`${tiempo_pantalla < 0 ? 'text-red-500' : 'text-emerald-500'} flex gap-2`}
          >
            Tiempo Restante:

            <NumberFormat
              value={tiempo_pantalla}
              decimalScale={4}
              fixedDecimalScale
              displayType='text'
            />
          </div>

        </section>

        <span className='col-span-1 text-right font-bold pr-4' title='Tiempo cliente acumulado'>
          <NumberFormat
            className='text-blue-400'
            value={cliente_acumulado}
            decimalScale={4}
            fixedDecimalScale
            displayType='text'
          />
        </span>

        <span className='col-span-1 text-right font-bold pr-4' title='Tiempo zionit acumulado' >
          <NumberFormat
            className='text-blue-400'
            value={zionit_acumulado}
            decimalScale={4}
            fixedDecimalScale
            displayType='text'
          />
        </span>

        <span className='col-span-1 text-right font-bold pr-4' title='Tiempo total acumulado'>
          <NumberFormat
            className='text-blue-400 '
            value={total_acumulado}
            decimalScale={4}
            fixedDecimalScale
            displayType='text'
          />
        </span>
      </Box>

      <Box isBlock colCount={10} >

        <h3 className='font-semibold text-sm col-span-1 py-2 text-center'>
          Nº
        </h3>

        <h3 className='font-semibold text-sm col-span-1 py-2 text-center'>
          Tipo Actividad
        </h3>

        <h3 className='font-semibold text-sm col-span-2 text-center'>
          Producto Zionit
        </h3>

        <h3 className='font-semibold text-sm col-span-2 text-center'>
          Glosa explicativa
        </h3>

        <h3 className='font-semibold text-sm col-span-1 text-center'>
          T. Cliente (hrs)
        </h3>

        <h3 className='font-semibold text-sm col-span-1 text-center'>
          T. Zionit (hrs)
        </h3>

        <h3 className='font-semibold text-sm col-span-1 text-center'>
          T. Total (hrs)
        </h3>
      </Box>

      {(!props.isFather || !props.isTicket) && !padre_original_terminado &&
        <Box isBlock colCount={10} >

          <span className='col-span-1 py-6' />

          <span className='col-span-1 py-6 capitalize text-center' >
            {props.desc_tipo_actividad}
          </span>

          <section className='col-span-2'>
            <CustomSelect
              disabled={tiempo_restante <= 0}
              options={optionsArray?.products}
              value={options}
              onChange={option => setOptions(option)}
              menuHeight={150}
            />
          </section>

          <Input
            disabled={tiempo_restante <= 0}
            className='col-span-2'
            name='distr_glosa'
            value={distr_glosa}
            onChange={hanldeChange}
            maxLength={60}
          />

          <Input
            isNumberFormat
            disabled={tiempo_restante <= 0}
            className='col-span-1'
            placeholder='ej:1.5'
            name='distr_cliente'
            value={distr_cliente}
            onChange={hanldeChange}
          />

          <Input
            disabled={tiempo_restante <= 0}
            className='col-span-1'
            placeholder='ej:1.5'
            isNumberFormat
            name='distr_zionit'
            value={distr_zionit}
            onChange={hanldeChange}
          />

          <NumberFormat
            className='text-right w-full pr-4'
            value={Number(distr_zionit) + Number(distr_cliente)}
            decimalScale={4}
            fixedDecimalScale
            displayType='text'
          />

          <Button
            disabled={tiempo_restante <= 0}
            className='bg-emerald-100 hover:bg-emerald-200 text-emerald-500 col-span-1 mx-auto disabled:hover:bg-emerald-200/50'
            onClick={handleCreateTimes}>
            agregar
          </Button>
        </Box>
      }

      <h5 className='pl-4 text-sm my-5'>
        Lista de distribucion de tiempos
      </h5>

      {distributions.length > 0 ?
        distributions.map((dis, i) => (

          <Box key={i} isBlock colCount={10}>

            <Numerator className='mx-auto' number={i + 1} />

            <span className='text-center capitalize'>{props.desc_tipo_actividad}</span>

            <section className='col-span-2 py-1'>
              <CustomSelect
                disabled={props.isFather || padre_original_terminado}
                options={optionsArray?.products}
                value={optionsArray?.products.find(p => Number(distributions[i]?.id_producto) === Number(p.value)) ?? { value: 'empty', label: 'Ninguno' }}
                onChange={option => {
                  setDistributions(distributions.map(inp => {
                    if (inp.id_dist_tiempo_act === dis.id_dist_tiempo_act) {
                      return { ...inp, id_producto: Number(option.value) }
                    }
                    return inp
                  }))
                }}
                menuHeight={150}
              />
            </section>

            <Input
              disabled={props.isFather || padre_original_terminado}
              className='col-span-2'
              value={distributions[i]?.glosa_dist_tiempos_act ?? ''}
              maxLength={60}
              onChange={e => {
                setDistributions(distributions.map(inp => {
                  if (inp.id_dist_tiempo_act === dis.id_dist_tiempo_act) {
                    return { ...inp, glosa_dist_tiempos_act: e.target.value }
                  }
                  return inp
                }))
              }}
            />

            <Input
              disabled={props.isFather || padre_original_terminado}
              isNumberFormat
              className='col-span-1'
              placeholder='ej:1.5'
              value={distributions[i]?.distr_cliente ?? ''}
              onChange={e => {
                setDistributions(distributions.map(inp => {
                  if (inp.id_dist_tiempo_act === dis.id_dist_tiempo_act) {
                    return { ...inp, distr_cliente: e.target.value, tiempo_dist_act: (Number(distributions[i]?.distr_zionit) + Number(e.target.value)) }
                  }
                  return inp
                }))
              }}
            />

            <Input
              disabled={props.isFather || padre_original_terminado}
              isNumberFormat
              className='col-span-1'
              placeholder='ej:1.5'
              value={distributions[i]?.distr_zionit ?? ''}
              onChange={e => {
                setDistributions(distributions.map(inp => {
                  if (inp.id_dist_tiempo_act === dis.id_dist_tiempo_act) {
                    return { ...inp, distr_zionit: e.target.value, tiempo_dist_act: (Number(e.target.value) + Number(distributions[i]?.distr_cliente)) }
                  }
                  return inp
                }))
              }}
            />

            <NumberFormat
              className='text-right w-full pr-4'
              value={distributions[i]?.tiempo_dist_act ?? ''}
              decimalScale={4}
              fixedDecimalScale
              displayType='text'
            />

            <Button
              hidden={props.isFather || padre_original_terminado}
              disabled={props.isFather || padre_original_terminado}
              className='hover:bg-red-100 text-red-500 mx-auto'
              onClick={() =>
                handleDeleteTimes(dis.id_dist_tiempo_act)
              }>
              <i className='fas fa-trash-alt' />
            </Button>

          </Box>

        ))
        :
        <span className='text-sm text-zinc-400 pl-8'>
          No hay distribucion de tiempos...
        </span>
      }

      <footer className='flex justify-between mt-10'>
        <Button
          className='bg-red-100 hover:bg-red-200 text-red-500'
          onClick={onCloseForm}
        >
          {props.isFather ? 'Cerrar' : 'Cancelar'}
        </Button>

        {props.id_tipo_actividad === 3 && props.estado === 2 &&
          <div className='flex gap-2'>

            <Button
              className='bg-red-100 text-red-500'
              onClick={() => handleApplyChanges({ type: props.id_tipo_actividad, reject: true, status: props.estado })}
            >
              rechazar
            </Button>
            <Button
              className='bg-emerald-100 text-emerald-500'
              onClick={() => handleApplyChanges({ type: props.id_tipo_actividad, reject: false, status: props.estado })}
            >
              aprobar
            </Button>

          </div>
        }

        <Button
          hidden={(props.id_tipo_actividad === 3 && props.estado === 2) || (props.isFather && props.isTicket)}
          disabled={tiempo_restante !== 0}
          className='bg-emerald-100 hover:bg-emerald-200 text-emerald-500 disabled:hover:bg-emerald-100'
          onClick={() => handleApplyChanges({ type: props.id_tipo_actividad, status: props.estado })}
        >
          {
            props.estado !== 2 ? 'Guardar' :
              props.id_tipo_actividad === 1 ? 'Para Revisión' :
                props.id_tipo_actividad === 4 ? 'Procesar' :
                  props.id_tipo_actividad === 3 ? 'Procesar' : 'Aceptar'
          }
        </Button>
      </footer>
    </div>
  )
}

export default memo(DistributionForm, isEqual)