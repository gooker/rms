import axios from 'axios';

export async function uploadUpgradePackage(formData, onProgress) {
  return axios({
    url: 'http://localhost:5000/upload',
    method: 'POST',
    data: formData,
    onUploadProgress: onProgress,
  }).catch((err) => console.log(err));
}
