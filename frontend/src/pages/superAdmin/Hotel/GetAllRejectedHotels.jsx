import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteHotel, getAllRejectedHotels } from '../../../features/user/hotelSlice'

function GetAllRejectedHotels() {
  const dispatch = useDispatch()
  const {hotels = [], loading} = useSelector((state) => state.hotel)

  // console.log(hotels);

  useEffect(() => {
   dispatch(getAllRejectedHotels())
  }, [dispatch])

  const handelDeleteCityButton = (cityId) => {
    dispatch(deleteHotel(cityId))

   }

   return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-red-100 dark:bg-red-800 text-red-600 dark:text-white rounded-xl shadow-md text-3xl">
            🏨
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Inactive Hotels
            </h1>
            <p className="text-gray-500 dark:text-gray-300 mt-1">
              Total Inactive Hotels: {hotels.length}
            </p>
          </div>
        </div>
      </div>
  
      {/* LOADING */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden animate-pulse shadow-md h-72"
            >
              <div className="h-48 w-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-3 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}
  
      {/* HOTELS GRID */}
      {!loading && hotels.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {hotels.map((hotel) => (
            <div
              key={hotel._id}
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border"
            >
              {/* IMAGE */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hotel.images?.[0]}
                  alt={hotel.name}
                  className="w-full h-full object-cover grayscale group-hover:scale-105 transition duration-500"
                />
  
                {/* STATUS BADGE */}
                <span className="absolute top-3 right-3 px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full font-semibold">
                  {hotel.status}
                </span>
  
                {/* NAME & CITY */}
                <div className="absolute bottom-3 left-4 text-white">
                  <h3 className="text-lg font-semibold">{hotel.name}</h3>
                  <p className="text-sm opacity-90">{hotel.city?.name || "City"}</p>
                </div>
              </div>
  
              {/* INFO */}
              <div className="p-4">
                <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
                  {hotel.address}
                </p>
  
                {/* FACILITIES PREVIEW */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {hotel.facilities?.slice(0, 3).map((f, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 rounded"
                    >
                      {f}
                    </span>
                  ))}
                </div>
  
                {/* ACTIONS */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handelDeleteCityButton(hotel._id)}
                    disabled={loading}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
  
      {/* EMPTY STATE */}
      {!loading && hotels.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-20">
          No inactive hotels found
        </p>
      )}
    </div>
  );
}

export default GetAllRejectedHotels