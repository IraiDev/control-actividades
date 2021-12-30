import Select from 'react-select'

const CustomSelect = ({ options, value, onChange, defaultLabel = 'ninguno', label }) => (
  <span className='grid gap-2 capitalize text-sm'>
    {label}
    <Select
      className='uppercase'
      options={[{ value: null, label: defaultLabel }].concat(options)}
      value={value}
      onChange={onChange}
    />
  </span>
)

export default CustomSelect