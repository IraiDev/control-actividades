import Td from '../Td'
import TdControlDistribution from './TdControlDistribution'
import Button from '../../ui/Button'
import { useState } from 'react'

const TdSwitch = (props) => {

   const {state} = props

   const [play, setPlay] = useState(true)
  

   if(state === 13 || state === 5){
      return (
         <TdControlDistribution 
            getId={(id_callback) => props.getId(id_callback)}
            callback={(times) => props.onDistribution({distribuciones: times, id_actividad: props.id_det})}
            isStickyRight 
            {...props}  
         />
      )
   } 

   
   if(state === 3){
      return (
         <Td isStickyRight >
            <div className='flex gap-2 justify-center'>
               <Button 
                  className='bg-emerald-100 hover:bg-emerald-200 text-emerald-500 border border-emerald-300'
                  onClick={() => props.onChangeCheckedActivity({id: props.id_det, title: props.actividad, revisado: true, estado: props.estado})}
               >
                  <i className='fas fa-check' />
               </Button>

               <Button 
                  className='bg-red-100 hover:bg-red-200 text-red-500 border border-red-300 px-3'
                  onClick={() => props.onChangeCheckedActivity({id: props.id_det, title: props.actividad, revisado: false, estado: props.estado})}  
               >
                  <i className='fas fa-times' />
               </Button>
            </div>
         </Td> 
      )
   }

   if(state === 12){
      return (
         <>
            <Td isStickyRight >
               <div className='flex justify-center'>
                  {
                     play ?
                        <Button
                           onClick={() => setPlay(false)}
                           className='bg-green-100 hover:bg-green-200 text-green-500 border border-green-300'
                        >
                           <i className='fas fa-truck fa-xs' />
                           <i className='fas fa-play fa-xs' />
                        </Button>
                        :
                        <div className='flex gap-1.5'>

                           <Button
                              onClick={() => setPlay(true)}
                              className='bg-red-100 hover:bg-red-200 text-red-500 border border-red-300'
                           >
                              <i className='fas fa-truck fa-xs' />
                              <i className='fas fa-pause fa-xs' />
                           </Button>

                           <Button
                              onClick={() => setPlay(true)}
                              className='bg-emerald-100 hover:bg-emerald-200 text-emerald-500 border border-emerald-300'
                           >
                              <i className='fas fa-check' />
                           </Button>

                           <Button
                              onClick={() => setPlay(true)}
                              className='bg-red-100 hover:bg-red-200 text-red-500 border border-red-300'
                           >
                              <i className='fas fa-times' />
                           </Button>

                        </div>
                  }
               </div>
            </Td>
         </>
      )
   }

   return null

}

export default TdSwitch