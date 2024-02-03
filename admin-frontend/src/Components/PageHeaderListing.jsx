import React from 'react'

const PageHeaderListing = ({ title, children}) => {
  return (
    <div className='flex flex-row justify-between'>
         <div className='flex flex-col'>
            <div className='px-10 pt-10 mt-5 pb-5'>
                <h1 className="text-4xl text-gray-800 font-semibold mb-1">{title}</h1>
                <h5 className='font-medium text-gray-700'>List of {title} Accounts</h5>
            </div>
        </div>
        <div className='px-10 pt-20 pb-5 mt-5' >
            {children}
        </div>
    </div>
   
  )
}

export default PageHeaderListing