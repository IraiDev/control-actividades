import { useContext,useState } from 'react'
import { ActivityContext } from '../context/ActivityContext'
import { useActivityPr } from '../hooks/useActivityPr'
import StaticSelect from '../components/ui/StaticSelect'
import InputFilter from '../components/filter/InputFilter'
import SelectFilter from '../components/filter/SelectFilter'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import Numerator from '../components/ui/Numerator'
import FooterCounter from '../components/ui/FooterCounter'
import FooterPage from '../components/ui/FooterPage'
import Table from '../components/table2/Table'
import TBody from '../components/table2/TBody'
import Td from '../components/table2/Td'
import Th from '../components/table2/Th'
import THead from '../components/table2/THead'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import { useRef } from 'react'

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
   const [first, setfirst] = useState(false)

   const ref = useRef()

   const { pager, setPager, saveFilters } = useContext(ActivityContext)

   const { activitiesPR } = useActivityPr()

   const onChangeSelect = e => {
      setPager({ page: 1, limit: e.target.value })
      saveFilters({
         payload: { limit: e.target.value, offset: 0 },
      })
   }

   return (
      <>
         <Container type='table'>

            <Table>
               <THead>
                  <tr className='text-center capitalize'>

                     <Th></Th>
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

                     <Th>
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

                     <Th>
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

                     <Th>
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
                     </Th>

                     <Th>
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

                     <Th>
                        <div className='flex justify-around pt-3 gap-2'>
                           <Button
                              className='hover:bg-black/20'
                              title='Limpiar filtros'
                              isShadow
                              // onClick={onClear}
                           >
                              <i className='fas fa-eraser' />
                           </Button>
                           <Button
                              className='bg-blue-600 hover:bg-blue-500 text-white'
                              isShadow
                              // onClick={onFilter}
                           >
                              filtrar <i className='fas fa-filter' />
                           </Button>
                        </div>
                     </Th>

                  </tr>
               </THead>
            </Table>

            <Table>
               <THead>
                  <tr className='text-center capitalize'>
                     <Th>Nᵒ</Th>
                     <Th>ID</Th>
                     <Th>ticket</Th>
                     <Th>proyecto</Th>
                     <Th>sub proyecto</Th>
                     <Th>solicitante</Th>
                     <Th>encargado</Th>
                     <Th>estado</Th>
                     <Th>
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
                     <Th>Marcar P.E</Th>
                  </tr>
               </THead>
               <TBody>
                  {activitiesPR.length > 0 &&
                     activitiesPR.map((act, i) => (
                        <tr
                           key={act.id_det}
                           className='text-[13px] text-gray-800 transition duration-300 cursor-pointer hover:bg-black/10'
                           onDoubleClick={() => setfirst(true)}
                        >
                              
                           <Td><Numerator number={i + 1} /></Td>

                           <Td>{act.id_det}</Td>

                           <Td>{act.num_ticket_edit || '--'}</Td>

                           <Td>{act.abrev}</Td>

                           <Td>{act.nombre_sub_proy ?? '--'}</Td>

                           <Td>{act.user_solicita}</Td>

                           <Td>{act.encargado_actividad}</Td>

                           <Td>{act.estado}</Td>

                           <Td
                              isMultiLine={multiline}
                              width='max-w-[150px]'
                              align='text-left'
                           >
                              {act.actividad || 'Sin Titulo'}
                           </Td>

                           <Td isMultiLine={multiline} align='text-left'>
                              {act.func_objeto}
                           </Td>
                           <Td>
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

         <FooterPage>
            <FooterCounter count={activitiesPR.length} />

            {/* <Pagination
               siblingCount={size.width < 480 ? 0 : 1}
               boundaryCount={size.width < 480 ? 0 : 1}
               size='small'
               count={
                  pager.limit === ''
                     ? 1
                     : Math.ceil(Number(total) / Number(pager.limit))
               }
               color='primary'
               onChange={onChangePage}
               page={pager.page}
            /> */}

            <div className='flex gap-2'>
               {/* <Button
                  disabled={view}
                  className={`hover:text-blue-500 hover:bg-zinc-100 ${
                     view && 'text-blue-500'
                  }`}
                  onClick={() => toggleView(true)}>
                  <i className='fas fa-border-all' />
               </Button>
               <Button
                  disabled={!view}
                  className={`hover:text-blue-500 hover:bg-zinc-100 ${
                     !view && 'text-blue-500'
                  }`}
                  onClick={() => toggleView(false)}>
                  <i className='fas fa-th-list' />
               </Button> */}
               <StaticSelect value={pager.limit} onChange={onChangeSelect} />
            </div>
         </FooterPage>

         <Modal 
            showModal={first} 
            isBlur={false} 
            onClose={() => setfirst(false)} 
            title='pasar a entregado'
         >
            <div>
               <Input ref={ref} />
               <Button onClick={() => console.log(ref.current.value)}>
                  imprimir
               </Button>
            </div>
         </Modal>
      </>
   )
}

export default Revision
