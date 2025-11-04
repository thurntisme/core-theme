export const isLoggedIn = () => {
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find((cookie) =>
    cookie.trim().startsWith('auth-session=')
  );

  return authCookie && authCookie.includes('authenticated');
};
