  const ALLOWED_REDIRECTS = [
    '/', '/dashboard', '/profile', '/survey',
    '/survey/:slug', '/admin'
  ];

export function safeRedirect(
  url: string | null | undefined,
  fallback: string = '/'
): string {

  if (!url || typeof url !== 'string') {
    return fallback;
  }

  if (!url.startsWith('/')) {
    console.warn('🔒 Tentative de redirection externe bloquée:', url);
    return fallback;
  }

  const [path, queryString] = url.split('?');
  const cleanPath = path.split('#')[0];

  if (ALLOWED_REDIRECTS.includes(cleanPath)) {
    return queryString ? `${cleanPath}?${queryString}` : cleanPath;
  }

  const isAllowed = ALLOWED_REDIRECTS.some(route => {
    if (route.includes(':')) {
      const pattern = route.replace(/:([^/]+)/g, '([^/]+)').replace(/\//g, '\\/');
      return new RegExp(`^${pattern}$`).test(cleanPath);
    }
    return cleanPath.startsWith(route + '/') && route !== '/';
  });

  if (isAllowed) {
    return queryString ? `${url}` : cleanPath;
  }

  // 7. Route non autorisée
  console.warn('🔒 Route non autorisée:', cleanPath);
  return fallback;
}

export function generateSecureRedirect(
  targetPath: string,
  loginPath: string = '/login'
): string {
  const safePath = safeRedirect(targetPath);
  const encodedPath = encodeURIComponent(safePath);
  return `${loginPath}?redirect=${encodedPath}`;
}

export function isRedirectSafe(url: string): boolean {
  const result = safeRedirect(url);
  return result !== '/dashboard' || url === '/dashboard';
}
