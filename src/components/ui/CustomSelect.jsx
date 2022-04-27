import Select, { components } from 'react-select'
import Tooltip, { TooltipPrimitive } from '@atlaskit/tooltip'
import styled from '@emotion/styled';

const InlineDialog = styled(TooltipPrimitive)`
  background: rgb(244, 244, 245);
  border-radius: 4px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  box-sizing: content-box; /* do not set this to border-box or it will break the overflow handling */
  color: #333;
  border: 1px solid #ccc;
  max-height: 300px;
  max-width: 300px;
  padding: 8px 12px;
  margin-left: 13px;
`

const Option = (props) => {

   return (
      <Tooltip appearance='secundary' content={props?.data?.tooltip} position='right-end' component={InlineDialog}>
         <components.Option {...props} />
      </Tooltip>
   )
}

const CustomSelect = ({
   options,
   value,
   onChange,
   defaultLabel = 'ninguno',
   label,
   menuHeight = 200,
   width,
   className,
   showTooltip = false,
   isDefaultOptions = false,
   disabled = false
}) => (
   <div className={`grid gap-1 capitalize text-sm ${width} ${className}`}>
      {label}
      <Select
         isDisabled={disabled}
         components={showTooltip ? { Option } : null}
         menuPortalTarget={document.getElementById("select-root")}
         styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
         placeholder='Seleccione'
         className='capitalize w-full'
         options={!isDefaultOptions ?
            [{ value: null, label: defaultLabel }].concat(options)
            : options
         }
         value={value}
         onChange={onChange}
         maxMenuHeight={menuHeight}
      />
   </div>
)

export default CustomSelect
