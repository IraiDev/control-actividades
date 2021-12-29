export const clearParams = (url, param) => {
   let p1 = url.indexOf(param)
   let p2 = url.indexOf("&", p1)
   let flag = url.charAt(p1 - 1) === '_'
   if (flag) {
      p1 = url.indexOf(param, p1 + 1)
      p2 = url.indexOf("&", p1)
   }
   if (p1 > -1 && p2 > -1) {
      return (url = url.slice(0, p1) + "" + url.slice(p2 + 1))
   } else {
      return url;
   }
}

export const seekParam = (text, param) => {
   const p = /- PAUSA/g
   const t = text.replace(p, `\n${param}`)

   return t
}

export const checkForms = (value) => {
   const noPermitidos = ['#', '$', '%', '^', '&', '"', "'", '<', '>', ';', '{', '}', '[', ']', '*']
   const obj = {
      state: false,
      char: '',
      list: noPermitidos
   }
   noPermitidos.forEach((item, index) => {
      if (value.includes(item)) {
         return (
            obj.state = true,
            obj.char = noPermitidos[index],
            obj.list = noPermitidos
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