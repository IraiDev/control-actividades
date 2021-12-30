const baseUrl = process.env.REACT_APP_API_URL

export const fetchUnToken = (endpoint, data, method = 'GET') => {
   try {
      const url = `${baseUrl}/${endpoint}`

      if (method === 'GET') {
         return fetch(url)
      } else {
         return fetch(url, {
            method,
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
         })
      }
   } catch (error) {
      console.log(error)
   }
}

export const fetchToken = (endpoint, data, method = 'GET') => {
   try {
      const url = `${baseUrl}/${endpoint}`
      const token = localStorage.getItem('tokenBackend') || ''
      if (method === 'GET') {
         return fetch(url, {
            method,
            headers: {
               'x-token': token,
            },
         })
      } else {
         return fetch(url, {
            method,
            headers: {
               'Content-Type': 'application/json',
               'x-token': token,
            },
            body: JSON.stringify(data),
         })
      }
   } catch (error) {
      console.log('entro al catch', error)
   }
}

export const fetchTokenFile = (endpoint, data, method = 'GET') => {
   try {
      const url = `${baseUrl}/${endpoint}`
      const token = localStorage.getItem('tokenBackend') || ''
      if (method === 'GET') {
         return fetch(url, {
            method,
            headers: {
               'x-token': token,
            },
         })
      } else {
         return fetch(url, {
            method,
            headers: {
               'x-token': token,
            },
            body: data,
            redirect: 'follow'
         })
      }
   } catch (error) {
      console.log('entro al catch', error)
   }
}