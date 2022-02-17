const FooterPage = ({ children }) => {
   return (
      <footer
         className='fixed bottom-0 h-11 bg-white text-slate-700 
            border w-full flex items-center justify-around shadow'>
         {children}
      </footer>
   )
}

export default FooterPage
