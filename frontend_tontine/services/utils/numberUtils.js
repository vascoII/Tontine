export const toBigIntSafe = (value) => {
  if (typeof value === "bigint") {
    return value;
  }
  if (typeof value === "string") {
    return BigInt(value);
  }
  if (typeof value === "number") {
    return BigInt(value);
  }
  throw new Error("Unsupported type for conversion to BigInt");
};
