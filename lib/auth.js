import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode"; // Optional: you can use parseJwt instead

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  jwt: true,
  session: {
    strategy: "jwt", // Using JWT-based session
  },
  
  callbacks: {
    // Add token.user into session
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },

    // Add user to JWT token on sign in
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },

    // Optional signIn callback
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return true; // Not used in this flow, but keep for completeness
      }
      return true;
    },
  },

  providers: [
    CredentialsProvider({
      credentials: {
        username: { type: "string" },
        email: { type: "email" },
        password: { type: "password" },
        provider: { type: "string" },
        token: { type: "string" }, // used in Google JWT login
      },
      async authorize(credentials) {
        try {
          // Google login with JWT from backend
          if (credentials?.provider === "google") {
            const token = credentials.token;

            if (!token) throw new Error("Token not provided");

            const data = jwtDecode(token); // or use your parseJwt()

            // Optional: check token expiration
            const now = Math.floor(Date.now() / 1000);
            if (data.exp < now) throw new Error("Token expired");

            return {
              userName: data?.user_name,
              token,
              userType: data?.userType,
              issuedOn: data?.nbf,
              expiresOn: data?.exp,
              id: data?.uid || data?.user_name,
              user_login_type: data?.user_login_type,
            };
          }

          // Standard login with username/password
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/Login/Login`,
            {
              username: credentials.username,
              password: credentials.password,
              email: credentials.email,
            }
          );

          if (data && data.userName) {
            return {
              ...data,
              id: data.userName,
            };
          }

          return null;
        } catch (error) {
          console.error("Login error:", error.message || error);
          return null;
        }
      },
    }),
  ],
});
