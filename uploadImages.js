const cloudinary = require('cloudinary').v2;

let imgUpload = (path) =>{
    return new Promise(async(resolve, reject) => {
        try {
            let result = await cloudinary.uploader.upload(path);
            console.log(result);
            return resolve(result.secure_url);
        } catch (error) {
            return reject(error);
        }
    });
}

module.exports = imgUpload;