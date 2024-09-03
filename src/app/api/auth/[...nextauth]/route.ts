import axios from "axios";
import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import router from "next/router";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
          name: 'Credentials',
          credentials: {
            username: { label: 'Username', type: 'text' },
            password: { label: 'Password', type: 'password' }
          },
          async authorize(credentials, req) {
            try {
                const res = await axios.post('http://localhost:3000/auth/login', {
                  username: credentials?.username,
                  password: credentials?.password,
                }, {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
    
              if (res.status !== 201) {
                throw new Error(res.data.message || 'Invalid credentials');
              }
    
              const user = res.data;
              if (user) {
                return {
                  id: user.payload.id,
                  username: user.payload.username,
                  accessToken: user.payload.accessToken,
                  role: user.payload.role,
                };
              }
          } catch (error) {
            console.error(error);
          }
    
            return null;
          }
        })
      ],
      callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token.id = user.id;
            token.accessToken = user.accessToken;
            token.role = user.role;
          }
          return token;
        },
        async session({ session, token }) {
          if (session.user) {
            session.user.id = token.id as string;
            session.accessToken = token.accessToken as string;
            session.user.role = token.role as string;
          }
          return session;
        }
      },
      pages: {
        signIn: '/login',
      }
})

export { handler as GET, handler as POST }