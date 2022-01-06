import ReactDOM from 'react-dom'

const portal = document.getElementById('loading-root')

const Loading = ({ show }) => {

  if (show) {
    return ReactDOM.createPortal(
      <div className='fixed top-0 bottom-0 left-0 right-0 z-50'>
        <div className='fixed top-0 bottom-0 left-0 right-0 z-auto bg-gray-100/50 blur-xl' />
        <section className='relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-max'>
          <i className='fas fa-spinner animate-spin fa-3x text-slate-800' />
        </section>
      </div>, portal
    )
  }

  return null
}

export default Loading