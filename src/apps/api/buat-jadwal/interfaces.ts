export interface ISchedule {
  tempatId: string;
  penghuniId: string;
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
