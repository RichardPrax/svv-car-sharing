// src/entities/Ride.ts
export interface Ride {
  id: string;
  match_day_id: string;
  driver_id: string;
  departure_time: string;
  departure_location: string;
  available_seats: number;
  additional_info?: string;
  created_at: string;
  updated_at: string;
}

export interface RidePassenger {
  id: string;
  ride_id: string;
  passenger_id: string;
  joined_at: string;
}

export interface RideWithDetails extends Ride {
  driver_name?: string;
  passengers?: RidePassenger[];
  passenger_count: number;
  passenger_names?: string[];
}
