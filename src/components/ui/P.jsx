const P = ({ tag, value }) => (
  <p>
    <span className='font-semibold capitalize mr-1'>
      {tag}:
    </span>
    {value}
  </p>
)

export default P