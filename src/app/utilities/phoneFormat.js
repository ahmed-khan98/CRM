export const formatPhoneNumber = (value) => {
  const cleaned = value.replace(/\D/g, "");

  // If user enters just country code (1)
  if (cleaned.length === 1) {
    return cleaned;
  }

  // If starts with "1" as country code
  const hasCountryCode = cleaned.length > 10 && cleaned[0] === "1";

  const country = hasCountryCode ? "1 " : "";
  const start = hasCountryCode ? 1 : 0;

  const areaCode = cleaned.slice(start, start + 3);
  const middle = cleaned.slice(start + 3, start + 6);
  const last = cleaned.slice(start + 6, start + 10);

  if (cleaned.length < start + 4) {
    return `${country}(${areaCode}`;
  } else if (cleaned.length < start + 7) {
    return `${country}(${areaCode}) ${middle}`;
  } else if (cleaned.length <= start + 10) {
    return `${country}(${areaCode}) ${middle}-${last}`;
  } else {
    return `${country}(${areaCode}) ${middle}-${last}`; // ignore extra digits
  }
};