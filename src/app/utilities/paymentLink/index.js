/** Design department — Skyliner merchant only */
export const DESIGN_DEPARTMENT_ID = "68bf117e7bee051de66530e3";

const merchant = [
  {
    id: "Skyliner Trading LLC",
    name: "Skyliner Trading LLC",
  },
  {
    id: "Kinatech Business Solutions LLC",
    name: "Kinatech Business Solutions LLC",
  },
  // { id: "Augmentus", name: "Augmentus" },
];

const services = [
  "Seo Services",
  "Logo Design",
  "Website Design",
  "Stationery Design",
  "Brochure Design",
  "Website Development",
  "Project Status",
  "Content Writing",
  "Social Media Design",
  "Copy Right Design",
  "Video Production",
  "Client Questionnaire",
  "Email Marketing Questionnaire",
  "SEO Questionnaire",
  "Academic Writing Questionnaire",
  "Illustrations",
  "Other",
  "No Package",
];

const merchantType = [
  "Skyliner Trading LLC",
  "Kinatech Business Solutions LLC",
  "Zelle",
  "Bank Transfer",
  "Stripe",
  "Paypal",
  "Square",
  "Other",
];

const currencyType = [
  { name: "US Dollar (USD)", id: "USD" },
  { name: "Canadian Dollar (CAD)", id: "CAD" },
  { name: "Australian Dollar (AUD)", id: "AUD" },
  { name: "Euro (EUR)", id: "EUR" },
];

const saleOptions = [
  { value: "FRESH", label: "FRESH" },
  { value: "UP SELL", label: "UP SELL" },
];

const sale_Options =
  saleOptions?.map((b) => ({
    value: b?.value,
    label: b?.label,
  })) ?? [];

const merchantOptions =
  merchant?.map((b) => ({
    value: b?.id,
    label: b?.name,
  })) ?? [];

/**
 * Merchant dropdown by department:
 * - Design → only Skyliner Trading LLC
 * - All other depts → everyone except Skyliner
 *
 * @param {string|null|undefined} departmentId
 * @param {Array<{_id?:string,id?:string,name?:string}>} [departments]
 */
export function getMerchantOptionsForDepartment(
  departmentId,
  departments = [],
) {
  const deptId = String(
    departmentId?._id || departmentId || "",
  ).trim();
  const dept = (departments || []).find(
    (d) => String(d?._id || d?.id) === deptId,
  );
  const deptName = String(dept?.name || "").toLowerCase();
  const isDesign =
    deptId === DESIGN_DEPARTMENT_ID ||
    /\bdesigns?\b/i.test(deptName);

  const list = isDesign
    ? merchant.filter((m) => m.id === "Skyliner Trading LLC")
    : merchant.filter((m) => m.id !== "Skyliner Trading LLC");

  return list.map((b) => ({
    value: b.id,
    label: b.name,
  }));
}

const serviceOptions =
  services?.map((b) => ({
    value: b,
    label: b,
  })) ?? [];

const merchantTypeOptions =
  merchantType?.map((b) => ({
    value: b,
    label: b,
  })) ?? [];

const currencyOptions =
  currencyType?.map((b) => ({
    value: b?.id,
    label: b?.name,
  })) ?? [];

export {
  merchantOptions,
  serviceOptions,
  currencyOptions,
  sale_Options,
  merchantTypeOptions,
};
