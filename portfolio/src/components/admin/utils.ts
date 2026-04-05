export const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

export const joinLines = (values: string[]) => values.join("\n");

export const parseLines = (value: string) => value.split(/\r?\n/);

export const updateArrayItem = <T,>(items: T[], index: number, updater: (item: T) => T) =>
  items.map((item, itemIndex) => (itemIndex === index ? updater(item) : item));

export const removeArrayItem = <T,>(items: T[], index: number) =>
  items.filter((_, itemIndex) => itemIndex !== index);
