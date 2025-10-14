'use client'
import { SessionProvider } from "next-auth/react"
import React from "react"

// Add a type for the new session prop
interface SessionWrapperProps {
  children: React.ReactNode;
  session: any; // Consider using a more specific type based on your session object structure
}

const SessionWrapper: React.FC<SessionWrapperProps> = ({ children, session }: SessionWrapperProps) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}

export default SessionWrapper