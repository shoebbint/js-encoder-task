import React, { Fragment, useState } from "react";
import Breadcrumb from "../../common/breadcrumb";
import {
	Card,
	CardBody,
	CardHeader,
	Col,
	Container,
	Form,
	FormGroup,
	Input,
	Label,
	Row,
	Button,
} from "reactstrap";
import one from "../../../assets/images/pro3/1.jpg";
import user from "../../../assets/images/user.png";
import MDEditor from "@uiw/react-md-editor";
import axios from "axios";

const Add_product = () => {
	const [value, setValue] = useState('')
	const [quantity, setQuantity] = useState(1);
	const [file, setFile] = useState();
	const [dummyimgs, setDummyimgs] = useState([
		{ img: user },
		{ img: user },
		{ img: user },
		{ img: user },
		{ img: user },
		{ img: user },
	]);

	const onChange = (e) => {
		setValue(e)
	}


	//	image upload

	const _handleImgChange = (e, i) => {
		e.preventDefault();
		let reader = new FileReader();
		const image = e.target.files[0];

		reader.onload = () => {
			dummyimgs[i].img = reader.result;
			setFile(image); // Update the file state with the uploaded image
			setDummyimgs([...dummyimgs]); // Update the dummyimgs state with the new image
		};

		reader.readAsDataURL(image);

		// Send the file to the backend
		const formData = new FormData();
		formData.append('image', image);

		axios.post('http://localhost:9001/api/file/upload', formData)
			.then(response => {
				const imageUrl = response.data.url;
				// Update the image attribute of the request body using the received imageUrl
				// You can use the setValue function to update the value state
				setValue(prevValue => ({
					...prevValue,
					image: imageUrl
				}));
			})
			.catch(error => {
				// Handle the error
			});
	};
	//variant add
	const [variants, setVariants] = useState([{ name: "", value: "" }]);

	// const handleAddVariant = () => {
	// 	setVariants([...variants, { name: "", value: "" }]);
	// };

	// const handleRemoveVariant = (index) => {
	// 	const updatedVariants = [...variants];
	// 	updatedVariants.splice(index, 1);
	// 	setVariants(updatedVariants);
	// };

	const handleValidSubmit = (event) => {
		// Assuming you receive the product data from the backend response
		const response = {
		  data: {
			id: 'product_id',
			image_id: 'image_id',
			// Other properties from the backend response
		  },
		};
	  
		// Extract the "id" and "image_id" values
		const { id, image_id } = response.data;
	  
		// Update the variants field in the request body using the extracted values
		setValue((prevValue) => ({
		  ...prevValue,
		  variants: [
			{
			  id,
			  image_id,
			  // Add other variant properties if needed
			},
		  ],
		}));
	  
		// Perform further actions or submit the form
		event.preventDefault();
	  
		// Collect the data from the form fields
		const formData = new FormData(event.target);
		const productData = {};
	  
		// Iterate through the form data and store it in the productData object
		for (let [key, value] of formData.entries()) {
		  // Split the key by periods to access nested properties
		  const keys = key.split(".");
		  let currentObject = productData;
	  
		  // Iterate through the keys to create nested objects if needed
		  for (let i = 0; i < keys.length - 1; i++) {
			if (!currentObject.hasOwnProperty(keys[i])) {
			  currentObject[keys[i]] = {};
			}
			currentObject = currentObject[keys[i]];
		  }
	  
		  // Assign the value to the final property
		  currentObject[keys[keys.length - 1]] = value;
		}
	  
		// Log the product data for testing purposes
		console.log(productData);
	  
		  // Send the product data to the server
		  axios.post('http://localhost:9001/api/products/addproducts', productData)
		  .then((response) => {
			// Handle the successful response
			console.log('Product added successfully:', response.data);
		  })
		  .catch((error) => {
			// Handle the error
			console.error('Failed to add product:', error);
		  });
	  };
	  

	return (
		<Fragment>
			<Breadcrumb title="Add Product" parent="Physical" />

			<Container fluid={true}>
				<Row>
					<Col sm="12">
						<Card>
							<CardHeader>
								<h5>Add Product</h5>
							</CardHeader>
							<CardBody>
								<Row className="product-adding">
									<Col xl="5">
										<div className="add-product">
											<Row>
												<Col xl="9 xl-50" sm="6 col-9">
													<img
														src={one}
														alt=""
														className="img-fluid image_zoom_1 blur-up lazyloaded"
													/>
												</Col>
												<Col xl="3 xl-50" sm="6 col-3">
													<ul className="file-upload-product">
														{dummyimgs.map((res, i) => {
															return (
																<li key={i}>
																	<div className="box-input-file">
																		<Input
																			className="upload"
																			type="file"
																			onChange={(e) => _handleImgChange(e, i)}
																		/>
																		<img
																			alt=""
																			src={res.img}
																			style={{ width: 50, height: 50 }}
																		/>
																	</div>
																</li>
															);
														})}
													</ul>
												</Col>
											</Row>
										</div>
									</Col>
									<Col xl="7">
										<Form
											className="needs-validation add-product-form"
											onSubmit={handleValidSubmit}
										>
											<div className="form form-label-center">
												<FormGroup className="form-group mb-3 row">
													<Label className="col-xl-3 col-sm-4 mb-0">
														Product Name :
													</Label>
													<div className="col-xl-8 col-sm-7">
														<Input
															className="form-control"
															name="name"
															id="name"
															type="text"
															required
														/>
													</div>
													<div className="valid-feedback">Looks good!</div>
												</FormGroup>
												<FormGroup className="form-group mb-3 row">
													<Label className="col-xl-3 col-sm-4 mb-0">
														Brand Name :
													</Label>
													<div className="col-xl-8 col-sm-7">
														<Input
															className="form-control"
															name="brand"
															id="brand"
															type="text"
															required
														/>
													</div>
													<div className="valid-feedback">Looks good!</div>
												</FormGroup>
												<FormGroup className="form-group mb-3 row">
													<Label className="col-xl-3 col-sm-4">
														Add Description :
													</Label>
													<div className="col-xl-8 col-sm-7 description-sm">
														<MDEditor
															
															onChange={onChange}
															name="description"
															id="description"
															type="text"
															required />
													</div>
												</FormGroup>
												<FormGroup className="form-group mb-3 row">
													<Label className="col-xl-3 col-sm-4 mb-0">
														Price :
													</Label>
													<div className="col-xl-8 col-sm-7">
														<Input
															className="form-control mb-0"
															name="quantity"
															id="quantity"
															type="number"
															required
														/>
													</div>
													<div className="valid-feedback">Looks good!</div>
												</FormGroup>
												<FormGroup className="form-group mb-3 row">
													<Label className="col-xl-3 col-sm-4 mb-0">
														Discount :
													</Label>
													<div className="col-xl-8 col-sm-7">
														<Input
															className="form-control mb-0"
															name="discount"
															id="discount"
															type="number"
															required
														/>
													</div>
													<div className="valid-feedback">Looks good!</div>
												</FormGroup>

												<FormGroup className="form-group mb-3 row">
													<Label className="col-xl-3 col-sm-4 mb-0">
														Type :
													</Label>
													<div className="col-xl-8 col-sm-7">
														<select
															className="form-control digits"
															id="type"
															name="type"
														>
															<option>Small</option>
															<option>Medium</option>
															<option>Large</option>
															<option>Extra Large</option>
														</select>
													</div>
												</FormGroup>
												<FormGroup className="form-group mb-3 row">
													<Label className="col-xl-3 col-sm-4 mb-0">
														Category:
													</Label>
													<div className="col-xl-8 col-sm-7">
														<select
															className="form-control digits"
															id="category"
															name="category"
														>
															<option>Small</option>
															<option>Medium</option>
															<option>Large</option>
															<option>Extra Large</option>
														</select>
													</div>
												</FormGroup>
												<FormGroup className="form-group mb-3 row">
													<Label className="col-xl-3 col-sm-4 mb-0">
														Is new:
													</Label>
													<div className="col-xl-8 col-sm-7">
														<input defaultChecked type="checkbox" name="new" id="new" />
													</div>
												</FormGroup>
												<FormGroup className="form-group mb-3 row">
													<Label className="col-xl-3 col-sm-4 mb-0">
														On Sale:
													</Label>
													<div className="col-xl-8 col-sm-7">
														<input defaultChecked type="checkbox" name="sale" id="sale" />
													</div>
												</FormGroup>
												<FormGroup className="form-group mb-3 row">
													<Label className="col-xl-3 col-sm-4 mb-0">Ratings:</Label>
													<div className="col-xl-8 col-sm-7">
														<Input
															className="form-control mb-0"
															name="ratings"
															id="ratings"
															type="number"
															min="1"
															max="5"
															required
														/>
													</div>
													<div className="valid-feedback">Looks good!</div>
												</FormGroup>
												<FormGroup className="form-group mb-3 row">
													<Label className="col-xl-3 col-sm-4 mb-0">Reviews:</Label>
													<div className="col-xl-8 col-sm-7">
														<Input
															className="form-control mb-0"
															name="reviews"
															id="reviews"
															type="textarea"
															required
														/>
													</div>
													<div className="valid-feedback">Looks good!</div>
												</FormGroup>
												<FormGroup className="form-group mb-3 row">
													<Label className="col-xl-3 col-sm-4">Variants:</Label>
													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">Variant Color:</Label>
														<div className="col-xl-8 col-sm-7">
															<select className="form-control" name="variants.color">
																<option value="Red">Red</option>
																<option value="Blue">Blue</option>
																<option value="Green">Green</option>
																{/* Add more color options if needed */}
															</select>
														</div>
													</FormGroup>

													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">Variant ID:</Label>
														<div className="col-xl-8 col-sm-7">
															<Input
																className="form-control"
																name="variants.id"
																type="text"
																value={variants.value?.id}
																disabled
															/>
														</div>
													</FormGroup>

													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">Variant Image ID:</Label>
														<div className="col-xl-8 col-sm-7">
															<Input
																className="form-control"
																name="variants.image_id"
																type="number"
																value={variants.value?.image_id}
																disabled
															/>
														</div>
													</FormGroup>

													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">Variant Size:</Label>
														<div className="col-xl-8 col-sm-7">
															<select className="form-control" name="variants.size">
																<option value="Small">Small</option>
																<option value="Medium">Medium</option>
																<option value="Large">Large</option>
																{/* Add more size options if needed */}
															</select>
														</div>
													</FormGroup>

													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">Variant SKU:</Label>
														<div className="col-xl-8 col-sm-7">
															<Input
																className="form-control"
																name="variants.sku"
																type="text"
																required
															/>
														</div>
													</FormGroup>

												</FormGroup>

											</div>
											{/* <div className="form">
												<FormGroup className="form-group mb-3 row">
													<Label className="col-xl-3 col-sm-4 mb-0">
														Select Size :
													</Label>
													<div className="col-xl-8 col-sm-7">
														<select
															className="form-control digits"
															id="exampleFormControlSelect1"
														>
															<option>Small</option>
															<option>Medium</option>
															<option>Large</option>
															<option>Extra Large</option>
														</select>
													</div>
												</FormGroup>
												<FormGroup className="form-group mb-3 row">
													<Label className="col-xl-3 col-sm-4 mb-0">
														Total Products :
													</Label>
													<fieldset className="qty-box ms-0">
														<div className="input-group bootstrap-touchspin">
															<div className="input-group-prepend">
																<Button
																	className="btn btn-primary btn-square bootstrap-touchspin-down"
																	type="button"
																	onClick={DecreaseItem}
																>
																	<i className="fa fa-minus"></i>
																</Button>
															</div>
															<div className="input-group-prepend">
																<span className="input-group-text bootstrap-touchspin-prefix"></span>
															</div>
															<Input
																className="touchspin form-control"
																type="text"
																value={quantity}
																onChange={handleChange}
															/>
															<div className="input-group-append">
																<span className="input-group-text bootstrap-touchspin-postfix"></span>
															</div>
															<div className="input-group-append ms-0">
																<Button
																	className="btn btn-primary btn-square bootstrap-touchspin-up"
																	type="button"
																	onClick={IncrementItem}
																>
																	<i className="fa fa-plus"></i>
																</Button>
															</div>
														</div>
													</fieldset>
												</FormGroup>

											</div> */}
											<div className="offset-xl-3 offset-sm-4">
												<Button type="submit" color="primary">
													Add
												</Button>
												<Button type="button" color="light">
													Discard
												</Button>
											</div>
										</Form>
									</Col>
								</Row>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</Fragment>
	);
};

export default Add_product;
