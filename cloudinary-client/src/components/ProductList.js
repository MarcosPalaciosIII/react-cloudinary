import React from "react";
import "../App.css";
import axios from "axios";
import { Link } from "react-router-dom";

class ProductList extends React.Component {
    state = {
        title: "",
        price: 0,
        inStock: false,
        description: "",
        image: "",
        updated: false,
    };

    handleSubmit = (event) => {
        event.preventDefault();

        const uploadData = new FormData();

        uploadData.append("image", this.state.image);
        uploadData.append("title", this.state.title);
        uploadData.append("price", this.state.price);
        uploadData.append("inStock", this.state.inStock);
        uploadData.append("description", this.state.description);

        axios
            .post("http://localhost:3001/api/add-product", uploadData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            })
            .then((response) => {
                this.props.getData();

                this.fileInput.value = "";

                this.setState({
                    title: "",
                    price: 0,
                    inStock: false,
                    description: "",
                });
            })
            .catch((err) => console.log({ err }));
    };

    handleChange = (event) => {
        const { name, value } = event.target;

        this.setState({ [name]: value });
    };

    // this wil handle changing of true and false value for a checkbox since you have to check the event.target.checked option for true or false. If we just check the event.target.value we will get a value of "on" or "off".
    handleCheckboxChange = (event) => {
        const { name, checked } = event.target;

        this.setState({ [name]: checked });
    };

    // when the file input changes we have to check for the uploaded info from event.target.files which gives us an array. To submit the file selected you normally get the first element in the array [0]. If your doing multiple file uploads then you would just pass the entire array.
    handleImageChange = (event) => {
        const { files } = event.target;

        this.setState({ image: files[0] });
    };

    deleteItem = (productId) => {
        axios
            .delete(`http://localhost:3001/api/product/${productId}`)
            .then((response) => {
                this.props.getData();
            })
            .catch((err) => console.log({ err }));
    };

    viewProducts = () => {
        return this.state.allProducts?.length > 0 ? (
            this.state.allProducts.map((product, index) => {
                return (
                    <div
                        key={index}
                        style={{
                            borderBottom: "1px solid black",
                        }}
                    >
                        <img
                            src={product.image}
                            style={{ width: "500px", height: "300px" }}
                        />
                        <Link
                            to={{
                                pathname: "details",
                                state: {
                                    data: product,
                                },
                            }}
                        >
                            <h3>Product: {product.title}</h3>
                        </Link>
                        <h4>Price: ${product.price}</h4>
                        <h4>Description: {product.description}</h4>
                        <h4>In Stock: {product.inStock ? "Yes" : "No"}</h4>
                        <button
                            onClick={() => this.deleteItem(product._id)}
                            style={{ marginBottom: "15px" }}
                        >
                            X
                        </button>
                    </div>
                );
            })
        ) : (
            <h2>No Products to Display</h2>
        );
    };

    getProductList = () => {
        if (this.state.allProducts !== this.props.allProducts) {
            this.setState({
                allProducts: this.props.allProducts,
            });
        }
    };

    render() {
        return (
            <div className="App">
                {this.getProductList()}
                <form onSubmit={(event) => this.handleSubmit(event)}>
                    <label htmlFor="titleInput">Title</label>
                    <input
                        id="titleInput"
                        type="text"
                        name="title"
                        placeholder="Phone"
                        onChange={(event) => this.handleChange(event)}
                        value={this.state.title}
                    />

                    <label htmlFor="priceInput">Price</label>
                    <input
                        id="priceInput"
                        type="Number"
                        name="price"
                        placeholder="500"
                        onChange={(event) => this.handleChange(event)}
                        value={this.state.price}
                    />

                    <label htmlFor="inStockInput">In Stock?</label>
                    <input
                        id="inStockInput"
                        type="checkbox"
                        name="inStock"
                        onChange={(event) => this.handleCheckboxChange(event)}
                        value={this.state.inStock}
                    />

                    <label htmlFor="descriptionInput">Description</label>
                    <input
                        id="descriptionInput"
                        type="text"
                        name="description"
                        placeholder="Very Nice Fancy Phone"
                        onChange={(event) => this.handleChange(event)}
                        value={this.state.description}
                    />

                    <label htmlFor="imageInput">Image</label>
                    <input
                        id="imageInput"
                        type="file"
                        name="image"
                        onChange={(event) => this.handleImageChange(event)}
                        // here we will use a ref to create a variable fileInput in order to clear the value of the file type input tag once we submit our form.
                        // Refs are a function provided by React to access the DOM element and the React element that you might have created on your own. They are used in cases where we want to change the value of a child component, without making use of props.
                        // using refs is not recommended to use, even less than lifecycle methods since using refs is kinda moving little away the react way of thinking which is once state changes, you re-render all the components of your UI that depend on that state.
                        // In our case file type input is a non controlled input type and therefor we cannot reset the value using state so this would fall under one of those cases that using ref would not be fround upon.
                        ref={(ref) => (this.fileInput = ref)}
                    />

                    <button>Add Product</button>
                </form>

                <hr />

                {this.state.allProducts && this.viewProducts()}
            </div>
        );
    }
}

export default ProductList;
