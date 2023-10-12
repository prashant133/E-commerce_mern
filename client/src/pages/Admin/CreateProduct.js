import React from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useEffect, useState } from "react";
import Axios from "axios";
import toast from "react-hot-toast";
import { Select } from 'antd'
import { useNavigate } from "react-router-dom";

const { Option } = Select


const CreateProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([])
    const [photo, setPhoto] = useState("")
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [quantity, setQuantity] = useState("")
    const [shipping, setShipping] = useState("")


    //get all categories
    const getAllCategory = async () => {
        try {
            const { data } = await Axios.get("/api/v1/category/get-category");
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something wwent wrong in getting catgeory");
        }
    };

    useEffect(() => {
        getAllCategory();
    }, []);


    // create proudct function

    const handleCreate = async(e)=>{
        e.preventDefault()
        try {
            // browser function
            const productData = new FormData()
            productData.append("name" , name)
            productData.append("description" ,description)
            productData.append("price" , price)
            productData.append("quantity" , quantity)
            productData.append("photo" , photo)
            productData.append("category" , category)

            const {data} = Axios.post('/api/v1/product/create-product', productData)
            if(data?.success){
                toast.error(data?.message)
            }else{
                toast.success('Product Created successfully')
                navigate('/dashbaord/admin/products')
            }
            
        } catch (error) {
            console.log(error)
            toast.error('something went wrong')
        }
    }

    return (

        <Layout title={"Dashboard- Create Product"}>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Create Product</h1>
                        <div className="m-1" w-75>

                            { /* search bar for category */}
                            <Select bordered={false}
                                placeholder="Select a category"
                                size="large"
                                showSearch
                                className="form-select mb-3" onChange={(value) => { setCategory(value) }}
                            >
                                {categories?.map((c) => (
                                    // option is taken from the categories we have which is c.name
                                    <Option key={c._id} value={c._id}>
                                        {c.name}
                                    </Option>))}

                            </Select>
                            <div className="mb-3">
                                <label className="btn btn-outline-secondary col-md-12">
                                    {/* if we browse the image show the photo name or show upload photo */}
                                    {photo ? photo.name : "Upload Photo"}
                                    {/* we only accept image and we set the photo to e.target.files[0] because we are getting file for files and image is array so[0] */}
                                    <input type="file" name="photo" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} hidden></input>

                                </label>
                            </div>
                            <div className="mb-3">
                                {/* if we get the image then show it here */}
                                {photo && (
                                    <div className="text-center">
                                        <img src={URL.createObjectURL(photo)} alt="product-photo" height={'200px'} className="img img-responsive" />
                                    </div>
                                )}

                            </div>
                            {/* name */}
                            <div className="mb-3">
                                <input
                                    type ="text"
                                    value={name}
                                    placeholder="write a name"
                                    className="form-control"
                                    onChange={(e)=>setName(e.target.value)}
                                />
                                

                            </div>
                            {/* description */}
                            <div className="mb-3">
                                <textarea
                                    type ="text"
                                    value={description}
                                    placeholder="write a Description"
                                    className="form-control"
                                    onChange={(e)=>setDescription(e.target.value)}
                                />
                                

                            </div>
                            {/* price */}
                            <div className="mb-3">
                                <input
                                    type ="text"
                                    value={price}
                                    placeholder="Price "
                                    className="form-control"
                                    onChange={(e)=>setPrice(e.target.value)}
                                />
                                

                            </div>
                            {/* Quantity */}
                            <div className="mb-3">
                                <input
                                    type ="number"
                                    value={quantity}
                                    placeholder="Quantity"
                                    className="form-control"
                                    onChange={(e)=>setQuantity(e.target.value)}
                                />
                                

                            </div>
                                    {/* Shipping */}
                            <div className="mb-3">
                                {/* we used Select for antd and use option to choose yes for 1 and no for 0  */}
                                <Select
                                 bordered={false}
                                 placeholder="Shipping"
                                 size="large"
                                 showSearch
                                 className="form-select mb-3"
                                 onChange={(value)=> {
                                    setShipping(value);
                                 }}
                                >
                                    <Option value="0"> NO</Option>
                                    <Option value="1"> Yes</Option>
                                    
                                </Select>
                            </div>
                            <div className="mb-3"> 
                                <button className="btn btn-primary" onClick={handleCreate}>CREATE PRODUCT</button>
                            </div>


                        </div>
                    </div>
                </div>

            </div>

        </Layout>

    )
}

export default CreateProduct