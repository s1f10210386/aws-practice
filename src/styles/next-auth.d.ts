import "next-auth";

declare module "next-auth" {
  /**
   * セッションオブジェクトの型拡張
   */
  interface Session {
    userId?: string; // カスタムプロパティ
  }

  /**
   * ユーザーオブジェクトの型拡張
   */
  interface User {
    sub?: string; // Cognitoの一意のユーザーID
  }
}
