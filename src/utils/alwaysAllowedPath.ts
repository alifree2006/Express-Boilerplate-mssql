import removePathVersion from "./removePathVersion";

const alwaysAllowedPath = async (requestPath: string): Promise<boolean> => {
  requestPath = removePathVersion(requestPath);
  const allowPass: string[] = [
    "/panel/auth",
    "/auth",
    "/logout",
    "/panel/auth/refresh",
    "/auth/refresh",
    "/auth/profile",
    "/panel/file/upload",
    "/auth/register",
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
