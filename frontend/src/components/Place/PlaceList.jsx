import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDistanceRadius,
  selectNearbyError,
  selectNearbyLoading,
  selectNearbyPlaces,
  selectPagination,
  selectPlaces,
  selectPlacesError,
  selectPlacesLoading,
  selectUsingNearby,
} from "../../features/user/placeSlice";
import EmptyState from "./EmptyState";
import LoadingSkeleton from "./LoadingSkeleton";
import PlaceCard from "./PlaceCard";

const KM_MAP = {
  5: "5 km",
  20: "20 km",
  50: "50 km",
  100: "100 km",
};

export default function PlaceList({ cityName, onPlaceClick }) {
  useDispatch();
  const places        = useSelector(selectPlaces);
  const nearby        = useSelector(selectNearbyPlaces);
  const loadingPlaces = useSelector(selectPlacesLoading);
  const loadingNearby = useSelector(selectNearbyLoading);
  const errorPlaces   = useSelector(selectPlacesError);
  const errorNearby   = useSelector(selectNearbyError);
  const usingNearby   = useSelector(selectUsingNearby);
  const radius        = useSelector(selectDistanceRadius);
  const pagination    = useSelector(selectPagination);

  const isLoading  = usingNearby ? loadingNearby : loadingPlaces;
  const list       = usingNearby ? nearby         : places;
  const error      = usingNearby ? errorNearby    : errorPlaces;
  const radiusLabel = KM_MAP[radius] || `${Math.round(radius)} km`;

  useEffect(() => { void cityName; }, [cityName]);

  /* ── Error ── */
  if (error && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor"
               strokeWidth={1.5} viewBox="0 0 24 24">
            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0
                     2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898
                     0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Something went wrong</h3>
        <p className="text-sm text-gray-500 max-w-xs">{error}</p>
      </div>
    );
  }

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12">
        <LoadingSkeleton count={8} />
      </div>
    );
  }

  /* ── Empty ── */
  if (list.length === 0) {
    return <EmptyState cityName={cityName} usingNearby={usingNearby} radiusKm={radiusLabel} />;
  }

  /* ── List ── */
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10">

      {/* Nearby pill */}
      {usingNearby && (
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600
                           bg-emerald-50 border border-emerald-100 px-5 py-2 rounded-full shadow-sm">
            📡 Live Nearby — within {radiusLabel}
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
      )}

      {/* ── Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {list.map((place) => (
          <PlaceCard
            key={place._id}
            place={place}
            distanceInKm={place.distanceInKm ?? null}
            onClick={onPlaceClick}
          />
        ))}
      </div>

      {/* Pagination info */}
      {!usingNearby && pagination?.totalPages > 1 && (
        <div className="mt-14 flex justify-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Showing {list.length} of {pagination.total} places
          </p>
        </div>
      )}
    </div>
  );
}