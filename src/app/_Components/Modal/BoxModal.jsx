import React from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { toast } from "react-hot-toast"
import Select from "react-select";
import { useAllFilterProductQuery } from '@/app/_Services/StoreProduct/page'
import { useAddBoxProductMutation, useUpdateProductBoxMutation } from '@/app/_Services/Box/page'
import ModalShell from "./ModalShell"
import { fleet, modalSelectStyles } from "../fleet/fleetTheme"

const appointmentSchema = Yup.object().shape({
  notes: Yup.string().required('Notes is Required'),
})

const BoxModal = ({ isModalOpen, editingBox, closeModal, refetch }) => {
  const [updateProductBox, { isLoading: updateLoading }] = useUpdateProductBoxMutation()
  const [addBoxProduct, { isLoading: addLoading }] = useAddBoxProductMutation()
  const { data } = useAllFilterProductQuery()

  const handleSubmit = async (values, { resetForm }) => {
    try {
      let response;

      if (editingBox) {
        response = await updateProductBox({
          id: editingBox._id,
          notes: values?.notes,
          products: values?.products?.map(e => e?.value)
        }).unwrap();
      } else {
        response = await addBoxProduct({ notes: values?.notes, products: values?.products?.map(e => e?.value) }).unwrap();
      }

      if (response.success) {
        toast.success(editingBox ? "Product Box updated successfully!" : "Product Box created successfully!");
        resetForm();
        closeModal();
        refetch();
      } else {
        toast.error(response.message || "Failed to process request");
      }
    } catch (error) {
      toast.error(error.data?.message || "An error occurred");
    }
  };

  const productsOptions = data?.data?.map(tag => ({
    label: `${tag?.sku} | ${tag?.name} `,
    value: tag?._id
  }));

  return (
    <ModalShell
      isOpen={isModalOpen}
      onClose={closeModal}
      title={editingBox ? "Edit Box" : "Create Box"}
      maxWidthClass="max-w-2xl"
      zClass="z-50"
    >
      <Formik
        initialValues={{
          products: editingBox?.products
            ? editingBox.products.map(e => ({
              label: `${e?.sku} | ${e?.name}`,
              value: e?._id,
            }))
            : [],
          notes: editingBox?.notes || "",
        }}
        validationSchema={appointmentSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue }) => (
          <Form
            className="space-y-6"
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
          >
            <div>
              <label htmlFor="notes" className={fleet.modalLabel}>
                Please describe the content of the box?
              </label>
              <Field
                as="textarea"
                id="notes"
                name="notes"
                rows="4"
                className={fleet.modalTextarea}
                placeholder="describe the content of the box..."
              />
              <ErrorMessage name="notes" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label className={fleet.modalLabel}>Products</label>
              <Select
                options={productsOptions}
                isMulti
                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                placeholder="Select or type to add..."
                value={values.products}
                onChange={(selected) => {
                  setFieldValue("products", selected || []);
                }}
                className="text-sm text-start capitalize"
                classNamePrefix="react-select"
                styles={modalSelectStyles}
              />

              <div className="flex flex-wrap gap-2 mt-3">
                {values?.products?.map((p) => (
                  <span
                    key={p.value}
                    className="inline-flex items-center bg-[#1c2330] text-zinc-200 border border-white/10 text-sm px-3 py-1 rounded-full text-start"
                  >
                    {p.label}
                    <button
                      type="button"
                      onClick={() =>
                        setFieldValue("products", values.products.filter(prod => prod.value !== p.value))
                      }
                      className="ml-2 text-zinc-400 hover:text-white"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.06]">
              <button type="button" onClick={closeModal} className={fleet.modalCancelBtn}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={editingBox ? updateLoading : addLoading}
                className={fleet.modalPrimaryBtn}
              >
                {editingBox
                  ? (updateLoading ? "Updating..." : "Update Box")
                  : (addLoading ? "Creating..." : "Create Box")}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </ModalShell>
  )
}

export default BoxModal
