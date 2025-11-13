// components/featured.tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function Featured() {
    
    // Estado principal: controla si el mapa ha sido activado por el usuario (clic inicial)
    const [mapActive, setMapActive] = useState(false) 
    
    // Estado: controla si el bloqueo del scroll está ACTIVO (toggle de Ctrl/Cmd)
    const [scrollLockActive, setScrollLockActive] = useState(false) 

    // LÓGICA PARA ESCUCHAR LA TECLA CTRL/CMD (Como interruptor)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Verificamos si es Ctrl (Windows/Linux) o Meta (Cmd en Mac)
            if (e.key === "Control" || e.metaKey) {
                if (mapActive) {
                    // Interruptor (Toggle)
                    setScrollLockActive(prev => !prev) 
                }
            }
        }

        if (mapActive) {
            window.addEventListener('keydown', handleKeyDown)
        } 

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [mapActive]) 

    // La interacción es permitida SOLAMENTE si mapActive es TRUE Y scrollLockActive es FALSE
    const allowMapInteraction = mapActive && !scrollLockActive;

    // CONTENIDO DE EXPERIENCIA PROFESIONAL (completo y sin cortar)
    const experienceContent = (
        <>
            <p className="text-base md:text-lg leading-relaxed text-gray-600 mb-6">
                Contamos con una sólida trayectoria en la conservación, mantenimiento y asistencia de las principales concesiones viales del país. Nuestro compromiso con la excelencia operativa y la seguridad nos ha consolidado como un socio estratégico clave en la gestión de infraestructura. Actualmente, prestamos servicios especializados en las siguientes autopistas:
            </p>

            <ul className="list-disc list-inside space-y-4 pl-4 text-gray-800">
                <li className="font-bold text-gray-900">
                    Autopista Central
                    <ul className="list-disc list-inside ml-6 font-normal text-gray-600 mt-1">
                        <li>Conservación Global</li>
                    </ul>
                </li>
                
                <li className="font-bold text-gray-900">
                    Autopista Aconcagua
                    <ul className="list-disc list-inside ml-6 font-normal text-gray-600 mt-1">
                        <li>Conservación Global</li>
                    </ul>
                </li>
                
                <li className="font-bold text-gray-900">
                    Autopista Nororiente
                    <ul className="list-disc list-inside ml-6 font-normal text-gray-600 mt-1">
                        <li>Asistencia al Usuario</li>
                    </ul>
                </li>
                
                <li className="font-bold text-gray-900">
                    Autopista Litoral Central
                    <ul className="list-disc list-inside ml-6 font-normal text-gray-600 mt-1">
                        <li>Asistencia al Usuario</li>
                    </ul>
                </li>
                
                <li className="font-bold text-gray-900">
                    Autopista Los Libertadores
                    <ul className="list-disc list-inside ml-6 font-normal text-gray-600 mt-1">
                        <li>Operadores de Grúa</li>
                        <li>Aseo de Instalaciones</li>
                    </ul>
                </li>
                
                <li className="font-bold text-gray-900">
                    Autopista Los Andes
                    <ul className="list-disc list-inside ml-6 font-normal text-gray-600 mt-1">
                        <li>Operadores de Grúa</li>
                        <li>Aseo de Instalaciones</li>
                    </ul>
                </li>
            </ul>
        </>
    );
    
    const mapEmbedUrl = "/folium_map.html"; 

    return (
        <div className="min-h-screen px-6 py-12 lg:py-20 flex flex-col items-center bg-gray-50">
            
            {/* Título Principal de la Sección */}
            <h2 className="text-4xl md:text-6xl font-extrabold uppercase mb-12 text-gray-800">
                Experiencia
            </h2>

            {/* Contenedor Principal (Dos Columnas) */}
            {/* Se añadió lg:items-start para alinear las columnas desde arriba */}
            <div className="flex flex-col lg:flex-row max-w-7xl w-full bg-white shadow-xl rounded-xl overflow-hidden lg:items-start">
                
                {/* Columna Izquierda: Experiencia Profesional y Texto */}
                {/* Se eliminó la altura fija lg:h-[600px] para que el texto fluya completamente */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-start">
                    <h3 className="text-3xl md:text-4xl font-bold mb-6 uppercase text-gray-900">
                        Experiencia Profesional
                    </h3>
                    {experienceContent}
                </div>

                {/* Separador Vertical (en pantallas grandes) */}
                <div className="hidden lg:block border-l-2 border-white h-auto bg-white" style={{ width: '2px' }}></div>

                {/* Columna Derecha: Mapa */}
                <div className="flex-1 h-[400px] lg:h-[800px] bg-gray-200 relative"> 
                    <h3 className="text-center bg-gray-700 text-white py-2 text-lg font-semibold uppercase">
                        Cobertura y Zonas de Operación
                    </h3>
                    
                    {/* Contenedor Relativo para la Superposición */}
                    <div className="relative w-full h-full">

                        {/* Contenedor del Mapa (Iframe de Folium) */}
                        <iframe
                            src={mapEmbedUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Mapa Interactivo de Zonas de Operación"
                            className={`${allowMapInteraction ? "pointer-events-auto" : "pointer-events-none"}`}
                        ></iframe>

                        {/* SUPERPOSICIÓN INICIAL */}
                        {!mapActive && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 text-white p-4 cursor-pointer"
                                 onClick={() => setMapActive(true)} 
                            >
                                <div className="text-center">
                                    <p className="text-lg md:text-xl font-bold mb-2">
                                        Haga clic para interactuar con el mapa
                                    </p>
                                    <p className="text-sm">
                                        (Deshabilitado para evitar conflictos de scroll)
                                    </p>
                                    <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold transition-colors">
                                        Activar Mapa
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* SUPERPOSICIÓN DE BLOQUEO (Ctrl/Cmd Toggle) */}
                        {mapActive && scrollLockActive && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70 text-white p-4">
                                <p className="text-xl md:text-2xl font-bold">
                                    Scroll de la página activado
                                </p>
                                <p className="text-sm">
                                    Presione **Ctrl / Cmd** para volver a interactuar con el mapa.
                                </p>
                            </div>
                        )}

                        {/* SUPERPOSICIÓN PEQUEÑA (Instrucción) */}
                        {mapActive && !scrollLockActive && (
                             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 bg-black/70 text-white text-xs py-1 px-3 rounded-full shadow-lg">
                                 Presione **Ctrl / Cmd** para activar el scroll de la página.
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}