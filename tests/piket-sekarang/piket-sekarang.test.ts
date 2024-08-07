import {
  createPiket,
  getAllPikets,
  updatePiket,
  removePiket,
  PiketSekarangUpdate,
} from "../../src/apps/api/manajemen-jadwal-piket-sekarang/piket-sekarang"; // Sesuaikan dengan jalur file service Anda
import PiketSekarang from "../../src/models/piket-sekarang";
import CONST from "../../src/config/consts";

// Mock model PiketSekarang
jest.mock("../../src/models/piket-sekarang");

const mockPiketSekarang = PiketSekarang as jest.Mocked<typeof PiketSekarang>;

describe("PiketSekarang Service", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should create a new PiketSekarang entry", async () => {
    const mockData = {
      name: "John",
      tempatPiket: "Library",
      tanggalPiket: new Date(),
    };

    mockPiketSekarang.create.mockResolvedValue(mockData);

    const result = await createPiket(
      mockData.name,
      mockData.tempatPiket,
      mockData.tanggalPiket
    );
    expect(result).toEqual(mockData);
    expect(mockPiketSekarang.create).toHaveBeenCalledWith({
      nama: mockData.name,
      tempat: mockData.tempatPiket,
      tanggalPiket: mockData.tanggalPiket,
      statusPiket: "belum",
    });
  });

  it("should read all PiketSekarang entries", async () => {
    const mockSchedules: any = [
      {
        id: 1,
        name: "John",
        tempatPiket: "Library",
        tanggalPiket: new Date(),
        statusPiket: CONST.STATUS_PIKET.BELUM,
      },
    ];

    mockPiketSekarang.findAll.mockResolvedValue(mockSchedules);

    const result = await getAllPikets();
    expect(result).toEqual(mockSchedules);
    expect(mockPiketSekarang.findAll).toHaveBeenCalled();
  });

  it("should update a PiketSekarang entry", async () => {
    const id = 1;
    const updates: PiketSekarangUpdate = { name: "Jane", statusPiket: "sudah" };
    const updatedPiket = { id, ...updates } as PiketSekarang; // Pastikan tipe sesuai

    // Set up the mock to return affected count
    mockPiketSekarang.update.mockResolvedValue([1]);

    // Mock the findByPk to return the updated record
    mockPiketSekarang.findByPk = jest.fn().mockResolvedValue(updatedPiket);

    // Call the function to test
    const result = await updatePiket(id, updates);

    // Assertions
    expect(result).toEqual(updatedPiket);
    expect(mockPiketSekarang.update).toHaveBeenCalledWith(updates, {
      where: { id },
    });
  });

  it("should remove a PiketSekarang entry", async () => {
    const id = 1;
    const piketSekarang: any = {
      id,
      destroy: jest.fn().mockResolvedValue(true),
    };

    mockPiketSekarang.findByPk.mockResolvedValue(piketSekarang);

    const result = await removePiket(id);
    expect(result).toEqual(piketSekarang);
    expect(mockPiketSekarang.findByPk).toHaveBeenCalledWith(id);
    expect(piketSekarang.destroy).toHaveBeenCalled();
  });

  it("should throw an error if PiketSekarang to remove is not found", async () => {
    const id = 999;
    mockPiketSekarang.findByPk.mockResolvedValue(null);

    await expect(removePiket(id)).rejects.toThrow("PiketSekarang not found");
  });
});
