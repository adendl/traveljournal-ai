import React from 'react';
     import { TrashIcon } from '@heroicons/react/24/outline';
     import { buildApiUrl, getApiHeaders, API_ENDPOINTS, fetchWithTimeout } from '../utils/api';

     interface Location {
       name: string;
       latitude: number;
       longitude: number;
     }

     interface PlaceOfInterest {
       name: string;
       description: string;
       latitude: number;
       longitude: number;
     }

     interface DayPlan {
       id: number;
       dayNumber: number;
       startLocation: Location;
       finishLocation: Location;
       distanceKm: number;
       introduction: string;
       placesOfInterest: PlaceOfInterest[];
     }

     interface TripPlan {
       id: number;
       days: DayPlan[];
     }

     interface Trip {
       id: number;
       from: string;
       to: string;
       roundtrip: boolean;
       days: number;
       interests: string[];
       distanceKm: number;
       createdAt: string;
       tripPlans: TripPlan[];
     }

     interface TripCardProps {
       trip: Trip;
       onSelect: () => void;
       onDelete: (id: number) => void;
       setError: (error: string | null) => void;
     }

     const TripCard: React.FC<TripCardProps> = ({ trip, onSelect, onDelete, setError }) => {
       const handleDelete = async () => {
         const token = localStorage.getItem('token');
         if (!token) {
           setError('No JWT token found. Please log in again.');
           return;
         }

         try {
           const response = await fetchWithTimeout(buildApiUrl(API_ENDPOINTS.TRIPS.DELETE(trip.id)), {
             method: 'DELETE',
             headers: getApiHeaders(token),
           }, 10000); // 10 seconds timeout for delete operations

           if (!response.ok) {
             throw new Error(`HTTP error! status: ${response.status}`);
           }

           onDelete(trip.id);
         } catch (error) {
           console.error('Error deleting trip:', error);
           setError('Failed to delete trip. Please try again or check your connection.');
         }
       };

       return (
         <div
           className="bg-white bg-opacity-20 border border-gray-200 p-4 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 cursor-pointer relative"
           onClick={(e) => {
             if (!(e.target as HTMLElement).closest('button')) {
               onSelect();
             }
           }}
         >
           <div className="flex justify-between items-start">
             <div>
               <h3 className="text-xl font-semibold text-gray-700">{trip.from} to {trip.to}</h3>
               <p className="text-gray-600 text-sm">{new Date(trip.createdAt).toLocaleDateString()}</p>
               <p className="text-gray-600 text-sm">Days: {trip.days}, Total Distance: {trip.distanceKm} km</p>
               <p className="text-gray-600 text-sm">Interests: {trip.interests.join(', ') || 'None'}</p>
             </div>
             <button
               onClick={handleDelete}
               className="text-red-600 hover:text-red-700 focus:outline-none"
             >
               <TrashIcon className="h-5 w-5" />
             </button>
           </div>
         </div>
       );
     };

     export default TripCard;