"use client";
import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, ErrorMessage, useFormikContext, Field, FieldArray } from 'formik';
import Cookies from "js-cookie";
import toast from 'react-hot-toast';
import CreatableSelect from "react-select/creatable";
import { useRouter } from 'next/navigation';
import { Upload, Camera, Trash2 } from "lucide-react";
import { Rating } from 'react-simple-star-rating'
import { Type, FileText } from "lucide-react";
import { useAddStoreProductMutation } from '@/app/_Services/StoreProduct/page';
import { useGetIsAllCategoriesQuery, useGetIsAllSubCategoriesQuery } from '@/app/_Services/categories/page';

const steps = [
    "Category & Subcategory", // Step 1
    "Product Images", // Step 2
    "Basic Information", // Step 3
    "Pricing & Condition", // Step 5
    "Tags & Rating", // Step 6
    "Details", // Step 7
    "Review", // Step 8
    "Submit", // Step 9
]

export default function Home() {

    const [addStoreProduct, { isLoading }] = useAddStoreProductMutation()
    const [step, setStep] = useState(5);
    console.log(step, 'step')
    const router = useRouter()

    const goNext = () => {
        setStep((prev) => prev + 1)
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
        step2: Yup.object({
            mainImage: Yup.string().required('Main image is required'),
        }),
        // step6: Yup.object({
        //     images: Yup.array()
        //         .min(1, 'Please upload at least 1 image of the product')
        //         .required('Product image is required'),
        // }),
        // step7: Yup.object({
        //     brand: Yup.string().required('brand is required'),
        //     model: Yup.string().required('model is required'),
        // }),
        // step8: Yup.object({
        //     ASIN: Yup.string().required('ASIN is required'),
        //     'EAN/UPC': Yup.string().required('EAN/UPC is required'),
        // }),
        step3: Yup.object({
            name: Yup.string()
                .required('Product Title is required')
                .max(200, 'Title must be at most 200 characters'),
            shortDescription: Yup.string()
                .required('Product short Description is required')
                .max(1000, 'short Description must be at most 1000 characters'),
        }),
        step4: Yup.object({


            condition: Yup.string()
                .required('Product condition is required'),

            retail: Yup.number()
                .typeError('Retail price must be a number')
                .required('Product retail is required')
                .min(1, 'Retail price must be greater than 0'),

            quantity: Yup.number()
                .typeError('Quantity must be a number')
                .required('Product quantity is required')
                .min(1, 'Quantity must be greater than 0'),

            price: Yup.number()
                .typeError('Price must be a number')
                .required('Product price is required')
                .min(1, 'Price must be greater than 0'),
        }),
        step5: Yup.object({
            rating: Yup.number()
                .typeError('Product rating must be a number')
                .required('Product rating is required')
                .max(5, 'Product rating cannot be more than 5')

        }),

        // step6: Yup.object({
        //     'item weight': Yup.string()
        //         .required('item weight is required'),
        //     dimension: Yup.string()
        //         .required('Product dimension is required'),
        //     location: Yup.string()
        //         .required('Product location is required'),
        // }),

    };

    const initialValues = {
        categoryId: '',
        subCategoryId: '',
        mainImage: '',
        images: [],
        name: '',
        shortDescription: '',
        tag: [],
        negativeTag: [],
        quantity: 1,
        price: 0,
        retail: 0,
        buyerPremium: '15%',
        lotfee: 3,
        condition: '',
        rating: 0,
        details: [
            { name: "model", value: "" },
            { name: "style", value: "" },
            { name: "size", value: "" },
            { name: "color", value: "" },
        ],

        item_spec: [
            { name: "brand", value: "" },
            { name: "ean/upc", value: "" },
            { name: "asin", value: "" },
        ],

        shipping: [
            { name: "status", value: "" },
            { name: "location", value: "" },
            { name: "weight", value: "" },
            { name: "dimensions", value: "" },
        ],
    };

    const handleSubmit = async (values) => {
        try {
            const payload = new FormData();
            const appendIfExists = (key, value) => {
                if (value !== undefined && value !== null) payload.append(key, value)
            }
            appendIfExists("name", values?.name)
            appendIfExists("shortDescription", values?.shortDescription)
            appendIfExists("categoryId", values?.categoryId)
            appendIfExists("subcategoryId", values?.subcategoryId)
            appendIfExists("condition", values?.condition)
            appendIfExists("price", values?.price)
            appendIfExists("retail", values?.retail)
            appendIfExists("buyerPremium", values?.buyerPremium)
            appendIfExists("rating", values?.rating)
            appendIfExists("quantity", values?.quantity)
            appendIfExists("lotfee", values?.lotfee)

            values?.details?.forEach((detail, i) => {
                appendIfExists(`details[${i}][name]`, detail.name)
                appendIfExists(`details[${i}][value]`, detail.value)
            })

            values?.item_spec?.forEach((spec, i) => {
                appendIfExists(`item_spec[${i}][name]`, spec.name)
                appendIfExists(`item_spec[${i}][value]`, spec.value)
            })

            values?.shipping?.forEach((ship, i) => {
                appendIfExists(`shipping[${i}][name]`, ship.name)
                appendIfExists(`shipping[${i}][value]`, ship.value)
            })

            values?.tag?.forEach((t, i) => payload.append(`tag[${i}]`, t))
            values?.negativeTag?.forEach((t, i) => payload.append(`negativeTag[${i}]`, t))

            if (values?.mainImage) {
                payload.append("mainImage", values.mainImage)
            }

            values?.images?.forEach((image) => {
                if (image) payload.append("images", image)
            })

            // product.append('name', values?.name);
            // product.append('shortshortDescription', values?.shortDescription);
            // product.append('categoryId', values?.categoryId);
            // product.append('subcategoryId', values?.subCategoryId);
            // product.append('price', values?.price);
            // product.append('retail', values?.retail);
            // product.append('condition', values?.condition);
            // product.append('buyerPremium', values?.buyerPremium);
            // product.append('rating', values?.rating);

            // product.append(`item_spec[0][name]`, 'BRAND');
            // product.append(`item_spec[0][value]`, values?.brand);
            // product.append(`item_spec[1][name]`, 'MODEL');
            // product.append(`item_spec[1][value]`, values?.model);
            // product.append(`item_spec[2][name]`, 'ASIN');
            // product.append(`item_spec[2][value]`, values?.ASIN);
            // product.append(`item_spec[3][name]`, 'EAN/UPC');
            // product.append(`item_spec[3][value]`, values?.['EAN/UPC']);
            // product.append(`shipping[0][name]`, 'ITEM WEIGHT');
            // product.append(`shipping[0][value]`, values?.['item weight']);
            // product.append(`shipping[1][name]`, 'HANDLING FEE');
            // product.append(`shipping[1][value]`, values?.['handling fee']);
            // product.append(`shipping[2][name]`, 'LOCATION');
            // product.append(`shipping[2][value]`, values?.location);
            // product.append(`shipping[3][name]`, 'DIMENSION');
            // product.append(`shipping[3][value]`, values?.dimension);

            // values?.tag.forEach((t, index) => {
            //     product.append(`tag[${index}]`, t);
            // });

            // values?.images?.map((e) => {
            //     product.append('images', e);
            // });


            const response = await addStoreProduct(payload).unwrap();

            console.log(response, 'response')
            if (response?.success) {
                toast.success(response.message);
                router.push('/dashboard/myItem')
            }
        } catch (error) {
            console.log(error, 'error')
            toast.error(error?.data?.message || "Something went wrong--->>");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-4 sm:px-1 md:px-4">
            <div className="max-w-5xl mx-auto p-5 flex flex-col">
                <div className="w-full mb-6">
                    <div className="flex justify-between items-center relative">
                        {steps.map((label, index) => (
                            <div key={label} className="flex flex-col items-center flex-1">
                                <div
                                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold 
            ${index + 1 <= step ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"}`}
                                >
                                    {index + 1}
                                </div>
                                <span className="text-xs mt-2 text-center">{label}</span>
                            </div>
                        ))}
                        {/* Connecting Line */}
                        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-300 -z-10" />
                    </div>
                </div>
                {
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchemas[`step${step}`]}
                        onSubmit={(values) => {
                            console.log(values, 'values');
                            if (step !== 8) {
                                console.log('goNext')
                                goNext();
                            } else {
                                console.log('handleSubmit')
                                handleSubmit(values);
                            }
                        }}
                        enableReinitialize
                    >
                        {({ errors, touched, isSubmitting, values, setFieldValue, handleSubmit }) => {
                            const commonProps = {
                                errors, touched, isSubmitting, values, setFieldValue, handleSubmit
                            }
                            return (
                                <Form onKeyDown={(e) => {
                                    if (e.key === "Enter") e.preventDefault();
                                }}>
                                    {step === 1 && <Step1 onNext={goNext} onBack={goBack}  {...commonProps} />}
                                    {step === 2 && <Step2 onNext={goNext} onBack={goBack} />}
                                    {step === 3 && <Step3 onNext={goNext} onBack={goBack} />}
                                    {step === 4 && <Step4 onNext={goNext} onBack={goBack}   {...commonProps} />}
                                    {step === 5 && <Step5 onNext={goNext} onBack={goBack} {...commonProps} />}
                                    {step === 6 && <Step6 onNext={goNext} onBack={goBack} />}
                                    {step === 7 && <Step7 onNext={goNext} onBack={goBack} setStep={setStep} />}
                                    {step === 8 && <Step8 onNext={goNext} onBack={goBack} isLoading={isLoading} />}
                                    {step === 9 && <ListingPreview onNext={goNext} onBack={goBack} />}

                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        {step !== 1 && (
                                            <button
                                                type="button"
                                                onClick={goBack}
                                                className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300"
                                            >
                                                ← Back
                                            </button>
                                        )}
                                        {step !== 9 && (
                                            <button
                                                type="submit"
                                                className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-500"
                                            >
                                                Continue →
                                            </button>
                                        )}
                                    </div>

                                </Form>)
                        }}
                    </Formik>
                }
            </div>
        </div>
    );
}

function Step1({ errors, touched, isSubmitting, values, setFieldValue, handleSubmit }) {
    const { data: categories } = useGetIsAllCategoriesQuery();

    const { handleChange } = useFormikContext();

    const [selectedCategoryId, setSelectedCategoryId] = useState("");

    const {
        data: subcategories,
        refetch,
        isFetching,
    } = useGetIsAllSubCategoriesQuery(selectedCategoryId, {
        skip: !selectedCategoryId,
    });

    useEffect(() => {
        if (values.categoryId) {
            setSelectedCategoryId(values.categoryId);
        }
    }, [values.categoryId]);

    return (
        <div className="space-y-4 bg-white py-4 px-2 rounded-lg shadow-md md:px-5 md:py-8">
            <div>
                <label className="text-start block text-gray-700 pl-4">Category</label>


                <Field
                    as="select"
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
                    className={`w-full p-4 bg-gray-50 capitalize border ${errors?.categoryId && touched?.categoryId
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200 focus:ring-[#F33E0A]"
                        } rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200`}

                >
                    <option value="">Select Category</option>
                    {categories?.data?.map((cat) => (
                        <option key={cat._id} value={cat._id} className='capitalize m-2 text-lg'>
                            {cat.name}
                        </option>
                    ))}
                </Field>
                <ErrorMessage name="categoryId" component="div" className="text-red-500 text-sm mt-2" />
            </div>
            <div>
                <label className="text-start block text-gray-700 pl-4">Sub Category</label>

                <Field
                    as="select"
                    name="subCategoryId"
                    value={values.subCategoryId}
                    onChange={handleChange}
                    className={`capitalize w-full p-4 bg-gray-50 border ${errors?.subCategoryId && touched?.subCategoryId
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200 focus:ring-[#F33E0A]"
                        } rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200`}

                >
                    <option value="">Select Sub Category</option>
                    {subcategories?.data?.map((sub) => (
                        <option key={sub._id} value={sub._id} className='capitalize m-2 text-lg'>
                            {sub.name}
                        </option>
                    ))}
                </Field>
                <ErrorMessage name="subCategoryId" component="div" className="text-red-500 text-sm mt-2" />
            </div>
        </div>
    );
}

function Step2() {
    const { values, setFieldValue } = useFormikContext();
    const fileInputRef = useRef();
    const fileInputRef1 = useRef();

    const handleMainImageUpload = (e) => {
        const uploadedImage = e.target.files[0];
        setFieldValue('mainImage', uploadedImage);
    };

    const handleTakeMainPhoto = () => {
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
                setFieldValue('mainImage', photo);
                stream.getTracks().forEach((track) => track.stop());
            };

            video.addEventListener('canplay', captureImage);
        });
    };
    const handleDeleteMainImage = (index) => {
        setFieldValue('mainImage', '');
    };

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
        <div className="space-y-6">
            {/* Main Image Upload */}
            <div className="bg-white p-5 rounded-lg shadow space-y-4">
                <h2 className="text-lg font-semibold">Main Image</h2>
                <p className="text-sm text-gray-500">
                    Upload or take a photo for your product's main display image.
                </p>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => fileInputRef1.current.click()}
                        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 shadow"
                    >
                        <Upload className="w-5 h-5" />
                        Upload Main Image
                    </button>

                    <button
                        type="button"
                        onClick={handleTakeMainPhoto}
                        className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-500 shadow"
                    >
                        <Camera className="w-5 h-5" />
                        Take Main Photo
                    </button>
                </div>

                <input
                    type="file"
                    ref={fileInputRef1}
                    multiple
                    onChange={handleMainImageUpload}
                    className="hidden"
                    accept="image/*"
                />

                {values?.mainImage && (
                    <div>
                        <div className="relative w-24 h-24">
                            <img
                                src={typeof values?.mainImage === 'string'
                                    ? values?.mainImage
                                    : URL.createObjectURL(values?.mainImage)}
                                alt="Main"
                                className="w-full h-full object-cover rounded-md border border-gray-300"
                            />
                            <button
                                type="button"
                                onClick={handleDeleteMainImage}
                                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow hover:bg-red-100"
                            >
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Gallery Images Upload */}
            <div className="bg-white p-5 rounded-lg shadow space-y-4">
                <h2 className="text-lg font-semibold">Additional Images</h2>
                <p className="text-sm text-gray-500">
                    Upload additional photos to showcase your product from different angles.
                </p>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 shadow"
                    >
                        <Upload className="w-5 h-5" />
                        Upload Images
                    </button>

                    <button
                        type="button"
                        onClick={handleTakePhoto}
                        className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-500 shadow"
                    >
                        <Camera className="w-5 h-5" />
                        Take Photo
                    </button>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                />

                {values.images?.length > 0 && (
                    <div className="flex flex-wrap gap-4">
                        {values.images.map((image, index) => (
                            <div key={index} className="relative w-24 h-24">
                                <img
                                    src={typeof image === 'string'
                                        ? image
                                        : URL.createObjectURL(image)}
                                    alt={`uploaded-${index}`}
                                    className="w-full h-full object-cover rounded-md border border-gray-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteImage(index)}
                                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow hover:bg-red-100"
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ErrorMessage
                name="MainImage"
                component="div"
                className="text-red-500 text-sm"
            />
        </div>
    );
};

function Step3({ errors, touched, isSubmitting, values, setFieldValue, handleSubmit }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-8">
            <p className="font-semibold text-lg mx-4 md:mx-12 p-2 text-center">Basic Information
            </p>
            {/* Product Title */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Type className="w-4 h-4 text-blue-500" />
                    Product Title
                </label>

                <Field
                    as="textarea"
                    name="name"
                    rows="2"
                    maxLength="200"
                    placeholder="Enter a catchy and clear product name..."
                    className={`w-full p-4 bg-gray-50 border ${errors?.name && touched?.name
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200 focus:ring-[#F33E0A]"
                        } rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200`}
                />
                <div className="flex justify-between items-center">
                    <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-sm"
                    />
                    <p className="text-xs text-gray-400">{values?.name?.length || 0}/200</p>
                </div>
            </div>

            {/* Short Description */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FileText className="w-4 h-4 text-purple-500" />
                    Short Description
                </label>

                <Field
                    as="textarea"
                    name="shortDescription"
                    rows="4"
                    maxLength="1000"
                    placeholder="Briefly describe your product to attract buyers..."
                    className={`w-full p-4 bg-gray-50 border ${errors?.shortDescription && touched?.shortDescription
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200 focus:ring-[#F33E0A]"
                        } rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200`}
                />
                <div className="flex justify-between items-center">
                    <ErrorMessage
                        name="shortDescription"
                        component="div"
                        className="text-red-500 text-sm"
                    />
                    <p className="text-xs text-gray-400">{values?.shortDescription?.length || 0}/1000</p>
                </div>
            </div>
        </div>

    );
}


function Step4({ errors, touched, values, setFieldValue }) {


    useEffect(() => {
        const retail = Number(values?.retail);
        if (retail > 0) {
            const calculatedPrice = (retail * 0.1).toFixed(2)
            console.log(Number.parseFloat(Math.ceil(calculatedPrice)), 'calculatedPrice')
            setFieldValue("price", Number.parseFloat(Math.ceil(calculatedPrice)))
        }
    }, [values?.retail, setFieldValue]);

    const productConditionsStatus = [
        "New",
        "New with Tags",
        "Brand New",
        "New without Tags",
        "Factory-New",
        "Used",
        "Like New",
        "Very Good",
        "Good",
        "Acceptable",
        "Collectible",
        "Refurbished",
        "Reconditioned",
        "Restored",
        "Salvage",
        "Opened Box",
        "Vintage"
    ];


    return (

        <div className="bg-white p-5 rounded-lg shadow space-y-10">
            <p className="font-semibold text-lg mx-4 md:mx-12 p-2 text-center">
                Pricing & Condition
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Condition */}
                <div>
                    <label htmlFor="condition" className="block text-start text-sm text-gray-800 mb-2">
                        Condition
                    </label>
                    <Field
                        as="select"
                        id="condition"
                        name="condition"
                        className={`w-full p-4 bg-gray-50 border ${errors?.condition && touched?.condition
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-200 focus:ring-[#F33E0A]"
                            } rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200`}
                    >
                        <option value="">Select condition</option>
                        {productConditionsStatus?.map(e => <option value={e}>{e}</option>)}
                    </Field>
                    <ErrorMessage
                        name="condition"
                        component="div"
                        className="mt-1 text-sm text-red-600 flex items-center gap-1"
                    />
                </div>

                {/* Buyer Premium */}
                <div>
                    <label htmlFor="buyerPremium" className="block text-start text-sm text-gray-800 mb-2">
                        Buyer Premium
                    </label>
                    <Field
                        type="text"
                        id="buyerPremium"
                        readOnly
                        name="buyerPremium"
                        placeholder="e.g., 15%"
                        className={`w-full p-4 bg-gray-50 border ${errors?.buyerPremium && touched?.buyerPremium
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-200 focus:ring-[#F33E0A]"
                            } rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200`}
                    />
                    <ErrorMessage
                        name="buyerPremium"
                        component="div"
                        className="mt-1 text-sm text-red-600 flex items-center gap-1"
                    />
                </div>

                {/* Quantity */}
                <div>
                    <label htmlFor="quantity" className="block text-start text-sm text-gray-800 mb-2">
                        Quantity *
                    </label>
                    <Field
                        type="text"
                        id="quantity"
                        name="quantity"
                        placeholder="e.g., 1"
                        className={`w-full p-4 bg-gray-50 border ${errors?.quantity && touched?.quantity
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-200 focus:ring-[#F33E0A]"
                            } rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200`}
                        min="1"
                    />
                    <ErrorMessage
                        name="quantity"
                        component="div"
                        className="mt-1 text-sm text-red-600 flex items-center gap-1"
                    />
                </div>

                {/* Lot Fee */}
                <div>
                    <label htmlFor="lotfee" className="block text-start text-sm text-gray-800 mb-2">
                        Lot Fee ($)
                    </label>
                    <Field
                        type="number"
                        id="lotfee"
                        name="lotfee"
                        readOnly
                        placeholder="e.g., 3"
                        className={`w-full p-4 bg-gray-50 border ${errors?.lotfee && touched?.lotfee
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-200 focus:ring-[#F33E0A]"
                            } rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200`}
                    />
                    <ErrorMessage
                        name="lotfee"
                        component="div"
                        className="mt-1 text-sm text-red-600 flex items-center gap-1"
                    />
                </div>

                {/* Retail */}
                <div>
                    <label htmlFor="retail" className="block text-start text-sm text-gray-800 mb-2">
                        Retail Price ($)
                    </label>
                    <Field
                        type="text"
                        id="retail"
                        name="retail"
                        placeholder="e.g., 120.00"
                        className={`w-full p-4 bg-gray-50 border ${errors?.retail && touched?.retail
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-200 focus:ring-[#F33E0A]"
                            } rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200`}
                        step="0.01"
                    />
                    <ErrorMessage
                        name="retail"
                        component="div"
                        className="mt-1 text-sm text-red-600 flex items-center gap-1"
                    />
                </div>

                {/* Price */}
                <div>
                    <label htmlFor="price" className="block text-start text-sm text-gray-800 mb-2">
                        Starting Bid Price
                    </label>
                    <Field
                        type="number"
                        id="price"
                        name="price"
                        placeholder="e.g., 99.99"
                        className={`w-full p-4 bg-gray-50 border ${errors?.price && touched?.price
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-200 focus:ring-[#F33E0A]"
                            } rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200`}
                        step="0.01"
                    />
                    <ErrorMessage
                        name="price"
                        component="div"
                        className="mt-1 text-sm text-red-600 flex items-center gap-1"
                    />
                </div>
            </div>
        </div>


    );
}


function Step5({ errors, touched, values, setFieldValue, handleChange }) {
    const tagGroups = [
        "Pristine Condition",
        "Flawless",
        "Mint Condition",
        "Unused",
        "Excellent",
        "Well-maintained",
        "No Assembly Needed",
        "Functional",
        "Fully Tested",
        "No Damage",
        "In Package",
        "No Missing Parts",
        "Promotional/Sample",
        "Near Expiration/Expired",
        "Second Hand",
        "Gently Used",
        "Shows minimal signs of wear or use",
        "No visible signs of wear",
        "Original Condition Unaltered",
        "Moderately Used",
        "Inspected",
        "Tested & Working"
    ];

    const negativeTag = [
        "Malfunctioning",
        "Broken",
        "Damaged",
        "Some Imperfections",
        "Untested",
        "Performance Issues",
        "Non-functioning/Not Working",
        "Defective",
        "Not Working Correctly",
        "Incomplete/Missing Parts",
        "Scratched",
        "Cosmetic or Aesthetic Issues",
        "Needs Repair/Service",
        "Dented/Dinged",
        "Signs of Use",
        "Blemished",
        "Discolored/Faded",
        "Stained/Dirty",
        "Tarnished/Corroded",
        "Damaged Packaging",
        "Missing Original Packaging",
        "Used/Previously Owned",
        "Salvage",
        'Sold "As Is"',
        "No Return",
        "Minor Imperfections",
        "Residue/Sticky",
        "Chipped/Cracked",
        "Worn",
        "Surface Imperfections",
        "As Is. No Return"
    ];

    // Convert tag options for React Select
    const tagOptions = tagGroups.map(tag => ({
        label: tag,
        value: tag.toLowerCase().replace(/ /g, "")
    }));
    const negativeOptions = negativeTag.map(e => ({
        label: e,
        value: e.toLowerCase().replace(/ /g, "")
    }));

    return (
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg space-y-8 border border-gray-100">

            {/* Rating */}
            <div>
                <label htmlFor="rating" className="block text-sm font-semibold text-start text-gray-800 mb-2">
                    Rating (1–5)
                </label>
                <Field
                    type="text"
                    id="rating"
                    name="rating"
                    placeholder="e.g., 4"
                    className={`capitalize w-full p-4 bg-gray-50 border ${touched.ratring && errors.ratring
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200 focus:ring-[#F33E0A]"
                        } rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200`}
                    min="0"
                    max="5"
                />
                <ErrorMessage
                    name="rating"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                />
            </div>

            <div>
                <div>
                    <label className="block font-semibold mb-2">Positive Tags</label>
                    <CreatableSelect
                        options={tagOptions}
                        isMulti
                        placeholder="Select or type to create..."
                        value={values?.tag?.map(t => ({ label: t, value: t }))}
                        onChange={(selected) => {
                            const tags = selected?.map(s => s.value);
                            setFieldValue("tag", tags);
                        }}
                        className="text-sm text-start"
                        classNamePrefix="react-select"
                        styles={{
                            control: (base) => ({
                                ...base,
                                borderRadius: "0.75rem",
                                padding: "0.25rem",
                                borderColor: "red"
                            })
                        }}
                    />

                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                    {values?.tag?.map((tag) => (
                        <span
                            key={tag}
                            className="capitalize inline-flex items-center bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full  text-start"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() =>
                                    setFieldValue("tag", values?.tag?.filter(t => t !== tag))
                                }
                                className="ml-2 text-gray-600 hover:text-red-400"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <label className="block font-semibold mb-2">Negative Tags</label>
                <CreatableSelect
                    options={negativeOptions}
                    isMulti
                    placeholder="Select or type to create..."
                    value={values?.negativeTag?.map(t => ({ label: t, value: t }))}
                    onChange={(selected) => {
                        const tags = selected?.map(s => s.value);
                        setFieldValue("negativeTag", tags);
                    }}
                    className="text-sm text-start"
                    classNamePrefix="react-select"
                    styles={{
                        control: (base) => ({
                            ...base,
                            borderRadius: "0.75rem",
                            padding: "0.25rem",
                            borderColor: "red"
                        })
                    }}
                />
                <div className="flex flex-wrap gap-2 mt-3">
                    {values?.negativeTag?.map((tag) => (
                        <span
                            key={tag}
                            className="capitalize inline-flex items-center bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() =>
                                    setFieldValue(
                                        "negativeTag",
                                        values?.negativeTag?.filter(t => t !== tag)
                                    )
                                }
                                className="ml-2 hover:text-red-500"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}


function Step6() {
    const { values, handleChange } = useFormikContext();

    const shippingStatusOptions = [
        "Local Pickup Only",
        "Available For Shipping",
        "Freight",
    ];

    return (

        <div className="space-y-6">
            <p className="text-sm text-gray-500">
                Provide detailed information about your product including specifications
                and shipping details.
            </p>

            <FieldArray
                name="item_spec"
                render={(arrayHelpers) => (
                    <div className="bg-white shadow rounded-lg p-4 space-y-4 py-6">
                        <h2 className="text-lg font-semibold">Item Specifications</h2>
                        {values.item_spec?.map((item, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center"
                            >
                                <input
                                    name={`item_spec.${index}.name`}
                                    value={item.name}
                                    readOnly
                                    onChange={(e) =>
                                        arrayHelpers.replace(index, {
                                            ...item,
                                            name: e.target.value,
                                        })
                                    }
                                    className="input input-bordered w-full bg-gray-100 cursor-not-allowed p-3 capitalize text-md  rounded-2xl"
                                    placeholder="e.g., Brand, EAN/UPC, ASIN"
                                />
                                <input
                                    name={`item_spec.${index}.value`}
                                    value={item.value}
                                    onChange={(e) =>
                                        arrayHelpers.replace(index, {
                                            ...item,
                                            value: e.target.value,
                                        })
                                    }
                                    className={`w-full p-3 bg-gray-50 border  border-gray-200 focus:ring-[#F33E0A] rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200 px-3`} placeholder="Enter value"
                                />
                                <button
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)}
                                    className="text-red-500 text-sm hover:underline"
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => arrayHelpers.push({ name: "", value: "" })}
                            className="text-blue-600 text-sm hover:underline"
                        >
                            + Add Item Specification
                        </button>
                    </div>
                )}
            />

            <FieldArray
                name="shipping"
                render={(arrayHelpers) => (
                    <div className="bg-white shadow rounded-lg p-4 space-y-4 py-6">
                        <h2 className="text-lg font-semibold">Shipping Information</h2>
                        {values?.shipping?.map((item, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center"
                            >
                                <input
                                    name={`shipping.${index}.name`}
                                    value={item.name}
                                    readOnly
                                    onChange={(e) =>
                                        arrayHelpers.replace(index, {
                                            ...item,
                                            name: e.target.value,
                                        })
                                    }
                                    className="input input-bordered w-full bg-gray-100 cursor-not-allowed p-3 capitalize text-md  rounded-2xl"
                                    placeholder="e.g., Status, Location, Weight"
                                />
                                {item.name?.toLowerCase() === "status" ? (
                                    <select
                                        name={`shipping.${index}.value`}
                                        value={item.value}
                                        onChange={(e) =>
                                            arrayHelpers.replace(index, {
                                                ...item,
                                                value: e.target.value,
                                            })
                                        }
                                        className={`select select-bordered w-full p-3 bg-gray-50 border  border-gray-200 focus:ring-[#F33E0A] rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200 px-3`}
                                    >
                                        <option value="">Select status</option>
                                        {shippingStatusOptions?.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        name={`shipping.${index}.value`}
                                        value={item.value}
                                        onChange={(e) =>
                                            arrayHelpers.replace(index, {
                                                ...item,
                                                value: e.target.value,
                                            })
                                        }
                                        className={`w-full p-3 bg-gray-50 border  border-gray-200 focus:ring-[#F33E0A] rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200`}
                                        placeholder="Enter value"
                                    />
                                )}
                                <button
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)}
                                    className="text-red-500 text-sm hover:underline"
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => arrayHelpers.push({ name: "", value: "" })}
                            className="text-blue-600 text-sm hover:underline"
                        >
                            + Add Shipping Information
                        </button>
                    </div>
                )}
            />

            <FieldArray
                name="details"
                render={(arrayHelpers) => (
                    <div className="bg-white shadow rounded-lg p-4 space-y-4 py-6">
                        <h2 className="text-lg font-semibold">Additional Details</h2>
                        {values.details?.map((item, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center"
                            >
                                <input
                                    name={`details.${index}.name`}
                                    value={item.name}
                                    readOnly
                                    onChange={(e) =>
                                        arrayHelpers.replace(index, {
                                            ...item,
                                            name: e.target.value,
                                        })
                                    }
                                    className="input input-bordered w-full bg-gray-100 cursor-not-allowed p-3 capitalize text-md  rounded-2xl"
                                    placeholder="e.g., Model, Style, Size, Color"
                                />
                                <input
                                    name={`details.${index}.value`}
                                    value={item.value}
                                    onChange={(e) =>
                                        arrayHelpers.replace(index, {
                                            ...item,
                                            value: e.target.value,
                                        })
                                    }
                                    className={`w-full p-3 bg-gray-50 border  border-gray-200 focus:ring-[#F33E0A] rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200 px-3`}
                                    placeholder="Enter value"
                                />
                                <button
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)}
                                    className="text-red-500 text-sm hover:underline"
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => arrayHelpers.push({ name: "", value: "" })}
                            className="text-blue-600 text-sm hover:underline"
                        >
                            + Add More Details
                        </button>
                    </div>
                )}
            />
        </div>
    );
}

function Step7({ setStep }) {
    return (
        <div className="space-y-4">
            <button type='button' onClick={() => setStep(9)} className="cursor-pointer flex w-full justify-center rounded-md bg-orange-700 px-3 py-3 text-sm/6 font-semibold text-white shadow-xs hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700">
                PREVIEW LISTING
            </button>

        </div>
    );
}

// function Step15() {
//     return (
//         <div className="space-y-4">
//             <button className="flex w-full justify-center rounded-md bg-[#b1a646] px-3 py-3 text-sm/6 font-semibold text-white shadow-xs hover:bg-[#b1a011] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b1a646]">
//                 PRINT ITEM SKU
//                 <p>Using ZEBRA Label Printer</p>
//             </button>

//         </div>
//     );
// }

function Step8({ onBack, isLoading }) {
    const { submitForm } = useFormikContext()

    return (

        <div className="space-y-4">
            {/* <button className=" cursor-pointer flex w-full justify-center rounded-md bg-orange-700 px-3 py-3 text-sm/6 font-semibold text-white shadow-xs hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700">
                CREATE ANOTHER
                LISTING
            </button> */}

            <button
                type='submit'
                disabled={isLoading}
                className=" text-white font-bold text-xl py-5 w-full rounded bg-blue-900 cursor cursor-pointer"
            > {isLoading ? 'Saving...' : 'SAVE & EXIT'}
            </button>
        </div>
    );
}

function ListingPreview() {
    const { values } = useFormikContext();
    const { data: categories } = useGetIsAllCategoriesQuery();
    const { data: subcategories } = useGetIsAllSubCategoriesQuery(values.categoryId, {
        skip: !values.categoryId,
    });

    const categoryName = categories?.data?.find((cat) => cat._id === values.categoryId)?.name;
    const subcategoryName = subcategories?.data?.find((sub) => sub._id === values.subCategoryId)?.name;

    const Card = ({ title, children }) => (
        <div className="bg-white rounded-md shadow-md p-4 space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {children}
        </div>
    );

    const InfoRow = ({ label, value }) => (
        <div className="flex justify-between border-b border-gray-100 py-2 text-sm">
            <span className="font-medium text-gray-700">{label}:</span>
            <span className="text-gray-600 capitalize">{value || "Not specified"}</span>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div className="col-span-2">
                <h2 className="text-2xl font-bold">Product Listing Details</h2>
            </div>

            {/* Basic Info */}
            <Card title="📋 Basic Information">
                <InfoRow label="Product Name" value={values?.name} />
                <InfoRow
                    label="Category"
                    value={
                        categoryName
                        // ? `${selectedCategory.name}${selectedSubCategory ? ` > ${selectedSubCategory.name}` : ""}`
                        // : "Not selected"
                    }
                />
                <InfoRow
                    label="Sub Category"
                    value={
                        subcategoryName
                        // ? `${selectedCategory.name}${selectedSubCategory ? ` > ${selectedSubCategory.name}` : ""}`
                        // : "Not selected"
                    }
                />
                <InfoRow label="Short Description" value={values?.shortDescription} />
            </Card>

            {/* Images */}
            <Card title="📸 Images">
                <div>
                    <p className="text-sm font-medium mb-1">Main Image:</p>
                    {values?.mainImage ? (
                        <img
                            // src={values?.mainImage}
                            alt="Main"
                            className="w-20 h-20 object-cover rounded-md border"
                            src={typeof values?.mainImage === 'string'
                                ? values?.mainImage
                                : URL.createObjectURL(values?.mainImage)}
                        />
                    ) : (
                        <p className="text-gray-500 text-sm">No main image uploaded</p>
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium mb-1">Additional Images:</p>
                    <div className="flex flex-wrap gap-2">
                        {values?.images?.map((img, i) => (
                            <img
                                key={i}
                                src={typeof img === 'string'
                                    ? img
                                    : URL.createObjectURL(img)}
                                alt={`Additional ${i + 1}`}
                                className="w-16 h-16 object-cover rounded-md border"
                            />
                        ))}
                    </div>
                    <p className="text-xs text-gray-500">
                        {values?.images?.length || 0} additional images uploaded
                    </p>
                </div>
            </Card>


            <Card title="🏷️ Tags">
                <div className="flex flex-wrap gap-2">
                    {values?.tag.map((tag, i) => (
                        <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2">
                    {values?.negativeTag.map((tag, i) => (
                        <span key={i} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {tag}
                        </span>
                    ))}
                </div>
                <InfoRow label="Rating" value={values?.rating ? `${values?.rating}/5 ⭐` : "Not rated"} />
            </Card>


            {/* Pricing */}
            <Card title="💰 Pricing & Details">
                <InfoRow label="Starting Bid Price" value={`$${values?.price || "0.00"}`} />
                <InfoRow label="Retail Price" value={`$${values?.retail || "0.00"}`} />
                <InfoRow label="Buyer's Premium" value={values?.buyerPremium} />
                <InfoRow label="Quantity" value={`${values?.quantity || 0} units`} />
                <InfoRow label="Lot Fee" value={`$${values?.lotfee || 0}`} />
                <InfoRow label="Condition" value={values?.condition} />
            </Card>

            {/* Item Specifications */}
            <Card title="🔧 Item Specifications">
                {values?.item_spec?.length > 0 ? (
                    values.item_spec.map((spec, i) => (
                        <InfoRow
                            key={i}
                            label={spec.name?.toUpperCase()}
                            value={spec.value}
                        />
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No specifications added</p>
                )}
            </Card>

            {/* Shipping Info */}
            <Card title="🚚 Shipping Information">
                {values?.shipping?.length > 0 ? (
                    values.shipping.map((ship, i) => (
                        <InfoRow
                            key={i}
                            label={ship.name?.toUpperCase()}
                            value={ship.value}
                        />
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No shipping details added</p>
                )}
            </Card>

            {/* Additional Details */}
            <Card title="📝 Additional Details">
                {values?.details?.length > 0 ? (
                    values.details.map((detail, i) => (
                        <InfoRow
                            key={i}
                            label={detail.name?.toUpperCase()}
                            value={detail.value}
                        />
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No additional details added</p>
                )}
            </Card>

        </div>
    );
}

