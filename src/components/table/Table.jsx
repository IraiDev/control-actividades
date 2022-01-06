
const Table = ({ children, width = 'min-w-[1600px]', height = 'max-h-[85vh]' }) => (
  <section className='mt-6 w-full mx-auto rounded-md border-l border-y border-gray-400 overflow-custom animate__animated animate__fadeIn'>
    <div className={`${width} mx-auto overflow-hidden`}>
      <div className={`${height} w-full overflow-custom`}>
        <table className='w-full relative border-r border-gray-400'>
          {children}
        </table>
      </div>
    </div>
  </section>
)

export default Table