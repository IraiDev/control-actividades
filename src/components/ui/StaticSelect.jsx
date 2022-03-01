const StaticSelect = ({ value, onChange }) => {
   return (
      <select
         className='rounded-lg bg-white p-1 border border-gray-300'
         value={value}
         onChange={onChange}>
         <option value=''>todos</option>
         <option value='12'>12</option>
         <option value='25'>25</option>
         <option value='50'>50</option>
         <option value='100'>100</option>
      </select>
   )
}

export default StaticSelect
