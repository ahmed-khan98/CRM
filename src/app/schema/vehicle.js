import * as Yup from "yup";

export const vehicleSchema = Yup.object().shape({
  vendor: Yup.string().required("Please select a vendor"),
  vehicleName: Yup.string().required("Vehicle name is required"),
  make: Yup.string().nullable(),
  model: Yup.string().nullable(),
  year: Yup.number().nullable().min(1900).max(2100),
  rentAmount: Yup.number().nullable().min(0),
  registrationNumber: Yup.string().required("Registration number is required"),
  chassisNumber: Yup.string().nullable(),
  engineNumber: Yup.string().nullable(),
  color: Yup.string().nullable(),
  fuelType: Yup.string().nullable(),
  transmission: Yup.string().nullable(),
  seatingCapacity: Yup.number().nullable().min(1),
  mileage: Yup.number().nullable().min(0),
  status: Yup.string()
    .oneOf(["available", "rented", "maintenance", "inactive"])
    .required(),
  notes: Yup.string().nullable(),
  images: Yup.mixed().nullable(),
  videos: Yup.mixed().nullable(),
});
