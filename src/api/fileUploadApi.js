import axiosClient from "./axiosClient";

const fileUploadApi = {
  uploadFiles: ({ files, fileType = "DOCUMENT", folderName = "btm-learning" }) => {
    const formData = new FormData();
    formData.append("fileType", fileType);
    formData.append("folderName", folderName);

    files.forEach((file) => {
      formData.append("files", file);
    });

    return axiosClient.post("/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default fileUploadApi;
