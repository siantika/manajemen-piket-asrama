const CONST = {
  API_VERSION: process.env.API_VER || "/v1",
  PORT: process.env.PORT || 3000,
  ROLE: {
    ADMIN: "admin",
  },
  STATUS_TEMPAT: {
    RESERVED: "reserved",
  },
  STATUS_PIKET: {
    BELUM: "belum" as "belum",
    SUDAH: "sudah" as "sudah",
  },
  CRON_JOB: {
    // GENERATE_SCHEDULE_TIME: "0 23 * * 5",
    // POST_SCHEDULE_TIME: "59 23 * * 0",
    GENERATE_SCHEDULE_TIME: "06 22 * * *",
    POST_SCHEDULE_TIME: "08 22 * * *",
  },
};

export default CONST;
