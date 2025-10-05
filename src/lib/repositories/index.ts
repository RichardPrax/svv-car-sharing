// src/lib/repositories/index.ts
import { UserProfileRepository } from "./userProfileRepository";
import { RideRepository } from "./rideRepository";
import { MatchDayRepository } from "./matchDayRepository";
import { TrainingRepository } from "./trainingRepository";

export { UserProfileRepository } from "./userProfileRepository";
export { RideRepository } from "./rideRepository";
export { MatchDayRepository } from "./matchDayRepository";
export { TrainingRepository } from "./trainingRepository";

// Create singleton instances
export const userProfileRepository = new UserProfileRepository();
export const rideRepository = new RideRepository();
export const matchDayRepository = new MatchDayRepository();
export const trainingRepository = new TrainingRepository();
