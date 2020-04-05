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

module.exports = router;
