import React from 'react'

const ViewSection = ({ children, lg = true, md = false, cols }) => {
   let columns = ''

   if (lg) {
      switch (cols) {
         case 2:
            columns = 'lg:grid-cols-2'
            break
         case 3:
            columns = 'lg:grid-cols-3'
            break
         case 4:
            columns = 'lg:grid-cols-4'
            break
         case 5:
            columns = 'lg:grid-cols-5'
            break
         case 6:
            columns = 'lg:grid-cols-6'
            break
         case 8:
            columns = 'lg:grid-cols-8'
            break

         default:
            columns = 'lg:grid-cols-1'
            break
      }
   }

   if (md) {
      switch (cols) {
         case 2:
            columns = 'md:grid-cols-2'
            break
         case 3:
            columns = 'md:grid-cols-3'
            break
         case 4:
            columns = 'md:grid-cols-4'
            break
         case 5:
            columns = 'md:grid-cols-5'
            break
         case 6:
            columns = 'md:grid-cols-6'
            break
         case 8:
            columns = 'md:grid-cols-8'
            break

         default:
            columns = 'md:grid-cols-1'
            break
      }
   }

   return (
      <section className={`grid grid-cols-1 gap-x-5 ${columns}`}>
         {children}
      </section>
   )
}

export default ViewSection
