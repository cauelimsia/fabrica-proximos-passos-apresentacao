import type { Metadata } from 'next';
import { Figtree, Gabarito } from 'next/font/google';
import './globals.css';

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans', weight: ['400', '500', '600', '700'] });
const gabarito = Gabarito({ subsets: ['latin'], variable: '--font-display', weight: ['600', '700', '800', '900'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://cauelimsia.github.io'),
  title: 'Próximos passos · Fábrica de Matrículas no Recanto da Criança',
  description: 'As seis etapas, em quatro semanas, para a Fábrica de Matrículas entrar no ar no Recanto da Criança.',
  // Link enviado direto para a escola: não precisa aparecer em busca.
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Próximos passos · Fábrica de Matrículas no Recanto da Criança',
    description: 'Seis etapas, quatro semanas. Role a página ou aperte espaço para assistir.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${figtree.variable} ${gabarito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
