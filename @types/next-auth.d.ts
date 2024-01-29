// This changes the default session by adding on custom variables.
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      type: string;
    } & DefaultSession['user'];
  }
}
