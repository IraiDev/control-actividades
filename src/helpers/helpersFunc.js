import moment from 'moment'
import { Alert } from './alerts'

export const clearParams = (url, param) => {
   let p1 = url.indexOf(param)
   let p2 = url.indexOf('&', p1)
   let flag = url.charAt(p1 - 1) === '_'
   if (flag) {
      p1 = url.indexOf(param, p1 + 1)
      p2 = url.indexOf('&', p1)
   }
   if (p1 > -1 && p2 > -1) {
      return (url = url.slice(0, p1) + '' + url.slice(p2 + 1))
   } else {
      return url
   }
}

export const seekParam = (text, param) => {
   const p = /- PAUSA/g
   const t = text.replace(p, `\n${param}`)

   return t
}

export const checkForms = value => {
   const noPermitidos = [
      '#',
      '$',
      '%',
      '^',
      '&',
      '"',
      "'",
      '<',
      '>',
      ';',
      '{',
      '}',
      '[',
      ']',
      '*',
   ]
   const obj = {
      state: false,
      char: '',
      list: noPermitidos,
   }
   noPermitidos.forEach((item, index) => {
      if (value.includes(item)) {
         return (
            (obj.state = true),
            (obj.char = noPermitidos[index]),
            (obj.list = noPermitidos)
         )
      }
   })
   return obj
}

export const sliceString = (value, index) => {
   if (value.length <= index) {
      return value
   }
   const newValue = value.slice(0, index - 3) + '...'
   return newValue
}

export const validateDate = ({ finicio, fdetencion, hinicio, hdetencion }) => {

   const i = moment(`${finicio} ${hinicio}`).format('YYYY-MM-DD HH:mm:ss')
   const d = moment(`${fdetencion} ${hdetencion}`).format('YYYY-MM-DD HH:mm:ss')

   if (moment(i).isSameOrAfter(d)) {
      Alert({
         icon: 'warn',
         title: 'Atención',
         content:
            'La fecha de detención debe ser mayor o igual a la fecha de inicio',
         showCancelButton: false,
      })
      return false
   }

   if (!moment(d).isValid() || !moment(i).isValid()) {
      Alert({
         icon: 'warn',
         title: 'Atención',
         content: 'Fechas ingresadas no validas',
         showCancelButton: false,
      })
      return false
   }

   if (hinicio === '' || hdetencion === '') {
      Alert({
         icon: 'warn',
         title: 'Atención',
         content: 'Todos los campos son obligatorios',
         showCancelButton: false,
      })
      return false
   }

   return true
}

export const validatePredecessor = ({ array, callback, state, options }) => {

      if (array.length > 0) {

         const filter = array.filter(item => item.estado_accion === state)

         if (filter.length > 0 ) {

            const alta = filter.filter(item => item.restriccion === 1 && item.estado_actual_condicion !== item.estado_condicion)

            if (alta.length > 0) {
               Alert({
                  icon: 'warn',
                  title: 'Atencion',
                  content: `Esta actividad no puede pasar a estado 
                  <strong>${options?.status.find(os => os.value === state).label}</strong> 
                   porque actividad predecesora Nº <strong>${alta[0].id_det_condicion}</strong>
                   debe estar en estado <strong>${options?.status.find(os => os.value === alta[0].estado_condicion).label}</strong>
                   y se encuentra en estado <strong>${options?.status.find(os => os.value === alta[0].estado_actual_condicion).label}</strong>
                   <br>si este mensaje no refleja el estado actual por favor refresque la pagina
                   `,
                  showCancelButton: false,
               })
               return 
            }

            const baja = filter.filter(item => item.restriccion === 0 && item.estado_actual_condicion !== item.estado_condicion)

            if (baja.length > 0) {
               
               Alert({
                  icon: 'warn',
                  title: 'Atencion',
                  content: `¿Esta seguro que desea pasar a estado 
                   <strong>${options?.status.find(os => os.value === state).label}</strong> ?
                   Porque actividad predecesora Nº <strong>${baja[0].id_det_condicion}</strong>
                   debe estar en estado <strong>${options?.status.find(os => os.value === baja[0].estado_condicion).label}</strong>
                   y se encuentra en estado <strong>${options?.status.find(os => os.value === baja[0].estado_actual_condicion).label}</strong>
                   <br>si este mensaje no refleja el estado actual por favor refresque la pagina
                   `,
                  confirnText: 'Si, continuar',
                  cancelText: 'No, cancelar',
                  action: () => callback()
               })
               return 
            }

         }
      }
      callback()
}
