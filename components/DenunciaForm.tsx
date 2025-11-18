// components/DenunciaForm.tsx
"use client"

import { useState, useCallback, useMemo } from 'react'
import { Check, AlertTriangle, ArrowLeft, ArrowRight } from 'lucide-react'

// Función de validación de RUT chileno (se mantiene igual)
const validateRut = (rut: string): boolean => {
    if (!rut) return false
    const cleanRut = rut.replace(/[^0-9kK]/g, "").toUpperCase()
    if (cleanRut.length < 8) return false
    const rutRegex = /^(\d{1,2})?(\d{3})?(\d{3})?([kK\d]{1})$/
    return rutRegex.test(cleanRut)
}

// Opciones para el desplegable de Tipo de Denuncia (se mantiene igual)
const denunciaOptions = [
    { value: '', label: 'Seleccione un tipo de denuncia' },
    { value: 'acoso_laboral', label: 'Acoso Laboral' },
    { value: 'acoso_sexual', label: 'Acoso Sexual o Violencia en el Trabajo' },
    { value: 'fraude', label: 'Fraude, Corrupción o Conflicto de Interés' },
    { value: 'medioambiente', label: 'Incumplimiento Medioambiental' },
    { value: 'seguridad', label: 'Incumplimiento de Seguridad y Salud Ocupacional (SSO)' },
    { value: 'otro', label: 'Otro tipo de falta o delito' },
]

// Reiniciar el estado para los campos clave
const initialFormData = {
    nombre: '',
    rut: '',
    email: '',
    telefono: '',
    anonimo: false,
    tipoDenuncia: '',
    denunciaDetalle: '',
    fechaIncidente: '',
    ubicacion: '',
}


export default function DenunciaForm() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState(initialFormData)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked
            setFormData(prev => ({ 
                ...prev, 
                [name]: checked,
                ...(name === 'anonimo' && checked ? { nombre: '', rut: '', email: '', telefono: '' } : {})
            }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const nextStep = useCallback(() => setStep(prev => prev + 1), [])
    const prevStep = useCallback(() => setStep(prev => prev - 1), [])

    const isRutValid = useMemo(() => validateRut(formData.rut), [formData.rut])
    const isContactValid = useMemo(() => {
        const hasName = formData.nombre.trim().length > 0
        const hasValidRut = isRutValid
        const hasEmail = formData.email.trim().length > 0
        const hasPhone = formData.telefono.trim().length > 0
        return (hasName && hasValidRut) || (hasEmail && hasPhone)
    }, [formData, isRutValid])

    // Lógica de validación del Paso 1 (Privacidad)
    const isStep1Valid = useMemo(() => {
        return formData.anonimo || isContactValid
    }, [formData.anonimo, isContactValid])
    
    // Lógica de validación del Paso 2 (Tipo de Denuncia)
    const isStep2Valid = useMemo(() => {
        return formData.tipoDenuncia !== ''
    }, [formData.tipoDenuncia])

    // 🔴 FUNCIÓN DE ENVÍO ACTUALIZADA
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (step !== 3) return
        
        // Simular un estado de carga mientras se procesa la solicitud
        alert('Enviando denuncia, por favor espere...'); 
        
        try {
            // Usar la ruta relativa. Azure Static Web Apps la enrutará automáticamente a la Function.
            const apiEndpoint = "/api/SubmitDenuncia";
            
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // El formData incluye todos los campos, fecha, ubicación, etc.
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                // Si la respuesta no es 200 OK
                throw new Error(`Error en el servidor: ${response.statusText}`);
            }

            const result = await response.json(); 
            
            console.log("Respuesta de la API:", result);
            alert(`✅ Denuncia registrada con éxito. Su código de seguimiento es: ${result.trackingId}`);
            
            // Limpiar formulario y volver al inicio tras el envío
            setStep(1);
            setFormData(initialFormData); 

        } catch (error: any) {
            console.error("Error al enviar la denuncia:", error);
            alert(`❌ Fallo el envío de la denuncia: ${error.message}. Por favor, verifique su conexión o inténtelo más tarde.`);
        }
    }

    const renderStep = () => {
        // ... (el código de renderStep se mantiene igual, ya que solo cambia handleSubmit)
        switch (step) {
            case 1:
                return (
                    // ... [código del Paso 1]
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Privacidad</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Por favor, ingrese al menos dos datos de contacto válidos o marque el casillero anónimo.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</span>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    disabled={formData.anonimo}
                                    className={`mt-1 block w-full rounded-md border-border bg-background shadow-sm p-3 ${formData.anonimo ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rut / DNI</span>
                                <input
                                    type="text"
                                    name="rut"
                                    value={formData.rut}
                                    onChange={handleChange}
                                    disabled={formData.anonimo}
                                    placeholder="Ej: 12.345.678-9"
                                    className={`mt-1 block w-full rounded-md border-border bg-background shadow-sm p-3 ${formData.anonimo ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                />
                                {!formData.anonimo && formData.rut && !isRutValid && (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={12} /> Rut no válido o incompleto.</p>
                                )}
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={formData.anonimo}
                                    className={`mt-1 block w-full rounded-md border-border bg-background shadow-sm p-3 ${formData.anonimo ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</span>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    disabled={formData.anonimo}
                                    className={`mt-1 block w-full rounded-md border-border bg-background shadow-sm p-3 ${formData.anonimo ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                />
                            </label>
                        </div>
                        
                        <label className="flex items-center space-x-2 pt-4">
                            <input
                                type="checkbox"
                                name="anonimo"
                                checked={formData.anonimo}
                                onChange={handleChange}
                                className="h-4 w-4 text-primary rounded border-border focus:ring-primary"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Deseo que esta denuncia sea anónima (no dejaré datos de contacto)</span>
                        </label>
                        
                        <div className="p-4 bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 rounded-md text-sm text-yellow-700 dark:text-yellow-300">
                            <p className="font-semibold flex items-center gap-2"><AlertTriangle size={16} /> Importante</p>
                            <p className="mt-1">Para dar curso a una denuncia de acoso laboral, acoso sexual y violencia en el trabajo, es necesario poder contar con sus datos. Sin esa información no podemos realizar la investigación para solucionar el problema. Recuerde que ud. tiene garantía de indemnidad, la cual consiste en que no puede ser sujeto de represalias por efectuar una denuncia o ser testigo en un proceso de investigación.</p>
                        </div>
                    </div>
                )

            case 2:
                // ... (Paso 2 sin cambios relevantes)
                return (
                    // ... [código del Paso 2]
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Tipo de Denuncia</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Seleccione la categoría que mejor describa su denuncia.
                        </p>

                        <label className="block">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Falta a Reportar</span>
                            <select
                                name="tipoDenuncia"
                                value={formData.tipoDenuncia}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-border bg-background shadow-sm p-3"
                            >
                                {denunciaOptions.map(option => (
                                    <option key={option.value} value={option.value} disabled={option.value === ''}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        {formData.tipoDenuncia && formData.tipoDenuncia !== '' && (
                            <div className="p-4 bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 rounded-md text-sm text-blue-700 dark:text-blue-300">
                                <p>Ha seleccionado: **{denunciaOptions.find(o => o.value === formData.tipoDenuncia)?.label}**.</p>
                                <p className="mt-1">El siguiente paso le pedirá los detalles, incluyendo fechas y lugares.</p>
                            </div>
                        )}
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Detalle de la Denuncia</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Proporcione toda la información relevante para que podamos investigar el caso.
                        </p>

                        <div className="grid grid-cols-1 gap-6">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción Detallada de la Denuncia <span className="text-red-500">*</span></span>
                                <textarea
                                    name="denunciaDetalle"
                                    value={formData.denunciaDetalle}
                                    onChange={handleChange}
                                    rows={5}
                                    required
                                    className="mt-1 block w-full rounded-md border-border bg-background shadow-sm p-3"
                                    placeholder="Describa los hechos, incluyendo fechas, lugares, personas involucradas y testigos."
                                ></textarea>
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha del Incidente (Aproximada)</span>
                                    <input
                                        type="date"
                                        name="fechaIncidente" // 🟢 Nombre de la clave en formData
                                        value={formData.fechaIncidente} // 🟢 Mostrar el valor del estado
                                        onChange={handleChange} // 🟢 Actualizar el estado al cambiar
                                        className="mt-1 block w-full rounded-md border-border bg-background shadow-sm p-3"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ubicación del Incidente</span>
                                    <input
                                        type="text"
                                        name="ubicacion" // 🟢 Nombre de la clave en formData
                                        value={formData.ubicacion} // 🟢 Mostrar el valor del estado
                                        onChange={handleChange} // 🟢 Actualizar el estado al cambiar
                                        className="mt-1 block w-full rounded-md border-border bg-background shadow-sm p-3"
                                        placeholder="Sucursal, Autopista, Km, etc."
                                    />
                                </label>
                            </div>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Archivos Adjuntos (Evidencia)</span>
                                <input
                                    type="file"
                                    name="archivos"
                                    multiple
                                    // Los inputs de tipo 'file' se manejan de manera diferente y no necesitan 'value' ni 'onChange'
                                    // en este contexto, ya que el archivo se sube por separado o al enviar el formulario.
                                    className="mt-1 block w-full text-sm text-gray-500
                                               file:mr-4 file:py-2 file:px-4
                                               file:rounded-full file:border-0
                                               file:text-sm file:font-semibold
                                               file:bg-primary file:text-primary-foreground
                                               hover:file:bg-primary/90"
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Formatos permitidos: PDF, JPG, PNG. Máx. 10MB.</p>
                            </label>
                            
                            <div className="p-4 bg-green-100 dark:bg-green-900 border-l-4 border-green-500 rounded-md text-sm text-green-700 dark:text-green-300">
                                <p className="font-semibold flex items-center gap-2"><Check size={16} /> Listo para Enviar</p>
                                <p className="mt-1">Al hacer clic en "Enviar Denuncia", su reporte será registrado. Le recomendamos guardar esta página o tomar una captura de pantalla.</p>
                            </div>
                        </div>
                    </div>
                )
            
            default:
                return <div>Error de Paso</div>
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* ... (Resto del formulario y botones se mantienen igual) ... */}
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-extrabold uppercase text-gray-800 dark:text-white">
                    Centro de Denuncias
                </h1>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Paso {step} de 3
                </div>
            </div>

            {/* Indicador de Progreso */}
            <div className="flex justify-between mb-8">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex-1 text-center relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors duration-300 
                                         ${s <= step ? 'bg-primary text-primary-foreground' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                            {s < step ? <Check size={16} /> : s}
                        </div>
                        <p className={`text-xs ${s <= step ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                            {s === 1 ? 'Privacidad' : s === 2 ? 'Tipo' : 'Detalle'}
                        </p>
                    </div>
                ))}
            </div>

            {/* Contenedor del Formulario (con estilo de tarjeta) */}
            <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-xl p-6 sm:p-8 border border-border">
                {renderStep()}
                
                {/* Controles de Navegación */}
                <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-border">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={step === 1}
                        className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold transition-colors duration-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
                    >
                        <ArrowLeft size={16} /> Anterior
                    </button>

                    {step < 3 && (
                        <button
                            type="button"
                            onClick={nextStep}
                            disabled={!isStep1Valid && step === 1 || !isStep2Valid && step === 2}
                            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-full font-semibold transition-colors duration-200 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Siguiente <ArrowRight size={16} />
                        </button>
                    )}

                    {step === 3 && (
                        <button
                            type="submit"
                            disabled={formData.denunciaDetalle.length < 10} // Requiere al menos 10 caracteres
                            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-full font-semibold transition-colors duration-200 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Check size={16} /> Enviar Denuncia
                        </button>
                    )}
                </div>
            </div>
        </form>
    )
}