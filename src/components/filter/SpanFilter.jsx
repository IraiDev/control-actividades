const SpanFilter = ({ children, condition }) => {
   return (
      <span className={ condition ? 'text-rose-500 bg-rose-200/20 rounded-md px-2 py-0.5' : '' }>
         { children }
      </span>
   )
}

export default SpanFilter