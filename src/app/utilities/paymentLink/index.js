const merchant = [
  {
    id: "Kinatech Business Solutions LLC",
    name: "Kinatech Business Solutions LLC",
  },
  { id: "Augmentus", name: "Augmentus" },
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
  "Kinatech Business Solutions LLC",
        "Augmentus",
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

export { merchantOptions, serviceOptions, currencyOptions,sale_Options,merchantTypeOptions };
