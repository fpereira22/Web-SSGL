// api/SubmitDenuncia/index.js
const { BlobServiceClient } = require("@azure/storage-blob");

// NOTA: Esta variable de entorno DEBE configurarse en la Function App/SWA en Azure.
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING_SSGL; 
const containerName = "denuncias"; 

module.exports = async function (context, req) {
    context.log('HTTP trigger function processed a request for Denuncia.');

    if (req.method !== "POST" || !req.body) {
        context.res = { status: 400, body: { error: "Por favor, envíe una solicitud POST válida con un cuerpo JSON." } };
        return;
    }

    try {
        const formData = req.body;

        // 1. Generar ID único y nombre de archivo
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const trackingId = Math.random().toString(36).substring(2, 11).toUpperCase(); 
        const fileName = `${formData.tipoDenuncia || 'general'}-${timestamp}-${trackingId}.json`;

        // 2. Conectar al Blob Service
        if (!connectionString) {
             throw new Error("La cadena de conexión AZURE_STORAGE_CONNECTION_STRING_SSGL no está configurada.");
        }
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // 3. Crear el cliente del Blob y subir los datos
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);

        const dataToSave = {
            ...formData,
            trackingId: trackingId,
            receivedAt: timestamp
        };

        await blockBlobClient.upload(JSON.stringify(dataToSave, null, 2), Buffer.byteLength(JSON.stringify(dataToSave, null, 2)));

        context.log(`Archivo subido exitosamente: ${fileName}`);

        // 4. Devolver éxito al cliente (el frontend)
        context.res = {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: { 
                message: "Denuncia registrada con éxito.",
                trackingId: trackingId,
                fileName: fileName
            }
        };

    } catch (error) {
        context.log.error("Error al procesar la denuncia:", error);
        context.res = {
            status: 500,
            body: { error: "Error interno del servidor al guardar la denuncia.", detail: error.message }
        };
    }
};