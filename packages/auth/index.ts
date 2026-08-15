import { getSessionUser } from "./clerk";

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  isAdmin?: boolean;
}

declare global {
  interface CustomJwtSessionClaims {
    user?: User & {
      id: string;
      isAdmin: boolean;
    }
  }
}

export const authOptions = {
  pages: {
    signIn: "/login-clerk",
  },
}

export async function getCurrentUser() {
  return await getSessionUser();
}
