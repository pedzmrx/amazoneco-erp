import './globals.css';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Amazon Eco - PIM Monitor',
  description: 'Gerenciamento de Manifestos MTR',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#07080d] antialiased text-zinc-100">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}