const cloudinary = require('cloudinary').v2;

let imgUpload = (path) =>{
    return new Promise(async(resolve, reject) => {
        try {
            return resolve(await cloudinary.uploader.upload(path));
        } catch (error) {
            return reject(error);
        }
    });
}

module.exports = imgUpload;