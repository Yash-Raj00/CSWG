import { Inter } from "next/font/google";
import "./globals.css";
import { EnvContextProvider } from "@/context/envContext";
import HandleEnv from "@/utils/handleEnv";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Streaming Manager",
  description: "Manage the manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <EnvContextProvider>
        <body className={inter.className}>{children}</body>
        <HandleEnv/>
      </EnvContextProvider>
    </html>
  );
}
