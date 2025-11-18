// components/hero.tsx
"use client"
import Image from "next/image"
// 1. QUITA 'useTransform' y 'MotionValue'
import { motion } from "framer-motion" 
// 2. QUITA 'useState' y 'useEffect'
import Header from "./header"

// 3. QUITA 'scrollY' de las props
export default function Hero() { 
	
	// 4. ELIMINAMOS TODA LA LÓGICA DE CÁLCULO DE 'y'
	// y la dependencia de 'scrollY'
	
	// 5. La propiedad 'y' ya no se usa, por lo que la motion.div solo contendrá el div interno
	// y la propiedad 'style' se puede eliminar.

	return (
		<div className="h-screen overflow-hidden">
			<Header />
			{/* 🔴 CAMBIO CLAVE: Se eliminó <motion.div style={{ y }}...>. 
				Ahora es solo un div con 'relative h-full'. 
				Esto elimina el efecto de paralaje en el fondo. */}
			<div className="relative h-full"> 
				<Image
					src="/images/hero2.webp"
					fill
					alt="Freeway background"
					style={{ objectFit: "cover" }}
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>

				<div className="absolute inset-0 flex items-center justify-start z-10">
					<div className="text-left max-w-3xl px-6">
						
						{/* 🟢 CAMBIO CLAVE: Clase personalizada para el borde del texto */}
						<h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white custom-text-stroke">
							Sociedad de Servicios Generales LTDA
						</h1>
						
						{/* Párrafo: Quitar borde y usar texto blanco simple */}
						<p className="text-sm md:text-base leading-relaxed mb-8 text-white"> 
							Líderes en servicios viales a escala nacional conectando al país!
							Somos especialistas en mantención vial y asistencia al usuario en las autopistas más importantes de Chile. Nuestra misión es garantizar la fluidez y seguridad de las rutas, asegurando la excelencia en la conservación de cada concesión y la total satisfacción de nuestros clientes
						</p>
						
					</div>
				</div>
			</div>
		</div>
	)
}