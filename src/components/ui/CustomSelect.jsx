import Select from 'react-select'

const CustomSelect = ({
   options,
   value,
   onChange,
   defaultLabel = 'ninguno',
   label,
   menuHeight = 200
}) => (
   <span className='grid gap-1 capitalize text-sm'>
      {label}
      <Select
         placeholder='Seleccione'
         className='capitalize'
         options={[{ value: null, label: defaultLabel }].concat(options)}
         value={value}
         onChange={onChange}
         maxMenuHeight={menuHeight}
      />
   </span>
)

export default CustomSelect
