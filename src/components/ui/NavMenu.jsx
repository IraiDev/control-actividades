import { useContext, useEffect, useState } from 'react'
import { Login } from '@microsoft/mgt-react'
import Button from './Button'
import LiNav from './LiNav'
import {
  deleteFetch,
  getFetch,
  updateFetch,
  postFetch,
} from '../../helpers/fetchingGraph'
import ButtonNav from './ButtonNav'
import { Alert } from '../../helpers/alerts'
import Modal from './Modal'
import { useToggle } from '../../hooks/useToggle'
import Input from './Input'
import { UiContext } from '../../context/UiContext'
import { routes } from '../../types/types'
import LiLink from './LiLink'

const { activity, planner, times, plataforma_clientes } = routes

const initForm = { id: null, title: '', idRef: null }

const NavMenu = ({ isOpen, toggleMenu }) => {
  const { setIsLoading } = useContext(UiContext)
  const [list, setList] = useState([])
  const [values, setValues] = useState(initForm)
  const [showModalList, toggleModalList] = useToggle(false)

  // destructuring
  const { id, title, idRef } = values
  // destructuring

  const getTodoList = () => {
    getFetch('/me/todo/lists')
      .then(resp => {
        setList(resp.value)
        setIsLoading(false)
      })
      .catch(err => {
        console.log(err)
        setIsLoading(false)
      })
  }

  const handleDeleteList = ({ id, title }) => {
    const action = async () => {
      setIsLoading(true)
      const ok = await deleteFetch(`todo/lists/${id}`)
      if (ok) {
        setList(list.filter(item => item.id !== id))
        setIsLoading(false)
      } else {
        Alert({
          icon: 'error',
          title: 'Error',
          content:
            'No se pudo eliminar la lista, recargue la pagina e intente nuevamente',
          showCancelButton: false,
          timer: 5000,
        })
        setIsLoading(false)
      }
    }

    Alert({
      icon: 'warn',
      title: 'Atencion',
      content: `¿Esta seguro de eliminar la siguiente lista: <strong>${title}</strong>?`,
      confirmText: 'Si, eliminar',
      cancelText: 'No, cancelar',
      action,
    })
  }

  const handleUpdateList = async () => {
    setIsLoading(true)
    const resp = await updateFetch(`todo/lists/${id}`, { displayName: title })
    if (resp) {
      setList(
        list.map(item => {
          if (item.id === id) {
            item.displayName = title
          }
          return item
        })
      )
      setIsLoading(false)
    } else {
      Alert({
        icon: 'error',
        title: 'Error',
        content:
          'No se pudo actualizar la lista, recargue la pagina e intente nuevamente',
        showCancelButton: false,
        timer: 5000,
      })
      setIsLoading(false)
    }
    closeModalList()
  }

  const handleCreateList = async () => {
    setIsLoading(true)
    const resp = await postFetch('todo/lists', { displayName: title })
    if (resp) {
      getTodoList()
    } else {
      Alert({
        icon: 'error',
        title: 'Error',
        content:
          'No se pudo crear la lista, recargue la pagina e intente nuevamente',
        showCancelButton: false,
        timer: 5000,
      })
      setIsLoading(false)
    }
    closeModalList()
  }

  const OpenModalUpdate = ({ id, title }) => {
    setValues({ id, title })
    toggleModalList()
  }

  const closeModalList = () => {
    setValues(initForm)
    toggleModalList()
  }

  useEffect(() => {
    getTodoList()
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <nav
        className={`h-screen w-72 fixed top-0 right-0 bg-white shadow-lg border
            animate__animated animate__faster z-30
            ${isOpen === null && 'hidden'}
            ${isOpen ? 'animate__slideInRight' : 'animate__slideOutRight'}
            `}
      >
        <header className='flex justify-between items-center p-5'>
          <h1 className='capitalize text-gray-500'>menu</h1>
          <Button
            className='rounded-lg hover:bg-gray-100'
            type='icon'
            icon='fas fa-times'
            onClick={toggleMenu}
          />
        </header>
        <ul className=''>
          <LiNav onClick={toggleMenu} to={times} name='informe de tiempos' />
          <LiNav onClick={toggleMenu} to={activity} name='actividades' />
          <LiNav onClick={toggleMenu} to={planner} name='planner' />
          <LiLink
            onClick={toggleMenu}
            to={plataforma_clientes}
            name='Plataforma clientes'
            icon='fas fa-ticket-alt'
            target='_blank'
          />
        </ul>
        <div className='mx-5 border-t border-gray-300 my-5' />
        <section className='px-5 flex items-center justify-between'>
          <h1 className='capitalize text-gray-500'>To-dos</h1>
          <Button
            className='rounded-lg hover:bg-gray-100'
            type='icon'
            icon='fas fa-plus'
            onClick={toggleModalList}
          />
        </section>
        <section>
          {list.map(obj => {
            if (
              !obj.isOwner ||
              (obj.isOwner && obj.wellknownListName === 'defaultList')
            ) {
              return (
                <ButtonNav
                  key={obj.id}
                  id={obj.id}
                  title={obj.displayName}
                  icon={`fas ${!obj.isOwner ? 'fa-user-friends' : 'fa-home'}`}
                  isAction={false}
                  onClick={id => {
                    setValues({ ...values, idRef: id })
                    toggleMenu()
                  }}
                  active={obj.id === idRef && 'text-purple-500'}
                />
              )
            } else {
              return null
            }
          })}
          <div className='mx-5 border-t border-gray-300 my-5' />
          {list.map(obj => {
            if (obj.wellknownListName !== 'defaultList' && obj.isOwner) {
              return (
                <ButtonNav
                  key={obj.id}
                  id={obj.id}
                  title={obj.displayName}
                  icon='fas fa-list-ul'
                  onUpdate={() =>
                    OpenModalUpdate({ id: obj.id, title: obj.displayName })
                  }
                  onDelete={() =>
                    handleDeleteList({ id: obj.id, title: obj.displayName })
                  }
                  onClick={id => {
                    setValues({ ...values, idRef: id })
                    toggleMenu()
                  }}
                  active={obj.id === idRef && 'text-purple-500'}
                />
              )
            } else {
              return null
            }
          })}
        </section>
        <span className='absolute bottom-0 left-0 w-full h-14 transition duration-300 hover:bg-lg flex justify-center items-center'>
          <Login />
          <i className='fas fa-sign-out-alt'></i>
        </span>
      </nav>

      {/* modal update/create list */}
      <Modal
        showModal={showModalList}
        onClose={closeModalList}
        className='max-w-md'
        padding='p-4 md:p-6'
        title={id === null ? 'Crear lista' : 'Actualizar lista'}
      >
        <div className='grid gap-4'>
          <Input
            field='nombre lista'
            value={title}
            onChange={e => {
              setValues({ ...values, title: e.target.value })
            }}
          />
          <footer className='grid place-self-end'>
            <Button
              className='w-max text-blue-500 hover:bg-blue-100 rounded-full'
              name={id === null ? 'Crear lista' : 'Actualizar lista'}
              onClick={() =>
                id === null ? handleCreateList() : handleUpdateList()
              }
            />
          </footer>
        </div>
      </Modal>
    </>
  )
}

export default NavMenu
