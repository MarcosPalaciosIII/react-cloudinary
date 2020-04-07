const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");
const uploadCloud = require("../../config/cloudinary-setup");

// Product Image Upload
router.patch(
    "/product/image/:productId",
    uploadCloud.single("image"),
    (req, res, next) => {
        Product.findByIdAndUpdate(
            req.params.productId,
            { image: req.file.url },
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
                    productFromDB.imageArray.push(file.url);
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
