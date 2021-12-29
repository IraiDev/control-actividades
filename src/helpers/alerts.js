import Swal from 'sweetalert2'
import { checkForms } from './helpersFunc'

const showClass = {
   popup: 'animate__animated animate__bounce animate__faster',
   backdrop: 'swal2-backdrop-show',
   icon: 'swal2-icon-show'
}

const hideClass = {
   popup: 'animate__animated animate__fadeOutUp animate__faster',
   backdrop: 'swal2-backdrop-hide',
   icon: 'swal2-icon-hide'
}

const customClass = {
   cancelButton: 'focus:outline-none ring-red-200 focus:ring-4 transition duration-500 capitalize py-2.5 px-6 font-semibold shadow-xl rounded-full bg-red-500 hover:bg-red-600 text-white',
   confirmButton: 'focus:outline-none transition duration-500 capitalize py-2.5 px-6 font-semibold shadow-xl rounded-full bg-blue-500 hover:bg-blue-700 text-white mr-3',
   input: 'text-base text-gray-700 resize-none transition duration-300 focus:ring ring-gray-400 active:outline-none outline-none focus:outline-none',
   validationMessage: 'text-center',
}

export const Alert = async (props) => {

   let {
      type = 'alert',
      cancelText = 'cancelar',
      confirmText = 'Aceptar',
      input = 'text',
      content = 'contenido de alerta',
      title = 'titulo',
      icon = 'info',
      inputPlaceholder = 'Escriba aqui',
      showCancelButton = true,
      showConfirmButton = true,
      isBlur = false,
      timer = undefined,
      action = () => { return false }
   } = props

   switch (icon) {
      case 'warn':
         icon = 'fa-exclamation-circle fa-lg text-yellow-500'
         break
      case 'info':
         icon = 'fa-exclamation-circle fa-lg text-blue-500'
         break
      case 'error':
         icon = 'fa-exclamation-circle fa-lg text-red-500'
         break
      case 'question':
         icon = 'fa-question-circle fa-lg text-blue-500'
         break
      default:
         icon = 'fa-exclamation-circle fa-lg text-blue-500'
         break
   }

   if (type === 'input') {
      const { value: text } = await Swal.fire({
         buttonsStyling: false,
         customClass,
         showClass,
         hideClass,
         input,
         html: `<div class="text-base">${content}</div>`,
         title: `<h4 class="text-2xl capitalize">${title} <i class="fas ${icon}"></i></h4>`,
         inputPlaceholder,
         showCancelButton,
         showConfirmButton,
         cancelButtonText: cancelText,
         confirmButtonText: confirmText,
         allowOutsideClick: isBlur,
         width: '50rem',
         inputValidator: (value) => {
            const vText = checkForms(value)
            const { state, char, list } = vText
            if (!value || state) {
               if (state) {
                  return `
            <div>
              <p>
              Caracter <b class="text-xl font-bold">${char}</b>
              no pemitido en descripcion de la pausa.
              </p>
              <p>
              Caracteres no permitidos: <b class="font-bold">${list}</b>
              </p>
            </div>`
               }
               return 'Este campo es obligatorio'
            }
         }
      })
      if (text) return { ok: true, text }
      else return { ok: false, text: '' }
   }

   if (type === 'alert') {
      Swal.fire({
         buttonsStyling: false,
         customClass,
         showClass,
         hideClass,
         html: `<div class="text-base">${content}</div>`,
         title: `<h4 class="text-2xl capitalize">${title} <i class="fas ${icon}"></i></h4>`,
         showCancelButton,
         showConfirmButton,
         focusCancel: true,
         cancelButtonText: cancelText,
         confirmButtonText: confirmText,
         timer,
         timerProgressBar: timer !== undefined,
         allowOutsideClick: isBlur,
         width: '36rem',
      }).then((result) => {
         if (result.isConfirmed) {
            action()
         }
      })
   }
}