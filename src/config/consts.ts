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
    BELUM: "belum",
  }
};

export default CONST;
