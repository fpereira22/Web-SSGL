// app/denuncias/page.tsx
import Header from "@/components/header"
import Footer from "@/components/footer"
import DenunciaForm from "@/components/DenunciaForm"

export const metadata = {
  title: 'SSGL.cl - Centro de Denuncias',
  description: 'Formulario confidencial para el reporte de faltas y delitos.',
}

export default function DenunciasPage() {
  return (
    // CAMBIO: Contenedor con fondo claro para que el formulario destaque
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950"> 
      <Header />
      
      {/* Añade un padding superior para no chocar con el Header fijo/absoluto */}
      <div className="pt-24 pb-16">
        <DenunciaForm />
      </div>

      <Footer />
    </div>
  )
}