import './globals.css';

export const metadata = {
  title: 'School SMS Broadcast',
  description: 'Send announcements to parents and students instantly',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {children}
      </body>
    </html>
  );
}