import { useState } from 'react'
import Button from '../../ui/Button'
import P from '../../ui/P'
import Card from '../Card'
import CardContent from '../CardContent'
import CardSection from '../CardSection'
import moment from 'moment'
import Tag from '../../ui/Tag'
import CardFooter from '../CardFooter'
import FloatMenu from '../../ui/FloatMenu'

const ChildCard = (props) => {

   const [showDesc, setShowDesc] = useState(false)

   const ESTADO_PAUSA = props.estado === 1
   const ESTADO_play = props.estado_play_pausa === 2
   const isFather = props.es_padre === 1 && props.es_hijo === 0
   const isChildren = props.es_hijo === 1 && props.es_padre === 0
   const isChildrenAndFather = props.es_hijo === 1 && props.es_padre === 1
   const isChildrenAndFatherAndCoor = props.es_hijo === 1 && props.es_padre === 1 && props.id_tipo_actividad === 4
   const isReviewedActivity = props.id_tipo_actividad === 2
   const isCoorActivity = props.id_tipo_actividad === 4
   const isDeliveryActivity = props.id_tipo_actividad === 3
   const isTicket = props.num_ticket_edit > 0
   const isRestricted = props.predecesoras.length > 0

   return (
      <Card
         showPing={props.estado_play_pausa === 2}
         priority={props.prioridad_etiqueta}
         //   onDoubleClick={handleNavigate}
         isChildren={isChildren}
         isFather={isFather}
         isCoorActivity={isCoorActivity}
         isChildrenAndFather={isChildrenAndFather}
         isReviewedActivity={isReviewedActivity}
         isDeliveryActivity={isDeliveryActivity}
         isChildrenAndFatherAndCoor={isChildrenAndFatherAndCoor}
         isTicket={isTicket}
         {...props}
      >

         {isRestricted &&
            <span
               className='h-7 w-7 flex justify-center items-center mx-auto absolute top-3 right-12'
               title='Actividad con predecesores y restricciones'
            >
               <i className='fas fa-link' />
            </span>
         }

         <CardContent title={props.actividad} cardNum={props.numberCard}>

            <CardSection colCount={3}>
               <aside className='capitalize'>

                  <P tag='Encargado' value={props.encargado_actividad} />

                  <P tag='Prioridad' value={props.num_prioridad} />

               </aside>

               <section className='capitalize'>

                  <P tag='creacion' value={moment(props.fecha_tx).format('DD-MM-YY')} />

                  <P tag='estado' value={ESTADO_PAUSA ? ' pendiente' : ' en trabajo'} />

               </section>

               <aside className='capitalize'>

                  <span className='flex gap-1 max-w-max rounded'>
                     <strong>ID:</strong>
                     <p
                     //   className={`

                     //          px-1 rounded font-semibold
                     //          ${colorID().color}

                     //       `}
                     //   onClick={() => setIdSelect(props.id_det)}
                     >
                        {props.id_det}
                     </p>
                  </span>

                  <P tag='revisor' value={props.abrev_revisor || '--'} />

               </aside>
            </CardSection>

            <br />

            <CardSection>
               <Button
                  className='bg-black/5 hover:bg-black/10'
                  onClick={() => setShowDesc(true)}
               >
                  ver descripción
               </Button>

               {showDesc &&
                  <p className='bg-white rounded-lg shadow-xl border p-2 absolute top-0 bottom-0 right-0 left-0'>
                     {props.func_objeto}
                  </p>
               }

               <div className='flex gap-3'>

                  <Tag>
                     Tipo: {props.desc_tipo_actividad}
                  </Tag>

                  {props.notas.length > 0 &&
                     <Tag>
                        Tiene {props.notas.length} notas
                     </Tag>
                  }
               </div>

            </CardSection>

         </CardContent>

         <CardFooter>
            <FloatMenu
               hidden={!ESTADO_PAUSA || (isFather && isTicket)}
               name='time'
            //   value={time}
            //   onChange={onChangeValues}
            //   onClick={() => {
            //      reset()
            //      handleUpdateState()
            //   }}
            //   reset={reset}
            />

            <Button
               hidden={ESTADO_PAUSA || (isFather && isTicket)}
               className='hover:bg-black/5'
               size='w-7 h-7'
            //   onClick={
            //      ESTADO_play
            //         ? () => handleOpenModalPause()
            //         : () => playActivity({ id_actividad: props.id_det, encargado: props.encargado_actividad })
            //   }
            >
               <i
                  className={
                     ESTADO_play
                        ? 'fas fa-pause fa-sm'
                        : 'fas fa-play fa-sm'
                  }
               />
            </Button>

            <span />
         </CardFooter>

      </Card>
   )
}

export default ChildCard