import v2 from "../config/cloudinary.config";
import { UploadApiOptions } from "cloudinary";

export const fileUpload = async (
  file: any,
  folder: string,
  height: any = undefined,
  width: any = undefined
) => {
  try {
    const option: UploadApiOptions = {
      resource_type: "auto",
      folder: folder,
    };

    if (height) {
      option.height = height;
    }

    if (width) {
      option.width = width;
    }

    // express-fileupload stores files in memory (file.data buffer) by default.
    // Cloudinary accepts a base64 data URI directly, so we convert the buffer.
    const dataUri = `data:${file.mimetype};base64,${file.data.toString("base64")}`;
    const result = await v2.uploader.upload(dataUri, option);

    return result;
  } catch (error) {
    console.log("Error occur during uploading the file to cloudinary", error);
    throw error;
  }
};

export const deleteFile = async (publicId: string) => {
  try {
    const result = await v2.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.log(
      "Error occur during deleting the file from cloudinary",
      error
    );
    throw error;
  }
};