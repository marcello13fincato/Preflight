"use client";

import ChatBox from "@/components/shared/ChatBox";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ChatBox />
    </>
  );
}
