import Select, { components } from 'react-select'
// import Tooltip from '@atlaskit/tooltip';

// const Option = ({children, ...props}) => {
//    return (
//       <Tooltip content='hola mundo'>
//          <components.Option {...props} />
//       </Tooltip>
//    )
// }

const CustomSelect = ({
   options,
   value,
   onChange,
   defaultLabel = 'ninguno',
   label,
   menuHeight = 200,
   width,
   className
}) => (
   <div className={`grid gap-1 capitalize text-sm ${width} ${className}`}>
      {label}
      <Select
         // components={{Option}}
         menuPortalTarget={document.getElementById("select-root")}
         styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
         placeholder='Seleccione'
         className='capitalize w-full'
         options={[{ value: null, label: defaultLabel }].concat(options)}
         value={value}
         onChange={onChange}
         maxMenuHeight={menuHeight}
      />
   </div>
)

export default CustomSelect
