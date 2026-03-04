export const parseZodError = (error: unknown): Record<string, unknown> => {
  if (error instanceof Error && "name" in error && error.name === "ZodError") {
    return {
      name: "ValidationError",
      messages: JSON.parse(error.message),
    };
  }

  return JSON.parse(JSON.stringify(error));
};
