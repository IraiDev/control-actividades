
const Table = ({ children, width = 'w-[1600px]', height = 'max-h-[85vh]' }) => {
  return (
    <section className="mt-6 w-max mx-auto overflow-custom border border-black/10 rounded-md shadow-md animate__animated animate__fadeIn">
      <div className={`${width} mx-auto overflow-hidden`}>
        <div className={`${height} w-full overflow-custom`}>
          <table className="w-full relative">
            {children}
          </table>
        </div>
      </div>
    </section>
  )
}

export default Table