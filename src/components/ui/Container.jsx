const Container = ({ type = 'card', children }) => {
   if (type === 'card') {
      return (
         <section className='pt-10 pb-24 px-2 container mx-auto gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {children}
         </section>
      )
   }

   if (type === 'table') {
      return <section className='px-2 3xl:px-56'>{children}</section>
   }

   return null
}

export default Container
