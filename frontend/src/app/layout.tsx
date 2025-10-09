import { Geist, Geist_Mono } from "next/font/google";
import "./(main)/globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/context/UserContext";
import { EventContextProvider } from '@/context/EventContext'

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Eventify",
  description: "This is an Event Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
              <EventContextProvider>
                {children}
              </EventContextProvider>
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
  );
}