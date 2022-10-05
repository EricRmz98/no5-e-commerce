const { initializeApp } = require('firebase/app');
const {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
} = require('firebase/storage');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// models
const { ProductImg } = require('../models/productImg.model');

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

// upload the images to firebase
const uploadProductImgs = async (imgs, productId) => {
    const uploadImgsPromises = imgs.map(async (img) => {
        const pointIndex = img.originalname.lastIndexOf('.');

        const ext = img.originalname.slice(pointIndex);
        const originalName = img.originalname.slice(0, pointIndex);

        const filename = `productImgs/${productId}/${originalName}-${Date.now()}${ext}`;
        const imgRef = ref(storage, filename);

        const uploadedImg = await uploadBytes(imgRef, img.buffer);

        await ProductImg.create({
            productId,
            imgUrl: uploadedImg.metadata.fullPath,
        });
    });

    await Promise.all(uploadImgsPromises);
};

// get the images download urls
const getProductsImgsUrls = async (products) => {
    const productsWithImgsPromises = products.map(async (product) => {
        const productImgsPromises = product.productImgs.map(
            async (productImg) => {
                const imgRef = ref(storage, productImg.imgUrl);
                const imgUrl = await getDownloadURL(imgRef);

                productImg.imgUrl = imgUrl;
                return productImg;
            }
        );

        const productImgs = await Promise.all(productImgsPromises);

        product.productImgs = productImgs;
        return product;
    });

    return await Promise.all(productsWithImgsPromises);
};

module.exports = { uploadProductImgs, getProductsImgsUrls };
