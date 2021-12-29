import React, { createContext, useContext, useState } from 'react'
import { UiContext } from './UiContext';
import { deleteFetch, getFetch, postFetch, updateFetch, updateFetchTask } from '../helpers/fetchingGraph';
import { ActivityContext } from './ActivityContext';

export const GraphContext = createContext()

function GraphProvider({ children }) {
  const [userEmail, setUserEmail] = useState(null)
  const [plannerTask, setPlannerTask] = useState([])
  const [todoTask, setTodoTask] = useState([])
  const [todoList, setTodoList] = useState([])
  const [idListSelected, setIdListSelected] = useState(null)
  const { functions: UiFunc, states: UiState } = useContext(UiContext)
  const { functions: ActFunc, states: ActState } = useContext(ActivityContext)

  const getUserData = async () => {
    await getFetch('/me/').then(resp => {
      setUserEmail(resp.mail)
      console.log(resp)
    })
  }

  const getPlannerTask = async () => {
    await getFetch('/me/planner/tasks', '', 'details')
      .then(resp => {
        setPlannerTask(resp.value)
        if (ActState.userData.ok) {
          ActFunc.getNotify()
          ActFunc.getTimes()
        }
      })
    UiFunc.setIsLoading(false)
  }

  const getTodoTask = async (idList) => {
    const endPoint = `/me/todo/lists/${idList}/tasks`
    await getFetch(endPoint)
      .then(resp => {
        setTodoTask(resp.value)
        if (ActState.userData.ok) {
          ActFunc.getNotify()
          ActFunc.getTimes()
        }
      })
    UiFunc.setIsLoading(false)
  }

  const createTodo = async (idList, data) => {
    UiFunc.setIsLoading(true)
    const endPoint = `todo/lists/${idList}/tasks`
    await postFetch(endPoint, data)
    getTodoTask(idListSelected)
  }

  const updateTodo = async (idList, idTodo, data) => {
    UiFunc.setIsLoading(true)
    const endPoint = `todo/lists/${idList}/tasks/${idTodo}`
    await updateFetch(endPoint, data)
    getTodoTask(idListSelected)
  }

  const deleteTodo = async (idList, idTodo) => {
    UiFunc.setIsLoading(true)
    const endPoint = `todo/lists/${idList}/tasks/${idTodo}`
    await deleteFetch(endPoint)
    getTodoTask(idListSelected)
  }

  const getTodoList = async () => {
    await getFetch('/me/todo/lists')
      .then(resp => {
        setTodoList(resp.value)
        if (ActState.userData.ok) {
          ActFunc.getNotify()
          ActFunc.getTimes()
        }
      })
    UiFunc.setIsLoading(false)
  }

  const createTodoList = async (data) => {
    UiFunc.setIsLoading(true)
    await postFetch('todo/lists', data)
    getTodoList()
  }

  const updateTodoList = async (idList, data) => {
    UiFunc.setIsLoading(true)
    const endPoint = `todo/lists/${idList}`
    const flag = await updateFetch(endPoint, data)
    if (flag) {
      UiFunc.setDisplayNameTodoList({ ...UiState.displayNameTodoList, title: data.displayName })
      getTodoList()
    }
  }

  const deleteTodoList = async (idList) => {
    UiFunc.setIsLoading(true)
    const endPoint = `todo/lists/${idList}`
    await deleteFetch(endPoint)
    getTodoList()
  }

  const updateTask = async (idTask, data, etag) => {
    const endPoint = `planner/tasks/${idTask}`
    await updateFetchTask(endPoint, data, etag)
    getPlannerTask()
  }

  // vaariables de contexto global

  const value = {
    userEmail,
    plannerTask,
    todoTask,
    todoList,
    idListSelected,
    getUserData,
    getPlannerTask,
    getTodoList,
    createTodoList,
    updateTodoList,
    deleteTodoList,
    getTodoTask,
    createTodo,
    updateTodo,
    deleteTodo,
    setIdListSelected,
    updateTask
  }
  return (
    <GraphContext.Provider value={value}>
      {children}
    </GraphContext.Provider>
  )
}

export default GraphProvider
