import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    url: process.env.CLOUDINARY_URL,
});

export interface UploadResult {
    url: string;
    publicId: string;
}

export async function uploadImage(
    file: Buffer,
    folder: string = "movie-posters"
): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
                transformation: [
                    { width: 800, height: 1200, crop: "limit" },
                    { quality: "auto" },
                    { fetch_format: "auto" },
                ],
            },
            (error, result) => {
                if (error) reject(error);
                else if (result) {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                } else {
                    reject(new Error("Upload failed"));
                }
            }
        ).end(file);
    });
}

export async function deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
}

export { cloudinary };

