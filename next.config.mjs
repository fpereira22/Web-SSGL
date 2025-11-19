/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 🟢 AGREGAMOS LA FUNCIÓN DE REDIRECCIÓN
  async redirects() {
    return [
      {
        // La URL antigua o la que quieres redirigir
        source: '/servicios',
        // La nueva URL de destino (página de inicio)
        destination: '/', 
        // Usamos 'permanent: true' para enviar un código de estado 308 
        // a los navegadores y buscadores, indicando un movimiento permanente.
        permanent: true,
      },
    ];
  },
}

export default nextConfig