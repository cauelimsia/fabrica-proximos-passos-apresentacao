import type { Metadata } from 'next';
import { Fredoka, Nunito } from 'next/font/google';
import './globals.css';

// letras arredondadas, na família do nome desenhado na logo da escola
const nunito = Nunito({ subsets: ['latin'], variable: '--font-sans', weight: ['400', '500', '600', '700', '800'] });
const fredoka = Fredoka({ subsets: ['latin'], variable: '--font-display', weight: ['500', '600', '700'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://cauelimsia.github.io'),
  title: 'Próximos passos · Fábrica de Matrículas no Recanto Interativo',
  description: 'As seis etapas, em quatro semanas, para a Fábrica de Matrículas entrar no ar no Recanto Interativo.',
  // Link enviado direto para a escola: não precisa aparecer em busca.
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Próximos passos · Fábrica de Matrículas no Recanto Interativo',
    description: 'Seis etapas, quatro semanas. Role a página ou aperte espaço para assistir.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} ${fredoka.variable}`}>
      <body>{children}</body>
    </html>
  );
}
