const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");
const uploadCloud = require("../../config/cloudinary-setup");

// to know what cloudinary method you are using, refer to cloudinary-setup.js to see which method you imported.

// req.file has this output when using cloudinary.v2:
// {
//     fieldname: 'imageArray',
//     originalname: 'logo.jpg',
//     encoding: '7bit',
//     mimetype: 'image/jpeg',
//     path: 'https://res.cloudinary.com/dnlzyi7bp/image/upload/v1604762727/spots/kj8jbuablsh7ecpjbpx4.jpg',
//     size: 136149,
//     filename: 'spots/kj8jbuablsh7ecpjbpx4'
// }

// req.file has this output when using original cloudinary:
// {
//     fieldname: 'image',
//     originalname: 'wormhole.jpg',
//     encoding: '7bit',
//     mimetype: 'image/jpeg',
//     asset_id: '2ffafe8435b95052caea74b67c245271',
//     public_id: 'spots/ywdeccwaulcd784xolfe',
//     version: 1604764768,
//     version_id: 'e9c1dedf7b08de775333b97a1658167f',
//     signature: '216b81c69225fecffc73fd36e3867e98d5f2c451',
//     width: 2560,
//     height: 1440,
//     format: 'jpg',
//     resource_type: 'image',
//     created_at: '2020-11-07T15:59:28Z',
//     tags: [],
//     bytes: 442220,
//     type: 'upload',
//     etag: '73d0e9ed7c6bd62e2cc243a98f9d5ad7',
//     placeholder: false,
//     url: 'http://res.cloudinary.com/tardiscloud/image/upload/v1604764768/spots/ywdeccwaulcd784xolfe.jpg',
//     secure_url: 'https://res.cloudinary.com/tardiscloud/image/upload/v1604764768/spots/ywdeccwaulcd784xolfe.jpg',
//     original_filename: 'file'
//   }

// Product Image Upload
router.patch(
    "/product/image/:productId",
    uploadCloud.single("image"),
    (req, res, next) => {
        Product.findByIdAndUpdate(
            req.params.productId,
            { image: req.file.url }, // use file.url when using regular cloudinary method to get the image url
            // { image: req.file.path },  // use file.path when using cloudinary.v2 method to get the image url
            { new: true }
        )
            .then((updatedProduct) => {
                res.status(200).json(updatedProduct);
            })
            .catch((err) => res.status(400).json(err));
    }
);

router.patch(
    "/product/imageArray/:productId",
    uploadCloud.array("imageArray"),
    (req, res, next) => {
        console.log({ theFile: req.files });
        Product.findById(req.params.productId)
            .then((productFromDB) => {
                console.log({ productFromDB });
                req.files.forEach((file) => {
                    productFromDB.imageArray.push(file.url); // use file.url when using regular cloudinary method to get the image url
                    // productFromDB.imageArray.push(file.path);  // use file.path if your using cloudinary.v2 method to get the image url
                });
                productFromDB
                    .save()
                    .then((updatedProduct) => {
                        console.log({ updatedProduct });
                        res.status(200).json(updatedProduct);
                    })
                    .catch((err) =>
                        res
                            .status(400)
                            .json({ message: "error pushing urls: ", err })
                    );
            })
            .catch((err) =>
                res
                    .status(400)
                    .json({ message: "error finding product: ", err })
            );
    }
);

module.exports = router;
