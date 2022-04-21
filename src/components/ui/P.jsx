const P = ({ tag, value }) => (
   <p>
      <span className='font-bold capitalize mr-1'>{tag}:</span>
      <span className='capitalize'>{value}</span>
   </p>
)

export default P
