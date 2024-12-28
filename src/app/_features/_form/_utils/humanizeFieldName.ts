const humanizeFieldName = (field: string | number): string => {
  const str = field.toString();

  return str
    .split(/(?=[A-Z])/)
    .join(" ")
    .replace(/^./, (item) => item.toUpperCase());
};

export { humanizeFieldName };
