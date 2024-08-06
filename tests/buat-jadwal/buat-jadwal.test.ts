import {
  isImportantPlaceFulfilled,
  getPlacesFromSchedule,
} from "../../src/apps/api/buat-jadwal/helpers";
import { IGeneratedSchedule } from "../../src/apps/api/buat-jadwal/interfaces";

describe("Function Tests", () => {
  describe("isImportantPlaceFulfilled", () => {
    it("should return true if all important places are in the schedule", () => {
      const placesInSchedule = ["museum", "park", "restaurant", "cafe"];
      const importantPlaces = ["museum", "park"];

      const result = isImportantPlaceFulfilled(
        placesInSchedule,
        importantPlaces
      );

      expect(result).toBe(true);
    });

    it("should return false if not all important places are in the schedule", () => {
      const placesInSchedule = ["museum", "park", "restaurant"];
      const importantPlaces = ["museum", "beach"];

      const result = isImportantPlaceFulfilled(
        placesInSchedule,
        importantPlaces
      );

      expect(result).toBe(false);
    });

    it("should return true if there are no important places", () => {
      const placesInSchedule = ["museum", "park", "restaurant"];
      const importantPlaces: string[] = [];

      const result = isImportantPlaceFulfilled(
        placesInSchedule,
        importantPlaces
      );

      expect(result).toBe(true);
    });
  });

  describe("getPlacesFromSchedule", () => {
    it("should extract places from schedule", () => {
      const schedule: IGeneratedSchedule[] = [
        {
          memberId: "001",
          member: "Alice Johnson",
          placeId: "P001",
          place: "museum",
          statusPiket: "Completed",
          tanggalPiket: new Date("2024-08-01T09:00:00Z"),
        },
        {
          memberId: "002",
          member: "Bob Smith",
          placeId: "P002",
          place: "park",
          statusPiket: "park",
          tanggalPiket: new Date("2024-08-02T10:00:00Z"),
        },
        {
          memberId: "003",
          member: "Carol Davis",
          placeId: "P003",
          place: "restaurant",
          statusPiket: "In Progress",
          tanggalPiket: new Date("2024-08-03T11:00:00Z"),
        },
        {
          memberId: "004",
          member: "David Lee",
          placeId: "P004",
          place: "cafe",
          statusPiket: "Completed",
          tanggalPiket: new Date("2024-08-04T12:00:00Z"),
        },
      ];

      const expectedPlaces = ["museum", "park", "restaurant", "cafe"];
      const result = getPlacesFromSchedule(schedule);

      expect(result).toEqual(expectedPlaces);
    });

    it("should return an empty array if the schedule is empty", () => {
      const schedule: IGeneratedSchedule[] = [];

      const result = getPlacesFromSchedule(schedule);

      expect(result).toEqual([]);
    });
  });
});
