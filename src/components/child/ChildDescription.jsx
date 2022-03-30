import reactDom from 'react-dom'

const portal = document.getElementById('root-float-desc')

const ChildDescription = ({ desc }) => {
   return reactDom.createPortal(
      <div className='bg-white rounded-lg min-w-[360px] shadow-xl border p-4 absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 max-h-96 z-50'>
         {desc}
      </div>,
      portal
   )
}

export default ChildDescription