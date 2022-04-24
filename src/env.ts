// getEnv returns the process environment
export function getEnv(): Record<string, string> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return import.meta.env;
}
