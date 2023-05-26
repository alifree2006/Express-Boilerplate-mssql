import removePathVersion from "./removePathVersion";

const alwaysAllowedPath = async (requestPath: string): Promise<boolean> => {
  requestPath = removePathVersion(requestPath);
  const allowPass: string[] = [
    "/auth",
    "/auth/refresh",
    "/auth/profile",
    "/file/upload",
  ];
  for (let i = 0; i < allowPass.length; i++) {
    const path = allowPass[i];
    if (path === requestPath || path === requestPath) {
      return true;
    }
  }
  return false;
};

export default alwaysAllowedPath;
