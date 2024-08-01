export interface ISchedule {
  placeId: string;
  memberId: string;
  statusPiket: "belum" | "sudah";
  tanggalPiket: Date;
}

export interface IGeneratedSchedule {
  memberId: string;
  member: string;
  placeId: string;
  place: string;
  statusPiket: string;
  tanggalPiket: Date;
}
