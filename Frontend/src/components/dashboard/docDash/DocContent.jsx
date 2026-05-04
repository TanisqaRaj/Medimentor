import React from 'react'

const DocContent = () => {
  return (
    <div className='w-full'>
      <div className="px-4 lg:px-10 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-[30vh]">
          <div className="border shadow-lg rounded-lg p-6 flex flex-col items-center justify-center bg-white hover:shadow-2xl duration-300">
            <div className="text-4xl font-bold text-emerald-500 mb-4">45</div>
            <div className="bg-emerald-100 text-emerald-600 w-full text-center py-2 rounded-md font-medium">
              Number of Appointments
            </div>
          </div>

          <div className="border shadow-lg rounded-lg p-6 flex flex-col items-center justify-center bg-white hover:shadow-2xl duration-300">
            <div className="text-4xl font-bold text-emerald-500 mb-4">12</div>
            <div className="bg-emerald-100 text-emerald-600 w-full text-center py-2 rounded-md font-medium">
              Completed Appointments
            </div>
          </div>

          <div className="border shadow-lg rounded-lg p-6 flex flex-col items-center justify-center bg-white hover:shadow-2xl duration-300">
            <div className="text-4xl font-bold text-emerald-500 mb-4">8</div>
            <div className="bg-emerald-100 text-emerald-600 w-full text-center py-2 rounded-md font-medium">
              Pending Appointments
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocContent
