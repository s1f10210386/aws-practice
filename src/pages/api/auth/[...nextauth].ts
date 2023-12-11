import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

export default NextAuth({
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET,
      issuer: process.env.COGNITO_ISSUER,
    }),
  ],

  callbacks: {
    //これでsessionにuserIdも追加できる
    async session({ session, token }) {
      if (token) {
        session.userId = token.sub; // ここでCognitoのsubをセッションに追加
      }
      return session;
    },
  },
});
