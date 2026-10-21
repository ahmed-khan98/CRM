import { describe, it, expect } from "vitest";
import { empSchema } from "./employee";

const baseCreate = {
  departmentId: "64a1b2c3d4e5f67890123456",
  joiningDate: "2026-11-01",
  designation: "Engineer",
  fullName: "Test User",
  email: "test@example.com",
  phoneNo: "0300-1234567",
  CNIC: "42101-1234567-1",
  address: "Karachi",
  image: "https://cdn.example.com/photo.jpg",
  password: "secret123",
  isEdit: false,
  isRecruitmentHire: false,
  employmentType: "",
};

describe("empSchema", () => {
  it("accepts a valid manual create payload", async () => {
    await expect(empSchema.validate(baseCreate)).resolves.toMatchObject({
      email: "test@example.com",
    });
  });

  it("requires password for manual create", async () => {
    await expect(
      empSchema.validate({ ...baseCreate, password: "" })
    ).rejects.toThrow(/Password is required/);
  });

  it("allows empty password for recruitment hire", async () => {
    await expect(
      empSchema.validate({
        ...baseCreate,
        password: "",
        isRecruitmentHire: true,
      })
    ).resolves.toBeTruthy();
  });

  it("allows empty employmentType for HR to fill later", async () => {
    const v = await empSchema.validate({
      ...baseCreate,
      isRecruitmentHire: true,
      password: "",
      employmentType: "",
    });
    expect(v.employmentType).toBe("");
  });

  it("rejects invalid phone format", async () => {
    await expect(
      empSchema.validate({ ...baseCreate, phoneNo: "03001234567" })
    ).rejects.toThrow(/0300-1234567/);
  });

  it("rejects invalid CNIC format", async () => {
    await expect(
      empSchema.validate({ ...baseCreate, CNIC: "4210112345671" })
    ).rejects.toThrow(/40000-1234567-8/);
  });

  it("requires image on create but not on edit", async () => {
    await expect(
      empSchema.validate({ ...baseCreate, image: "" })
    ).rejects.toThrow(/image is required/i);

    await expect(
      empSchema.validate({
        ...baseCreate,
        image: "",
        isEdit: true,
        password: "",
      })
    ).resolves.toBeTruthy();
  });

  it("accepts Cloudinary URL as image for recruitment prefill", async () => {
    await expect(
      empSchema.validate({
        ...baseCreate,
        isRecruitmentHire: true,
        password: "",
        image: "https://res.cloudinary.com/demo/image/upload/v1/photo.jpg",
      })
    ).resolves.toBeTruthy();
  });
});
