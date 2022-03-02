import { useWindowSize } from "../../hooks/useWindowSize"

const Table = props => {

   const { height: h } = useWindowSize()

   const {
      children,
      height = h < 800 ? 'max-h-[80vh]' : 'max-h-[85vh]',
   } = props

   return (
   <section className='mt-6 w-full rounded-md border border-zinc-400/40 shadow-lg shadow-zinc-500/30 overflow-auto animate__animated animate__fadeIn'>
      <div className={height}>
         <table className={`relative overflow-auto`}>{children}</table>
      </div>
   </section>
)}

export default Table
