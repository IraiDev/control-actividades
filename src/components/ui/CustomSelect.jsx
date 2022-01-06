import Select from 'react-select'

const CustomSelect = ({ options, value, onChange, defaultLabel = 'ninguno', label }) => (
  <span className='grid gap-1 capitalize text-sm'>
    {label}
    <Select
      className='capitalize'
      options={[{ value: null, label: defaultLabel }].concat(options)}
      value={value}
      onChange={onChange}
    />
  </span>
)

export default CustomSelect