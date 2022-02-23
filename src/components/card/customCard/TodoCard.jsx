import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import Card from '../Card'
import CardContent from '../CardContent'
import CardFooter from '../CardFooter'
import CardSection from '../CardSection'

const PriorityIndicator = ({ condition }) => {
   if (condition) {
      return (
         <i className='fas fa-star text-yellow-500 absolute top-5 right-5' />
      )
   }

   return null
}

const TodoCard = props => {
   const { title, body, importance } = props
   const styles =
      importance === 'high'
         ? 'bg-zinc-800 text-white'
         : 'bg-white text-slate-700'

   return (
      <Card onDoubleClick={props.editTodo} className={styles} priority={1}>
         <PriorityIndicator condition={importance === 'high'} />

         <CardContent title={title}>
            <CardSection>
               <p className='whitespace-pre-wrap p-1.5 text-xs mix-blend-luminosity rounded-md max-h-60 overflow-custom'>
                  {body.content}
               </p>
            </CardSection>
         </CardContent>

         <CardFooter>
            <span />
            <div>
               <Menu
                  direction='top'
                  align='end'
                  className={styles}
                  menuButton={
                     <MenuButton className='pl-4 pb-1'>
                        <i className='fas fa-ellipsis-v' />
                     </MenuButton>
                  }>
                  <MenuItem
                     className='hover:bg-gray-400 transition duration-200 hover:bg-opacity-30 font-semibold'
                     onClick={props.editTodo}>
                     Editar
                  </MenuItem>
                  <MenuItem
                     className='hover:bg-gray-400 transition duration-200 hover:bg-opacity-30 font-semibold'
                     onClick={props.deleteTodo}>
                     Eliminar
                  </MenuItem>
               </Menu>
            </div>
         </CardFooter>
      </Card>
   )
}

export default TodoCard
