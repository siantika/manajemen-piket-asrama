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
    GENERATE_SCHEDULE_TIME: "0 23 * * 5",
  },
};

export default CONST;
