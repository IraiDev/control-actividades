const Th = ({ children, primary = false}) => {

   if (primary) {
      return <th className='px-1 py-1 odd:bg-zinc-800/90 even:bg-zinc-900/90 text-white'>{children}</th>
   }

   return <th className='px-1 pb-2 text-slate-700 odd:bg-zinc-200/30 even:bg-zinc-100'>{children}</th>
}

export default Th
