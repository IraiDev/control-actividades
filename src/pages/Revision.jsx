import React from 'react'
import { useState } from 'react'
import InputFilter from '../components/filter/InputFilter'
import SelectFilter from '../components/filter/SelectFilter'
import Table from '../components/table/Table'
import TBody from '../components/table/TBody'
import Td from '../components/table/Td'
import Th from '../components/table/Th'
import THead from '../components/table/THead'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import Numerator from '../components/ui/Numerator'

const activities = [1, 2, 3, 4, 5, 6, 7, 8]

const CheckBox = ({ checked, onChange, id }) => {
   return (
      <label
         htmlFor={id}
         className={`flex gap-2 justify-center ${
            checked ? 'text-blue-500' : ''
         }`}>
         <input id={id} type='checkbox' checked={checked} onChange={onChange} />
         Revisado
      </label>
   )
}

const Revision = () => {
   const [multiline, setMultiline] = useState(false)
   const [values, setValues] = useState({ reviewed: false })

   return (
      <Container type='table'>
         <Table>
            <THead>
               <tr className='text-center capitalize bg-white'>
                  <Th className='bg-zinc-100'></Th>
                  <Th>
                     <InputFilter
                        type='table'
                        width='w-16'
                        isNumber
                        name='id'
                        // value={id}
                        // onChange={onChangeValues}
                        // filterDown={() => setOrder({ orden_id: 'desc' })}
                        // filterUp={() => setOrder({ orden_id: 'asc' })}
                        // upActive={setActive({
                        //    param: 'orden_id',
                        //    value: 'asc',
                        // })}
                        // downActive={setActive({
                        //    param: 'orden_id',
                        //    value: 'desc',
                        // })}
                     />
                  </Th>
                  <Th className='bg-zinc-100'>
                     <InputFilter
                        type='table'
                        width='w-16'
                        name='ticket'
                        // value={ticket}
                        // onChange={onChangeValues}
                     />
                  </Th>
                  <Th>
                     <SelectFilter
                        type='table'
                        // value={options.pr}
                        // options={projects}
                        // isMulti
                        // onChange={option =>
                        //    setOptions({ ...options, pr: option })
                        // }
                        // filterDown={() =>
                        //    setOrder({ orden_proyecto: 'desc' })
                        // }
                        // filterUp={() =>
                        //    setOrder({ orden_proyecto: 'asc' })
                        // }
                        // upActive={setActive({
                        //    param: 'orden_proyecto',
                        //    value: 'asc',
                        // })}
                        // downActive={setActive({
                        //    param: 'orden_proyecto',
                        //    value: 'desc',
                        // })}
                     />
                  </Th>
                  <Th className='bg-zinc-100'>
                     <SelectFilter
                        type='table'
                        // value={options.sp}
                        // options={
                        //    options.pr?.length > 1
                        //       ? []
                        //       : options.pr?.length > 0
                        //       ? subProjects?.filter(
                        //            s => s.id === options.pr[0]?.value
                        //         )
                        //       : subProjects
                        // }
                        // isMulti
                        // isOrder={false}
                        // onChange={option =>
                        //    setOptions({ ...options, sp: option })
                        // }
                     />
                  </Th>
                  <Th>
                     <SelectFilter
                        type='table'
                        // value={options.us}
                        // options={users}
                        // isMulti
                        // onChange={option =>
                        //    setOptions({ ...options, us: option })
                        // }
                        // filterDown={() =>
                        //    setOrder({ orden_solicitante: 'desc' })
                        // }
                        // filterUp={() =>
                        //    setOrder({ orden_solicitante: 'asc' })
                        // }
                        // upActive={setActive({
                        //    param: 'orden_solicitante',
                        //    value: 'asc',
                        // })}
                        // downActive={setActive({
                        //    param: 'orden_solicitante',
                        //    value: 'desc',
                        // })}
                     />
                  </Th>
                  <Th className='bg-zinc-100'>
                     <SelectFilter
                        type='table'
                        // value={options.ue}
                        // options={users}
                        // isMulti
                        // onChange={option =>
                        //    setOptions({ ...options, ue: option })
                        // }
                        // filterDown={() =>
                        //    setOrder({ orden_encargado: 'desc' })
                        // }
                        // filterUp={() =>
                        //    setOrder({ orden_encargado: 'asc' })
                        // }
                        // upActive={setActive({
                        //    param: 'orden_encargado',
                        //    value: 'asc',
                        // })}
                        // downActive={setActive({
                        //    param: 'orden_encargado',
                        //    value: 'desc',
                        // })}
                     />
                  </Th>
                  <Th>
                     <InputFilter
                        type='table'
                        width='w-14'
                        name='numPriority'
                        // value={numPriority}
                        // onChange={onChangeValues}
                        // filterDown={() =>
                        //    setOrder({ orden_prioridad_ra: 'desc' })
                        // }
                        // filterUp={() =>
                        //    setOrder({ orden_prioridad_ra: 'asc' })
                        // }
                        // upActive={setActive({
                        //    param: 'orden_prioridad_ra',
                        //    value: 'asc',
                        // })}
                        // downActive={setActive({
                        //    param: 'orden_prioridad_ra',
                        //    value: 'desc',
                        // })}
                     />
                  </Th>
                  {/* <Th className='bg-zinc-100'></Th> */}
                  <Th className='bg-zinc-100'>
                     <InputFilter
                        type='table'
                        width='w-28'
                        name='title'
                        // value={title}
                        // onChange={onChangeValues}
                        // filterDown={() =>
                        //    setOrder({ orden_actividad: 'desc' })
                        // }
                        // filterUp={() =>
                        //    setOrder({ orden_actividad: 'asc' })
                        // }
                        // upActive={setActive({
                        //    param: 'orden_actividad',
                        //    value: 'asc',
                        // })}
                        // downActive={setActive({
                        //    param: 'orden_actividad',
                        //    value: 'desc',
                        // })}
                     />
                  </Th>
                  <Th>
                     <InputFilter
                        type='table'
                        width='w-96'
                        // name='desc'
                        // value={desc}
                        // onChange={onChangeValues}
                        isOrder={false}
                     />
                  </Th>
                  <Th className='flex justify-around pt-3 bg-zinc-100 gap-2 '>
                     <Button
                        className='bg-zinc-100 hover:bg-zinc-200'
                        title='Limpiar filtros'
                        isShadow
                        // onClick={onClear}
                     >
                        <i className='fas fa-eraser' />
                     </Button>
                     <Button
                        className='bg-blue-500 hover:bg-blue-600 text-white'
                        isShadow
                        // onClick={onFilter}
                     >
                        filtrar <i className='fas fa-filter' />
                     </Button>
                  </Th>
               </tr>
               <tr className='text-center capitalize text-white bg-slate-600'>
                  <Th className='bg-slate-700'>Nᵒ</Th>
                  <Th>ID</Th>
                  <Th className='bg-slate-700'>ticket</Th>
                  <Th>proyecto</Th>
                  <Th className='bg-slate-700'>sub proyecto</Th>
                  <Th>solicitante</Th>
                  <Th className='bg-slate-700'>encargado</Th>
                  <Th>prioridad</Th>
                  <Th className='bg-slate-700'>
                     <div className='flex items-baseline justify-center gap-2'>
                        actividad
                        <Button
                           className='hover:bg-white/5'
                           onClick={() => setMultiline(!multiline)}>
                           <i
                              className={
                                 multiline
                                    ? 'fas fa-angle-up'
                                    : 'fas fa-angle-down'
                              }
                           />
                        </Button>
                     </div>
                  </Th>
                  <Th>
                     <div className='flex items-baseline justify-center gap-2'>
                        descripcion
                        <Button
                           className='hover:bg-white/5'
                           onClick={() => setMultiline(!multiline)}>
                           <i
                              className={
                                 multiline
                                    ? 'fas fa-angle-up'
                                    : 'fas fa-angle-down'
                              }
                           />
                        </Button>
                     </div>
                  </Th>
                  <Th className='bg-slate-700'>Marcar P.E</Th>
               </tr>
            </THead>
            <TBody>
               {activities.length > 0 &&
                  activities.map((act, i) => (
                     <tr
                        // onDoubleClick={() =>
                        //    navigate(`detalle-actividad/${act.id_det}`, {
                        //       replace: true,
                        //    })
                        // }
                        key={act}
                        className={`
                                text-sm text-gray-800
                                transition duration-300 cursor-pointer
                                ${
                                   i !== activities.length - 1 &&
                                   'border-b border-gray-500'
                                }
                              `}>
                        <Td bgcolor>
                           <Numerator number={i + 1} />
                        </Td>

                        <Td className='font-bold'>{act.id_det}</Td>

                        <Td
                           className={act.num_ticket_edit ? 'font-bold' : ''}
                           bgcolor>
                           {act.num_ticket_edit || '--'}
                        </Td>

                        <Td className='font-bold'>{act.abrev}</Td>

                        <Td bgcolor>{act.nombre_sub_proy ?? '--'}</Td>

                        <Td>{act.user_solicita}</Td>

                        <Td className='font-bold' bgcolor>
                           {act.encargado_actividad}
                        </Td>

                        <Td className='font-bold'>{act.num_prioridad}</Td>

                        <Td
                           bgcolor
                           isMultiLine={multiline}
                           width='max-w-[150px]'
                           align='text-left'>
                           {act.actividad || 'Sin Titulo'}
                        </Td>

                        <Td isMultiLine={multiline} align='text-left'>
                           {act.func_objeto}
                        </Td>
                        <Td bgcolor>
                           <CheckBox
                              id={i}
                              checked={values.reviewed}
                              onChange={e =>
                                 setValues({
                                    ...values,
                                    reviewed: e.target.checked,
                                 })
                              }
                           />
                        </Td>
                     </tr>
                  ))}
            </TBody>
         </Table>
      </Container>
   )
}

export default Revision
