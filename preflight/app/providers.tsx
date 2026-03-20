"use client";

import { SessionProvider } from "next-auth/react";
import ChatBox from "@/components/shared/ChatBox";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <ChatBox />
    </SessionProvider>
  );
}
