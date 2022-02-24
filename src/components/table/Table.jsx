const Table = ({
   children,
   width = 'min-w-[1600px]',
   height = 'max-h-[85vh]',
}) => (
   <section className='mt-6 w-full mx-auto rounded-md border-l border-y shadow-lg overflow-auto animate__animated animate__fadeIn'>
      <div className={`${width} mx-auto overflow-hidden`}>
         <div className={`${height} w-full overflow-auto`}>
            <table className='w-full relative'>{children}</table>
         </div>
      </div>
   </section>
)

export default Table
