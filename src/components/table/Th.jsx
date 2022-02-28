const Th = ({ children, className, width }) => {
   return <th className={`px-1 py-1 ${className} ${width}`}>{children}</th>
}

export default Th
