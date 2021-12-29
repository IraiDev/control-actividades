import React from 'react'

function TextContent({ tag = '', value = '', type, className, bold = false }) {

  if (type === 'response') {
    return <p className={`text-sm ${className}`}>{value}...</p>
  }

  if (type === 'color') {
    return (
      <div className="text-center mx-auto">
        <p className={className}>{tag}</p>
        <p className={`h-7 w-7 rounded-full mx-auto mt-2 transition duration-500 ${value}`}></p>
      </div>
    )
  }

  return (
    <div className={className}>
      {tag !== '' && <p className={`inline mr-1 capitalize ${bold ? 'font-bold' : 'font-semibold'}`}>{tag}:</p>}
      {value !== '' && <p className="inline">{value}</p>}
    </div>
  )
}

export default TextContent