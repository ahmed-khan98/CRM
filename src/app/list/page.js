"use client";
import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { useFormik, Formik, Form, ErrorMessage, useFormikContext } from 'formik';
import Cookies from "js-cookie";
import { useLoginMutation } from '../_Services/authentication/page';
import toast from 'react-hot-toast';
import { useGetCategoriesQuery, useGetSubCategoriesQuery } from '../_Services/categories/page';
import { useAddListingMutation } from '../_Services/products/page';
import { Rating } from 'react-simple-star-rating'


export default function Home() {

    const [addListing, { isLoading }] = useAddListingMutation()
    console.log(isLoading, 'isLoading')
    const [step, setStep] = useState(1);
    console.log(step, 'step')
    const goNext = () => {
        if (step === 'PREVIEW LISTING') {
            setStep(15)
        }
        else {
            setStep((prev) => prev + 1)
        }
    };
    const goBack = () => {
        if (step === 'PREVIEW LISTING') {
            setStep(13)
        }
        else {
            setStep((prev) => prev - 1)
        }
    };

    const validationSchemas = {
        step5: Yup.object({
            categoryId: Yup.string().required('Category is required'),
            subCategoryId: Yup.string().required('Subcategory is required'),
        }),
        step6: Yup.object({
            images: Yup.array()
                .min(1, 'Please upload at least 1 image of the product')
                .required('Product image is required'),
        }),
        step7: Yup.object({
            brand: Yup.string().required('brand is required'),
            model: Yup.string().required('model is required'),
        }),
        step8: Yup.object({
            ASIN: Yup.string().required('ASIN is required'),
            'EAN/UPC': Yup.string().required('EAN/UPC is required'),
        }),
        step9: Yup.object({
            name: Yup.string()
                .required('Product Title is required')
                .max(200, 'Title must be at most 200 characters'),
        }),
        step10: Yup.object({
            description: Yup.string()
                .required('Product description is required')
                .max(1000, 'Description must be at most 1000 characters'),
        }),
        step11: Yup.object({
            rating: Yup.number()
                .required('Product rating is required'),
            condition: Yup.string()
                .required('Product condition is required')
        }),
        step12: Yup.object({
            retail: Yup.number()
                .typeError('Retail price must be a number')
                .required('Product retail is required')
                .moreThan(0, 'Retail price must be greater than 0'),
            buyerPremium: Yup.string()
                .required('Product buyerPremium is required'),
            price: Yup.number()
                .typeError('Price must be a number')
                .required('Product price is required')
                .moreThan(0, 'Price must be greater than 0'),
        }),
        step13: Yup.object({
            'item weight': Yup.string()
                .required('item weight is required'),
            dimension: Yup.string()
                .required('Product dimension is required'),
            location: Yup.string()
                .required('Product location is required'),
            'handling fee': Yup.string()
                .required('Product handling fee is required'),
        }),

    };

    const initialValues = {
        categoryId: '',
        subCategoryId: '',
        images: [],
        name: '',
        description: '',
        brand: '',
        model: '',
        ASIN: '',
        'EAN/UPC': '',
        condition: '',
        tags: [],
        retail: '',
        price: '',
        buyerPremium: '',
        location: '',
        rating: 0,
        dimension: '',
        'item weight': '',
        'handling fee': ''
    };

    const handleSubmit = async (values) => {
        try {
            const product = new FormData();
            product.append('name', values?.name);
            product.append('shortDescription', values?.description);
            product.append('categoryId', values?.categoryId);
            product.append('subcategoryId', values?.subCategoryId);
            product.append('price', values?.price);
            product.append('retail', values?.retail);
            product.append('buyerPremium', values?.buyerPremium);
            product.append('rating', values?.rating);

            product.append(`item_spec[0][name]`, 'BRAND');
            product.append(`item_spec[0][value]`, values?.brand);
            product.append(`item_spec[1][name]`, 'MODEL');
            product.append(`item_spec[1][value]`, values?.model);
            product.append(`item_spec[2][name]`, 'ASIN');
            product.append(`item_spec[2][value]`, values?.ASIN);
            product.append(`item_spec[3][name]`, 'EAN/UPC');
            product.append(`item_spec[3][value]`, values?.['EAN/UPC']);
            product.append(`shipping[0][name]`, 'ITEM WEIGHT');
            product.append(`shipping[0][value]`, values?.['item weight']);
            product.append(`shipping[1][name]`, 'HANDLING FEE');
            product.append(`shipping[1][value]`, values?.['handling fee']);
            product.append(`shipping[2][name]`, 'LOCATION');
            product.append(`shipping[2][value]`, values?.location);

            values?.tags.forEach((t, index) => {
                product.append(`tag[${index}]`, t);
            });

            values?.images?.map((e) => {
                product.append('images', e);
            });


            const response = await addListing(product).unwrap();
          
            console.log(response, 'response')
            if (response?.success) {
                toast.success(response.message);
                Cookies.remove("token");
                Cookies.remove("currentuser");
                setStep(1)
            }
        } catch (error) {
            console.log(error, 'error')
            toast.error(error?.data?.message || "Something went wrong--->>");
        }
    };

    return (
        <div className="min-h-screen bg-sky-100 flex items-center justify-center px-4">
            <div className="w-full max-w-xl text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">{step === 15 ? 'LAST STEP' : `STEP ${step}`}</h1>
                {
                    step === 2 ? <Login onNext={goNext} onBack={goBack} />
                        :
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchemas[`step${step}`]}
                            onSubmit={(values) => {
                                console.log(values, 'values');
                                if (step < 15 || step === 'PREVIEW LISTING') {
                                    goNext();
                                } else {
                                    handleSubmit(values);
                                }
                            }}
                            enableReinitialize
                        >
                            {({ handleSubmit }) => (
                                <Form>
                                    {step === 1 && <Step1 onNext={goNext} />}
                                    {step === 3 && <Step3 onNext={goNext} onBack={goBack} />}
                                    {step === 4 && <Step4 onNext={goNext} onBack={goBack} />}
                                    {step === 5 && <Step5 onNext={goNext} onBack={goBack} />}
                                    {step === 6 && <Step6 onNext={goNext} onBack={goBack} />}
                                    {step === 7 && <Step7 onNext={goNext} onBack={goBack} />}
                                    {step === 8 && <Step8 onNext={goNext} onBack={goBack} />}
                                    {step === 9 && <Step9 onNext={goNext} onBack={goBack} />}
                                    {step === 10 && <Step10 onNext={goNext} onBack={goBack} />}
                                    {step === 11 && <Step11 onNext={goNext} onBack={goBack} />}
                                    {step === 12 && <Step12 onNext={goNext} onBack={goBack} />}
                                    {step === 13 && <Step13 onNext={goNext} onBack={goBack} />}
                                    {step === 14 && <Step14 onNext={goNext} onBack={goBack} setStep={setStep} />}
                                    {step === 15 && <LastStep onNext={goNext} onBack={goBack} isLoading={isLoading} />}
                                    {step === 'PREVIEW LISTING' && <ListingPreview onNext={goNext} onBack={goBack} />}

                                    {step !== 1 && step !== 2 && step !== 3 && step !== 4 && step !== 15 && (
                                        <div className="space-y-4 pt-4">
                                            <button
                                                type="submit"
                                                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold text-lg md:text-2xl py-3 md:py-5 rounded-lg transition-colors"
                                            >
                                                CONTINUE
                                            </button>
                                        </div>
                                    )}
                                    {step !== 1 && step !== 2 && step !== 3 && step !== 4 && (
                                        <button
                                            type="button"
                                            onClick={goBack}
                                            className="block my-4 w-full text-blue-700 font-semibold underline text-center text-base md:text-lg"
                                        >
                                            ← Back
                                        </button>)}
                                </Form>
                            )}
                        </Formik>
                }
            </div>
        </div>
    );
}

// STEP 1
function Step1({ onNext }) {
    return (
        <>
            <button
                onClick={onNext}
                className="bg-red-600 text-white text-2xl font-bold py-5 w-full rounded hover:bg-red-700"
            >
                Login
            </button>
        </>
    );
}

function Login({ onNext }) {
    const [loginForm, { isLoading: isSubmitting, isError: isFormError }] = useLoginMutation();

    const loginSchema = Yup.object({
        email: Yup.string().email().required("Email is required"),
        password: Yup.string().required("Password is required"),
    })

    const loginInitialValue = {
        email: "",
        password: "",
    }

    const formik = useFormik({
        initialValues: loginInitialValue,
        enableReinitialize: true,
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            try {
                const response = await loginForm(values).unwrap();
                if (response.statusCode === 200) {
                    const { accessToken } = response?.data;
                    const user = response?.data?.user;
                    Cookies.set("token", accessToken, { expires: 7, secure: true });
                    Cookies.set("currentuser", JSON.stringify(user), { expires: 7, secure: true });
                    toast.success(response.message);
                    onNext()
                }
            } catch (error) {
                console.log(error.data.message, 'verify-error')
                toast.error(error.data.message);
            }
        },
    })


    return (
        <>
            <h1 className="text-3xl font-bold mb-5">Login</h1>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 md:p-4 border-2 border-gray-300 rounded-md min-h-[50px] text-sm md:text-base"
                    name="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                />
                {
                    formik.errors.email && formik.touched.email ?
                        <span className="text-red-500 text-sm">{formik.errors.email}</span>
                        : null
                }
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 md:p-4 border-2 border-gray-300 rounded-md min-h-[50px] text-sm md:text-base"
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                />
                {
                    formik.errors.password && formik.touched.password ?
                        <span className="text-red-500 text-sm pb-4">{formik.errors.password}</span>
                        : null
                }
                <button
                    type="submit"
                    className="w-full bg-red-600 text-white text-xl font-bold py-4 rounded hover:bg-red-700"
                >
                    {isSubmitting ? "Loading...." : "LOG IN"}
                </button>
            </form>
        </>
    );
}

function Step3({ onNext }) {
    return (

        <div className="space-y-4">
            <button className="bg-blue-600 text-white font-bold text-lg py-5 w-full rounded">
                CREATE LISTING FOR VENDOR
            </button>
            <button
                onClick={onNext}
                className="bg-red-600 text-white font-bold text-lg py-5 w-full rounded"
            >
                CREATE A LISTING FOR OUR SITE
            </button>
        </div>


    );
}

function Step4({ onNext }) {
    return (


        <div className="space-y-4">
            <button className="bg-blue-600 text-white font-bold text-xl py-5 w-full rounded">
                SCAN UPC
            </button>
            <button onClick={onNext} className="bg-red-600 text-white font-bold text-xl py-5 w-full rounded">
                CREATE MANUALLY
            </button>
        </div>

    );
}

function Step5() {
    const { data: categories } = useGetCategoriesQuery();

    const { values, handleChange } = useFormikContext();

    const [selectedCategoryId, setSelectedCategoryId] = useState("");

    const {
        data: subcategories,
        refetch,
        isFetching,
    } = useGetSubCategoriesQuery(selectedCategoryId, {
        skip: !selectedCategoryId,
    });

    useEffect(() => {
        if (values.categoryId) {
            setSelectedCategoryId(values.categoryId);
        }
    }, [values.categoryId]);

    return (
        <div className="space-y-4 bg-white py-4 px-2 rounded-lg shadow-md md:px-5 md:py-8">
            {/* CATEGORY SELECT */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-1 py-2 text-start">
                <p className="text-gray-700 font-medium w-full md:w-1/3">CATEGORY</p>
                <select
                    name="categoryId"
                    value={values.categoryId}
                    onChange={(e) => {
                        const selectedCatId = e.target.value;
                        setSelectedCategoryId(selectedCatId);
                        handleChange({
                            target: {
                                name: "categoryId",
                                value: selectedCatId,
                            },
                        });
                        if (values.categoryId !== selectedCatId) {
                            handleChange({
                                target: {
                                    name: "subCategoryId",
                                    value: "",
                                },
                            });
                        }
                    }}
                    className="w-full md:flex-1 p-2 border-2 border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                >
                    <option value="">Select Category</option>
                    {categories?.data?.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>
            <ErrorMessage
                name="categoryId"
                component="div"
                className="text-red-500 text-sm"
            />

            <div className="flex flex-col md:flex-row items-start md:items-center gap-1 py-2 text-start">
                <p className="text-gray-700 font-medium w-full md:w-1/3">SUB CATEGORY</p>
                <select
                    name="subCategoryId"
                    value={values.subCategoryId}
                    onChange={handleChange}
                    className="w-full md:flex-1 p-2 border-2 border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                >
                    <option value="">Select Sub Category</option>
                    {subcategories?.data?.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                            {sub.name}
                        </option>
                    ))}
                </select>
            </div>
            <ErrorMessage
                name="subCategoryId"
                component="div"
                className="text-red-500 text-sm"
            />
        </div>
    );
}

function Step6() {
    const { values, setFieldValue } = useFormikContext();
    const fileInputRef = useRef();

    const handleImageUpload = (e) => {
        const uploadedImages = Array.from(e.target.files);
        const currentImages = values.images || [];
        setFieldValue('images', [...currentImages, ...uploadedImages]);
    };

    const handleTakePhoto = () => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            video.srcObject = stream;
            video.play();

            const captureImage = () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const photo = canvas.toDataURL('image/png');
                const currentImages = values.images || [];
                setFieldValue('images', [...currentImages, photo]);
                stream.getTracks().forEach((track) => track.stop());
            };

            video.addEventListener('canplay', captureImage);
        });
    };

    const handleDeleteImage = (index) => {
        const updatedImages = values.images.filter((_, i) => i !== index);
        setFieldValue('images', updatedImages);
    };

    return (
        <div className="space-y-4">
            <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="bg-blue-600 text-white font-bold text-xl py-5 w-full rounded"
            >
                UPLOAD IMAGES
            </button>

            <input
                type="file"
                ref={fileInputRef}
                multiple
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
            />

            <button
                type="button"
                onClick={handleTakePhoto}
                className="bg-red-600 text-white font-bold text-xl py-5 w-full rounded"
            >
                TAKE A PHOTO
            </button>

            {values.images?.length > 0 && (
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Uploaded Photos:</h3>
                    <div className="flex flex-wrap gap-4">
                        {values.images.map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                    alt={`uploaded-${index}`}
                                    className="w-20 h-20 object-cover border-1 rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteImage(index)}
                                    className="absolute top-[-8px] right-[-4px] text-red-500 font-bold text-xl bg-white rounded-full w-4 h-4 flex items-center justify-center shadow"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <ErrorMessage name="images" component="div" className="text-red-500 text-sm" />
        </div>
    );
};

function Step7() {

    const { values, handleChange } = useFormikContext();

    return (

        <div className="space-y-4">
            <p className="font-semibold text-lg mx-4 md:mx-12 p-2 text-center">PLEASE ENTER ITEM BRAND & MODEL</p>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                <p className="bg-gray-300 p-3 font-medium w-full md:w-1/3 text-center md:text-left">Brand</p>
                <input
                    type='text'
                    name="brand"
                    value={values.brand}
                    onChange={handleChange}
                    className="w-full md:flex-1 p-3 border-2 border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
            </div>
            <ErrorMessage name="brand" component="div" className="text-red-500 text-sm" />
            <div className="flex flex-col md:flex-row mt-5 items-start md:items-center gap-2">
                <p className="bg-gray-300 p-3 font-medium w-full md:w-1/3 text-center md:text-left">Model
                </p>
                <input
                    type='text'
                    name="model"
                    value={values.model}
                    onChange={handleChange}
                    className="w-full md:flex-1 p-3 border-2 border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
            </div>
            <ErrorMessage name="model" component="div" className="text-red-500 text-sm" />

        </div>

    );
}
function Step8() {
    const { values, handleChange } = useFormikContext();

    return (

        <div className="space-y-4">
            <p className="font-semibold text-lg mx-4 md:mx-12 p-2 text-center">ENTER PRODUCT INDENTIFIER
            </p>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                <p className="bg-gray-300 p-3 font-medium w-full md:w-1/3 text-center md:text-left">ASIN</p>
                <input
                    type='text'
                    name="ASIN"
                    value={values.ASIN}
                    onChange={handleChange}
                    className="w-full md:flex-1 p-3 border-2 border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
            </div>
            <ErrorMessage name="ASIN" component="div" className="text-red-500 text-sm" />

            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                <p className="bg-gray-300 p-3 font-medium w-full md:w-1/3 text-center md:text-left">EAN/UPC
                </p>
                <input
                    type='text'
                    name="EAN/UPC"
                    value={values?.['EAN/UPC']}
                    onChange={handleChange}
                    className="w-full md:flex-1 p-3 border-2 border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
            </div>
            <ErrorMessage name="EAN/UPC" component="div" className="text-red-500 text-sm" />
        </div>

    );
}
function Step9() {
    const { values, handleChange } = useFormikContext();
    return (
        <div className="space-y-4">
            <div className="space-y-4">
                <h2 className="font-bold text-xl md:text-2xl text-center bg-gray-300 p-4 rounded-md">
                    ENTER ITEM TITLE
                </h2>
                <p className="text-gray-600 text-center text-sm md:text-base">
                    200 Character Limit Max
                </p>

                <textarea
                    name='name'
                    value={values?.name}
                    onChange={handleChange}
                    maxLength={200}
                    className="w-full p-2 md:p-4 border-2 border-gray-300 rounded-md min-h-[100px] text-sm md:text-base"
                    placeholder="Enter item title"
                />
            </div>
            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            <p className="text-sm text-gray-400 text-right">{values?.name?.length}/200</p>
        </div>

    );
}
function Step10() {

    const { values, handleChange } = useFormikContext();

    return (

        <div className="space-y-4 ">
            <h2 className="font-bold text-xl md:text-2xl text-center bg-gray-300 p-2 rounded-md">
                ENTER PRODUCT DESCRIPTION
            </h2>
            <p className="text-gray-600 text-center text-sm md:text-base">
                1000 Character Limit Max
            </p>

            <textarea
                name='description'
                value={values?.description}
                onChange={handleChange}
                maxLength={1000}
                className="w-full p-2 md:p-4 border-2 border-gray-300 rounded-md min-h-[150px] text-sm md:text-base"
                placeholder="ENTER PRODUCT DESCRIPTION"
            />
            <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />

            <p className="text-sm text-gray-400 text-right">{values?.description?.length}/1000</p>
        </div>

    );
}
function Step11() {

    const { values, errors, touched, setFieldValue, handleChange } = useFormikContext();
    const handleTagChange = (tag) => {
        const tagValue = tag.toLowerCase().replace(/ /g, '');
        const isSelected = values.tags.includes(tagValue);

        if (isSelected) {
            setFieldValue('tags', values.tags.filter(t => t !== tagValue));
        } else {
            setFieldValue('tags', [...values.tags, tagValue]);
        }
    };

    const tagGroups = [
        ['Not Funtional', 'Tested', 'Works Great', 'Missing Parts'],
        ['X-Small', 'Small', 'Large', 'Extra Large'],
        ['Boys', 'Girls', 'Men', 'Women']
    ];


    // Catch Rating value
    const handleRating = (rate) => {
        setFieldValue('rating', rate)
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto py-5">

            <div className="bg-white p-3 md:p-6 rounded-lg shadow-md space-y-6">
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-[38px] font-bold text-center">QUALITY</h2>
                    <div className="flex justify-center items-center py-6">
                        <Rating
                            onClick={handleRating}
                            initialValue={values?.rating}
                            SVGstyle={{ display: 'inline-block' }}
                            allowFraction
                        />
                    </div>
                    {touched.rating && errors.rating && (
                        <div className="text-red-500 text-sm">{errors.rating}</div>
                    )}

                </div>

                <hr className="border-t-2 border-gray-200" />

                <div className="space-y-4">

                    <span className="font-medium bg-gray-300 p-2 block w-full md:w-auto text-center">ITEM CONDITION</span>

                    <div className="flex flex-col md:flex-row gap-4 justify-center text-center">
                        {['New', 'Open Box', 'Used', 'For Parts'].map((cond) => (
                            <label
                                key={cond}
                                className={`flex items-center gap-2  p-3 rounded-md bg-gray-200 cursor-pointer ${values?.condition === cond ? 'ring-2 ring-blue-400' : ''
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="condition"
                                    value={cond}
                                    onChange={handleChange}
                                    checked={values?.condition === cond}
                                    className="w-5 h-5 accent-black-500 border-gray-300 rounded-full"
                                />
                                <span className={values?.condition === cond ? 'font-semibold' : ''}>
                                    {cond}
                                </span>
                            </label>
                        ))}
                    </div>
                    <ErrorMessage name="condition" component="div" className="text-red-500 text-sm" />

                </div>
                <span className="font-medium bg-gray-300 p-2 block w-full md:w-auto text-center">Add More Tag</span>

                {tagGroups?.map((group, index) => (
                    <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {group?.map(tag => {
                            const tagValue = tag.toLowerCase().replace(/ /g, '');
                            const isChecked = values.tags.includes(tagValue);

                            return (
                                <label key={tag} className="flex items-center gap-1">
                                    <input
                                        type="checkbox"
                                        name="tags"
                                        value={tagValue}
                                        checked={isChecked}
                                        onChange={() => handleTagChange(tag)}
                                        className="w-5 h-5 accent-gray-300 border-gray-300 rounded-sm"
                                    />
                                    <span className="text-gray-700">{tag}</span>
                                </label>
                            );
                        })}
                    </div>
                ))}

            </div>
        </div>

    );
}
function Step12() {

    const { values, handleChange } = useFormikContext();

    return (

        <div className="space-y-4">
            <p className="font-semibold text-lg mx-4 md:mx-12  p-2 text-center">
                ENTER PRICING INFO
            </p>

            <div className="space-y-6 p-1 ">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    <p className="bg-gray-300 p-3 font-medium w-full md:w-1/2 text-center md:text-left">Estimated Retail Price</p>
                    <input
                        type="number"
                        name='retail'
                        value={values?.retail}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                </div>
                <ErrorMessage name="retail" component="div" className="text-red-500 text-sm" />


                <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    <p className="bg-gray-300 p-3 font-medium w-full md:w-1/2 text-center md:text-left">Start Price</p>
                    <input
                        type="number"
                        name='price'
                        value={values?.price}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                </div>
                <ErrorMessage name="price" component="div" className="text-red-500 text-sm" />


                <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    <p className="bg-gray-300 p-3 font-medium w-full md:w-1/2 text-center md:text-left">Buyers Premium</p>
                    <input
                        type="number"
                        name='buyerPremium'
                        value={values?.buyerPremium}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                </div>
                <ErrorMessage name="buyerPremium" component="div" className="text-red-500 text-sm" />

            </div>
        </div>
    );
}
function Step13() {
    const { values, handleChange } = useFormikContext();

    return (

        <div className="space-y-1">
            <p className="font-semibold text-lg bg-green-700 mx-4 md:mx-12  text-white p-2 text-center md:text-left">
                ENTER SHIPPING INFORMATION
            </p>

            <div className="space-y-6 p-1 rounded-lg">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    <p className="bg-gray-300 p-3 font-medium w-full md:w-1/3 text-center md:text-left">ITEM WEIGHT</p>
                    <input
                        type="text"
                        name='item weight'
                        value={values?.['item weight']}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                </div>
                <ErrorMessage name="item weight" component="div" className="text-red-500 text-sm" />


                <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    <p className="bg-gray-300 p-3 font-medium w-full md:w-1/3 text-center md:text-left">DIMENSION</p>
                    <input
                        type="text"
                        name='dimension'
                        value={values?.dimension}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                </div>
                <ErrorMessage name="dimension" component="div" className="text-red-500 text-sm" />

                <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    <p className="bg-gray-300 p-3 font-medium w-full md:w-1/3 text-center md:text-left">HANDLING FEE</p>
                    <input
                        type="text"
                        name='handling fee'
                        value={values?.['handling fee']}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                </div>
                <ErrorMessage name="handling fee" component="div" className="text-red-500 text-sm" />

                <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    <p className="bg-gray-300 p-3 font-medium w-full md:w-1/3 text-center md:text-left">LOCATION</p>
                    <input
                        type="text"
                        name='location'
                        value={values?.location}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                </div>
                <ErrorMessage name="location" component="div" className="text-red-500 text-sm" />

            </div>
        </div>
    );
}
function Step14({ setStep }) {
    return (
        <div className="space-y-4">
            <button type='button' onClick={() => setStep('PREVIEW LISTING')} className="bg-orange-700 text-white font-bold text-xl py-5 w-full rounded">
                PREVIEW LISTING
            </button>
            <button className="bg-[#b1a646] text-white font-bold text-xl py-5 w-full rounded">
                PRINT ITEM SKU
                <p>Using ZEBRA Label Printer</p>
            </button>

        </div>
    );
}
function LastStep({ onBack, isLoading }) {
    const { submitForm } = useFormikContext()

    return (

        <div className="space-y-4">
            <button className="bg-orange-700 text-white font-bold text-xl py-5 w-full rounded">
                CREATE ANOTHER
                LISTING
            </button>

            <button
                onClick={submitForm}
                disabled={isLoading}
                className=" text-white font-bold text-xl py-5 w-full rounded bg-blue-900"
            > {isLoading ? 'Saving...' : 'SAVE & EXIT'}
            </button>
        </div>
    );
}

function ListingPreview() {
    const { values } = useFormikContext();
    const { data: categories } = useGetCategoriesQuery();
    const { data: subcategories } = useGetSubCategoriesQuery(values.categoryId, {
        skip: !values.categoryId,
    });

    const categoryName = categories?.data?.find((cat) => cat._id === values.categoryId)?.name;
    const subcategoryName = subcategories?.data?.find((sub) => sub._id === values.subCategoryId)?.name;

    const renderImages = () => {
        if (!values.images || values.images.length === 0) return null;
        return (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {values.images.map((img, idx) => (
                    <img
                        key={idx}
                        src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                        alt={`Product ${idx + 1}`}
                        className="w-20 h-20 sm:h-20 md:h-20 object-cover rounded-md border"
                    />
                ))}
            </div>
        );
    };

    const renderTags = () => {
        if (!values.tags || values.tags.length === 0) return null;
        return (
            <div className="flex flex-wrap gap-2 mt-1 text-sm sm:text-base">
                <span className="font-medium text-gray-700">Tags:</span>
                {values.tags.map((tag, idx) => (
                    <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        );
    };

    const InfoRow = ({ label, value }) => (
        <div className="flex justify-between items-start flex-wrap gap-y-1 text-gray-700 py-2 border-b border-gray-100 text-sm sm:text-base">
            <span className="font-medium">{label}:</span>
            <span className="text-right max-w-[100%] sm:max-w-[80%] break-words">{value || '-'}</span>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6 bg-white rounded-md shadow-md text-sm sm:text-base">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">Listing Preview</h2>

            <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Category Information</h3>
                <InfoRow label="Category" value={categoryName} />
                <InfoRow label="Subcategory" value={subcategoryName} />
            </section>

            <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Product Information</h3>
                <div className="flex justify-between items-start flex-wrap gap-y-1 text-gray-700 py-2 border-b border-gray-100 text-sm sm:text-base">
                    <span className="max-w-[100%] sm:max-w-[30%] font-medium">Title:</span>
                    <span className="text-start max-w-[100%] sm:max-w-[70%] break-words">{values.name || '-'}</span>
                </div>
                <div className="flex justify-between items-start flex-wrap gap-y-1 text-gray-700 py-2 border-b border-gray-100 text-sm sm:text-base">
                    <span className="font-medium max-w-[100%] sm:max-w-[30%]">Description:</span>
                    <span className="text-start max-w-[100%] sm:max-w-[70%] break-words">{values.description || '-'}</span>
                </div>
                <InfoRow label="Brand" value={values.brand} />
                <InfoRow label="Model" value={values.model} />
                <InfoRow label="ASIN" value={values.ASIN} />
                <InfoRow label="EAN/UPC" value={values['EAN/UPC']} />
                <div className="flex justify-between items-start flex-wrap gap-y-1 text-gray-700 py-2 border-b border-gray-100 text-sm sm:text-base">
                    <span className="font-medium">Quality:</span>

                    <span className="text-right max-w-[100%] sm:max-w-[80%] break-words">
                        <div className="flex justify-center items-center">
                            <Rating
                                size='25'
                                SVGstyle={{ display: 'inline-block' }}
                                initialValue={values?.rating}
                            />
                        </div>
                    </span>
                </div>
                <InfoRow label="Condition" value={values.condition} />
                {renderTags()}
            </section>

            <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Pricing</h3>
                <InfoRow label="Retail Price" value={`$${values.retail}`} />
                <InfoRow label="Price" value={`$${values.price}`} />
                <InfoRow label="Buyer Premium" value={`${values.buyerPremium}`} />
            </section>

            <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Shipping Information</h3>
                <InfoRow label="Location" value={values.location} />
                <InfoRow label="Item Weight" value={values['item weight']} />
                <InfoRow label="Dimension" value={values.dimension} />
                <InfoRow label="Handling Fee" value={`$${values['handling fee']}`} />
            </section>

            <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Uploaded Images</h3>
                {renderImages()}
            </section>
        </div>
    );
}

