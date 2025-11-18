// app/api/submit-denuncia/route.js

import { BlobServiceClient } from "@azure/storage-blob";

// La cadena de conexión se lee automáticamente de las Variables de Entorno
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING_SSGL; 
const containerName = "denuncias"; 

/**
 * Genera un código de seguimiento alfanumérico único.
 */
const generateTrackingId = () => {
    return Math.random().toString(36).substring(2, 11).toUpperCase(); 
};


/**
 * Maneja la solicitud POST para registrar una nueva denuncia con adjuntos.
 *
 * @param {Request} request El objeto Request de Next.js que contiene el cuerpo multipart/form-data.
 * @returns {Response} Un objeto Response de Next.js con el resultado de la operación.
 */
export async function POST(request) {
    
    // 1. Verificar la conexión a Azure
    if (!connectionString) {
         return Response.json(
             { error: "Error de configuración: La cadena de conexión a Azure Storage no está configurada." }, 
             { status: 500 }
         );
    }

    // 2. Generar Tracking ID (debe ser el primero para usarlo como prefijo)
    const trackingId = generateTrackingId();

    let formDataJson = null; 
    const uploadedFilesMetadata = []; // Lista para guardar la metadata de los archivos subidos

    try {
        // 3. Obtener los datos del cuerpo de la solicitud (multipart/form-data)
        const data = await request.formData(); 
        
        // A. Parsear el JSON de datos de texto enviado por el frontend bajo la clave 'data'
        const dataJsonString = data.get('data');
        if (!dataJsonString) {
             throw new Error("El cuerpo de la denuncia (JSON) está vacío.");
        }
        formDataJson = JSON.parse(dataJsonString);

        // Definir el tipo de denuncia para el prefijo de la carpeta principal
        const denunciaType = formDataJson.tipoDenuncia || 'general';
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // 4. Conectar a Azure Blob Service
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // 5. Definir el prefijo de la "carpeta" (TipoDenuncia/TrackingId/)
        const folderPrefix = `${denunciaType}/${trackingId}/`;
        
        // B. Subir Archivos Adjuntos
        // Usamos data.getAll para obtener todos los archivos bajo la clave 'archivos'
        const files = data.getAll('archivos'); 
        
        for (const file of files) {
             // El objeto File extraído de FormData debe ser comprobado
             if (file && typeof file === 'object' && 'size' in file && file.size > 0) { 
                
                // 🚨 MEJORA CRUCIAL: Convertir el objeto File a ArrayBuffer
                // Esto resuelve el error de 'undefined' al pasar el dato a Azure Blob SDK.
                const arrayBuffer = await file.arrayBuffer(); 
                
                const extension = file.name.split('.').pop();
                const safeFileName = `adjunto-${uploadedFilesMetadata.length + 1}.${extension}`;
                const blobName = folderPrefix + safeFileName;
                
                const blockBlobClient = containerClient.getBlockBlobClient(blobName);
                
                // Subir el archivo binario usando el ArrayBuffer
                await blockBlobClient.uploadData(arrayBuffer); 
                
                uploadedFilesMetadata.push({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    blobPath: blobName, // Ruta completa en Azure
                });
            }
        }

        // C. Subir el Archivo JSON (Metadatos)
        
        // 6. Preparar el JSON final con metadata y lista de archivos
        const dataToSave = {
            ...formDataJson,
            trackingId: trackingId,
            receivedAt: timestamp,
            attachments: uploadedFilesMetadata, // Incluir la lista de archivos subidos
        };

        const jsonBlobName = folderPrefix + 'metadata.json';
        const jsonContent = JSON.stringify(dataToSave, null, 2);
        
        const jsonBlockBlobClient = containerClient.getBlockBlobClient(jsonBlobName);
        
        // Subir el JSON (usamos Buffer.byteLength para asegurar la longitud)
        await jsonBlockBlobClient.upload(jsonContent, Buffer.byteLength(jsonContent));


        // 7. Devolver éxito al cliente (el frontend DenunciaForm.tsx)
        return Response.json(
            { 
                message: "Denuncia registrada con éxito.",
                trackingId: trackingId,
                jsonPath: jsonBlobName
            }, 
            { status: 200 }
        );

    } catch (error) {
        console.error("Error al procesar la denuncia:", error); 
        
        // 8. Devolver el error al frontend
        return Response.json(
            { 
                error: "Error interno del servidor al guardar la denuncia.", 
                detail: error.message 
            }, 
            { status: 500 }
        );
    }
}

// Opcional: Bloquear otros métodos HTTP
export async function GET() {
    return Response.json({ error: "Método GET no permitido para esta ruta. Use POST." }, { status: 405 });
}