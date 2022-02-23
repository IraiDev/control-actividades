const Th = ({ children, className, width }) => {
   return <th className={`px-2 py-1.5 ${className} ${width}`}>{children}</th>
}

export default Th
