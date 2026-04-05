export const hasValue = (value: string | null | undefined) =>
  typeof value === "string" && value.trim().length > 0;

export const hasMeaningfulValue = (
  value: string | null | undefined,
  ignoredValues: string[] = [],
) => {
  if (!hasValue(value)) {
    return false;
  }

  const normalizedValue = value.trim().toLowerCase();

  return !ignoredValues.some((ignoredValue) => normalizedValue === ignoredValue.trim().toLowerCase());
};

export const filterFilledStrings = (values: string[]) => values.filter((value) => hasValue(value)).map((value) => value.trim());

export const buildDisplayName = (...values: Array<string | null | undefined>) =>
  values
    .filter((value): value is string => hasValue(value))
    .map((value) => value.trim())
    .join(" ");
