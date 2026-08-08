export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SETTINGS: "/settings",
};

export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
];

export const PROTECTED_ROUTES = [ROUTES.DASHBOARD, ROUTES.PROFILE, ROUTES.SETTINGS];
