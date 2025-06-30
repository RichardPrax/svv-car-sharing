// src/lib/repositories/index.ts
import { UserProfileRepository } from "./userProfileRepository";
import { RideRepository } from "./rideRepository";
import { MatchDayRepository } from "./matchDayRepository";

export { UserProfileRepository } from "./userProfileRepository";
export { RideRepository } from "./rideRepository";
export { MatchDayRepository } from "./matchDayRepository";

// Create singleton instances
export const userProfileRepository = new UserProfileRepository();
export const rideRepository = new RideRepository();
export const matchDayRepository = new MatchDayRepository();
