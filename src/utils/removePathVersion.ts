export default function removePathVersion(requestPath: string): string {
  return requestPath.replace(`/${process.env.API_VERSION}`, ``);
}
