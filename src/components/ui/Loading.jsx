import ReactDOM from 'react-dom'

const portal = document.getElementById('loading-root')

const Loading = ({ show, text = 'Cargando' }) => {

  if (show) {
    return ReactDOM.createPortal(
      <div className="fixed top-0 bottom-0 left-0 right-0 z-50">
        <div className="fixed top-0 bottom-0 left-0 right-0 z-auto bg-black bg-opacity-40" />
        <section className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center w-max p-3 bg-white rounded-full shadow-sm">
          <p className="mr-4 capitalize font-semibold">{text}</p>
          <i className="fas fa-spinner animate-spin fa-3x text-gray-500"></i>
        </section>
      </div>, portal
    )
  }

  return null
}

export default Loading