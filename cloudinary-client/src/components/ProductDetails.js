import React, { Component } from "react";
import axios from "axios";

class ProductDetails extends Component {
    state = {
        title: this.props.location.state.data.title,
        price: this.props.location.state.data.price,
        inStock: this.props.location.state.data.inStock,
        description: this.props.location.state.data.description,
        image: this.props.location.state.data.image,
        productId: this.props.location.state.data._id,
        imageArray: this.props.location.state.data.imageArray,
    };

    handleSubmit = (event) => {
        event.preventDefault();

        axios
            .put(
                `http://localhost:3001/api/product/${this.state.productId}`,
                this.state,
                { withCredentials: true }
            )
            .then((updatedProduct) => {
                const updatedProductInfo = updatedProduct.data;
                this.props.getData();

                this.setState({ updatedProductInfo });
            })
            .catch((err) => console.log({ err }));
    };

    handleChange = (event) => {
        const { name, value } = event.target;

        this.setState({ [name]: value });
    };

    handleCheckboxChange = (event) => {
        const { name, checked } = event.target;

        this.setState({ [name]: checked });
    };

    handleImageChange = (event) => {
        const file = event.target.files[0];

        const uploadData = new FormData();

        uploadData.append("image", file);

        axios
            .patch(
                `http://localhost:3001/api/product/image/${this.props.location.state.data._id}`,
                uploadData,
                { withCredentials: true }
            )
            .then((updatedImage) => {
                this.props.getData();

                this.fileInput.value = "";

                this.setState({ image: updatedImage.data.image });
            })
            .catch((err) => console.log({ err }));
    };

    handleMultiImageChange = (event) => {
        console.log({ files: event.target.files });
        const files = event.target.files;

        const uploadData = new FormData();

        for (let i = 0; i < files.length; i++) {
            uploadData.append("imageArray", files[i]);
        }

        axios
            .patch(
                `http://localhost:3001/api/product/imageArray/${this.props.location.state.data._id}`,
                uploadData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            )
            .then((updatedImages) => {
                this.props.getData();

                this.multiFileInput.value = "";

                this.setState({ imageArray: updatedImages.data.imageArray });
            })
            .catch((err) => console.log({ err }));
    };

    render() {
        return (
            <form
                onSubmit={(event) => this.handleSubmit(event)}
                className="form form__display"
            >
                <img
                    src={this.state.image}
                    style={{ width: "500px", height: "300px" }}
                    alt="Product Image"
                />

                <label>
                    Choose image to change current:{" "}
                    <input
                        id="imageInput"
                        type="file"
                        name="image"
                        onChange={(event) => this.handleImageChange(event)}
                        ref={(ref) => (this.fileInput = ref)}
                    />
                </label>

                <hr />

                <div>
                    {this.state.imageArray.map((image, index) => {
                        return (
                            <img
                                src={image}
                                style={{
                                    width: "200px",
                                    height: "150px",
                                    margin: "5px",
                                }}
                                key={index}
                                atl="image{index}"
                            />
                        );
                    })}
                </div>

                <label>
                    Add Images to add to product collection:{" "}
                    <input
                        id="imageInput"
                        type="file"
                        name="images"
                        multiple
                        onChange={(event) => this.handleMultiImageChange(event)}
                        ref={(ref) => (this.multiFileInput = ref)}
                    />
                </label>

                <div className="form__display-inputs">
                    <label>
                        <h4 className="form__display-inputs--input-0">
                            Title:
                            <input
                                type="text"
                                onChange={(event) => this.handleChange(event)}
                                name="title"
                                value={this.state.title}
                            />
                        </h4>
                    </label>
                    <label>
                        <h4 className="form__display-inputs--input-1">
                            Price:
                            <input
                                type="number"
                                onChange={(event) => this.handleChange(event)}
                                name="price"
                                value={this.state.price}
                            />
                        </h4>
                    </label>
                    <label>
                        <h4 className="form__display-inputs--input-2">
                            Description:
                            <input
                                type="text"
                                onChange={(event) => this.handleChange(event)}
                                name="description"
                                value={this.state.description}
                            />
                        </h4>
                    </label>
                    <label>
                        <h4 className="form__display-inputs--input-3">
                            In Stock: {this.state.inStock ? "Yes" : "No"}
                            <input
                                type="checkbox"
                                onChange={(event) =>
                                    this.handleCheckboxChange(event)
                                }
                                name="inStock"
                                checked={this.state.inStock}
                            />
                        </h4>
                    </label>
                </div>

                <button>Update</button>
            </form>
        );
    }
}

export default ProductDetails;
