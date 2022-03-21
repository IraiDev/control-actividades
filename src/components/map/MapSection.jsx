import { useState } from 'react'
import MapItem from './MapItem'
import OnOutsiceClick from 'react-outclick'
import { useDetail } from '../../hooks/useDetail'

const MapSection = ({ number, state, desc, id }) => {

   const { getMap } = useDetail(id)

   const [showDetail, setShowDetail] = useState(false)
   const [detailMap, setDetailMap] = useState([])

   const handleGetMap = async (state) => {

      if(state){
         const resp = await getMap({ estado: 1})
         setDetailMap(resp)
         console.log(resp)
      }

      setShowDetail(state)

   }

   return (
      <OnOutsiceClick onOutsideClick={() => setShowDetail(false)}>

         <div className='relative'>

            <span 
               onClick={ () => handleGetMap(!showDetail) }
               className={`
                  rounded-full text-lg flex justify-center items-center border font-bold h-10 w-10 transform transition duration-200
                  ${showDetail && 'scale-125 bg-zinc-100'}
               `}
            >
               { number }
            </span>

            <span className='text-xs absolute -top-5 left-1/2 transform -translate-x-1/2 capitalize'>
               {state}
            </span>

            {showDetail &&

               <div className='absolute z-30 top-12 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-md shadow-lg border text-sm'>
                  
                  <h1>
                     <span className='font-semibold mr-2'>Estado:</span> 
                     { state }
                  </h1>

                  <h5 className='font-semibold'>Condicion: </h5>

                  <p className='my-1'>{ desc }</p>

                  <h5 className='mb-1 font-semibold'>información hijas: </h5>

                  <div className='min-w-full overflow-auto'>
                     { detailMap.length > 0 ?

                        detailMap.map( dm => (
                           <MapItem 
                              margin={ dm.nivel - 1 }
                              key={ dm.id_det } 
                              title={ dm.actividad } 
                              state={ dm.estado } 
                              id={ dm.id_det } 
                           />
                        ))

                        : <p>No hay información</p>

                     }
                  </div>

               </div>

            }

         </div>
      </OnOutsiceClick>
   )
}

export default MapSection