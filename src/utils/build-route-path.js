export function buildRoutePath(path) {
  const routeParameterssRegex = /:([a-zA-Z]+)/g
  const pathWithParams = path.replaceAll(routeParameterssRegex, '(?<$1>[a-z0-9\-_]+)')

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)

  return pathRegex
}