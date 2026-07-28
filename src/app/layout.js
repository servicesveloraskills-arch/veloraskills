import "./globals.css";

export const metadata = {
  title: "VeloraSkills | Global Virtual Internship Programs",
  description:
    "Apply for project-based virtual internships, track tasks, and verify certificates with VeloraSkills.",
  icons: {
    icon: "/logo1.png",
    shortcut: "/logo1.png",
    apple: "/logo1.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
