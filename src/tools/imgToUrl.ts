import request from 'umi-request';

export function ImgToUrl (fileData: File | Blob, fileType?: 'file' | 'blob') {
    const formData = new FormData()
    const isFile = fileType === 'file' || fileType === void 0
    formData.append(
        'filename',
        new File([fileData], isFile ? (fileData as File)?.name :  'blob.png',
            { type: isFile ? (fileData.type ?? 'image/png') : 'image/png' })
    )
    return request
        .post('/api/bouadmin/main/auth/fileupload', { data: formData})
    .then(function (response) {
        if (response.code === 200 || response.code === 0) {
            return response.result.path
        } else {
            throw new Error('File upload failed,' + response.data.msg)
        }
    })
}