const CardSection = ({ colCount = 1, children, subtitle }) => {
   return (
      <>
         {subtitle && <h5 className='font-semibold capitalize'>{subtitle}</h5>}
         <section
            className={`grid gap-1 text-xs ${
               colCount === 1
                  ? 'grid-cols-1'
                  : colCount === 2
                  ? 'grid-cols-2'
                  : colCount === 3
                  ? 'grid-cols-3'
                  : 'grid-cols-1'
            }`}>
            {children}
         </section>
      </>
   )
}

export default CardSection
