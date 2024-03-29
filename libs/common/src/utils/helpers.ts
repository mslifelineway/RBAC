export const _copy = <T extends object>(data: T): T => {
  return JSON.parse(JSON.stringify(data));
};
