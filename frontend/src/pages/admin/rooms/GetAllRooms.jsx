import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRoomsByID } from "../../../features/user/roomSlice";
import { useParams } from "react-router-dom";

function GetAllRooms() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { rooms = [], loading } = useSelector((state) => state.room);

  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    if (id) dispatch(getAllRoomsByID(id));
  }, [dispatch, id]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Hotel Rooms</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              onClick={() => setSelectedRoom(room)}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl cursor-pointer transition"
            >
              <img
                src={room.images?.[0]}
                className="h-48 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="text-xl font-semibold capitalize">
                  {room.roomType}
                </h3>
                <p className="text-gray-500">
                  Capacity: {room.capacity}
                </p>
                <p className="font-bold text-blue-600">
                  ₹{room.pricePerNight} / night
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl w-175 p-6 relative animate-fadeIn">

            <button
              onClick={() => setSelectedRoom(null)}
              className="absolute top-3 right-3 text-xl"
            >
              ✖
            </button>

            <img
              src={selectedRoom.images?.[0]}
              className="h-60 w-full object-cover rounded-xl"
            />

            <h2 className="text-2xl font-bold mt-4 capitalize">
              {selectedRoom.roomType}
            </h2>

            <p className="text-gray-600 mt-2">
              {selectedRoom.description}
            </p>

            <div className="grid grid-cols-3 gap-4 mt-4">

              <div className="bg-gray-100 p-3 rounded">
                <p className="text-sm">Price</p>
                <p className="font-bold">₹{selectedRoom.pricePerNight}</p>
              </div>

              <div className="bg-gray-100 p-3 rounded">
                <p className="text-sm">Capacity</p>
                <p className="font-bold">{selectedRoom.capacity}</p>
              </div>

              <div className="bg-gray-100 p-3 rounded">
                <p className="text-sm">Total Rooms</p>
                <p className="font-bold">{selectedRoom.totalRooms}</p>
              </div>

            </div>

            {/* Amenities */}
            <div className="mt-4">
              <p className="font-semibold mb-2">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {selectedRoom.amenities?.map((a, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default GetAllRooms;