interface ZodIssue {
  path: (string | number)[];
  message: string;
}

export const apiErrorMessage = (err: any, fallback: string): string => {
  const data = err?.response?.data;
  if (data?.message) return data.message;
  if (Array.isArray(data?.issues)) {
    return (data.issues as ZodIssue[])
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
  }
  if (err?.code === "ERR_NETWORK") return "Cannot reach server";
  return fallback;
};
