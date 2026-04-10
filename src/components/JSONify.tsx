const jsonReplacer = (_key: any, value: any) => {
  if (value instanceof Map) {
    return Object.fromEntries(value);
  }

  if (
    typeof value === "string" &&
    value.length > 100 &&
    value.startsWith("data:")
  ) {
    return "[DATA_URL_PLACEHOLDER]";
  }

  return value;
};

export const jsonToString = (value: any) => {
  return JSON.stringify(value, jsonReplacer, 2);
};

export const JSONify = ({
  className,
  value,
}: {
  className?: string;
  value: any;
}) => {
  return <pre className={className}>{jsonToString(value)}</pre>;
};
