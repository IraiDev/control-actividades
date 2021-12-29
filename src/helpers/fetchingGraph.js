import { Providers } from "@microsoft/mgt-element";

export const getFetch = async (endPoint = '', select = '', expand = '') => {
  try {
    let provider = Providers.globalProvider;
    if (provider) {
      let graphClient = provider.graph.client;
      let resp = await graphClient
        .api(endPoint)
        .expand(expand)
        .select(select)
        .get();

      return resp
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

export const getDetailsFetch = async (endPoint = '') => {
  try {
    let provider = Providers.globalProvider
    if (provider) {
      let graphClient = provider.graph.client
      let resp = await graphClient
        .api(endPoint)
        .get()

      return resp
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

export const postFetch = async (endPoint = '', data) => {
  try {
    let provider = Providers.globalProvider
    if (provider) {
      let graph = provider.graph.client
      await graph.api(`/me/${endPoint}`).post(data)
      return true
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

export const updateFetch = async (endPoint = '', data) => {
  try {
    let provider = Providers.globalProvider
    if (provider) {
      let graphClient = provider.graph.client
      await graphClient.api(`me/${endPoint}`).update(data)
      return true
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

export const updateFetchTask = async (endPoint = '', data, header) => {
  try {
    let provider = Providers.globalProvider
    if (provider) {
      let graphClient = provider.graph.client
      await graphClient.api(endPoint).header('IF-Match', header).update(data)
      return true
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

export const deleteFetch = async (endPoint = '') => {
  try {
    let provider = Providers.globalProvider
    if (provider) {
      let graphClient = provider.graph.client
      await graphClient.api(`me/${endPoint}`).delete()
      return true
    }
  } catch (error) {
    console.log(error)
    return false
  }
}