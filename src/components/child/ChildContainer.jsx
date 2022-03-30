import ChildItem from "./ChildItem"
import Select from 'react-select';


const ChildContainer = (props) => {
   return (
      <section className='rounded-lg bg-zinc-100 border mb-8 relative'>

         <header className='flex items-center justify-between py-2 px-4 border-b bg-white rounded-t-lg'>

            <h5>Actividades Hijas</h5>

            <div className='flex items-center gap-2 min-w-max'>
               Agrupar:
               <Select className='w-48' />
            </div>

         </header>

         <div className='p-4 max-h-[70vh] overflow-custom flex-col space-y-2'>

            <ChildItem {...props} number={1} />
            <ChildItem {...props} number={1.1} />
            <ChildItem {...props} number={'1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />
            <ChildItem {...props} number={'1.1.1.1.1'} />

         </div>

      </section>
   )
}

export default ChildContainer