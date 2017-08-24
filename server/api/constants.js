module.exports = {
    MAXIMUM_UPLOAD_FILE_SIZE: 10000000,     //IN BYTES - 10MB
    ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png'],
    UPLOAD_TO_S3: false,
    AWS_CREDENTIALS: {
        secretAccessKey: process.env.SECRET_KEY || "secret",
        accessKeyId: process.env.ACCESS_ID || "id",
        region: process.env.REGION || "region"
    },
    IMAGES_UPLOAD_BUCKET_NAME: process.env.BUCKET_NAME || "uploads"
}
