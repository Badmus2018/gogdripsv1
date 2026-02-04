"use client";

import Button from "@/app/components/button";
import Header from "@/app/components/heading";
import CategoryInput from "@/app/components/inputs/category-input";
import CustomCheckbox from "@/app/components/inputs/custom-checkbox";
import Input from "@/app/components/inputs/input";
import TextArea from "@/app/components/inputs/text-area";
import { CATEGORY_ICONS } from "@/app/actions/category-icons";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const AddProductForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<{ label: string; icon: string }[]>([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        // Always include 'All' as the first category
        let allCategory = { label: "All", icon: "Store" };
        let filtered = Array.isArray(data) ? data.filter(cat => cat.label !== "All") : [];
        setCategories([allCategory, ...filtered]);
      } catch {
        setCategories([{ label: "All", icon: "Store" }]);
      }
    };
    fetchCategories();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      category: "All",
      inStock: false,
      isVisible: true,
      stock: 0,
      price: "",
      dmc: "",
      discount: "",
    },
  });

  const setCustomValue = useCallback(
    (id: string, value: any) => {
      setValue(id, value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [setValue]
  );

  const category = watch("category");

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!image) {
      toast.error("Product image is required");
      return;
    }

    setIsLoading(true);
    toast.loading("Creating product...");

    try {
      console.log("FORM DATA:", data);

      const formData = new FormData();
      formData.append("file", image);

      console.log("Uploading image...");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      console.log("Upload response:", uploadRes);

      if (!uploadRes.ok) {
        const err = await uploadRes.text();
        console.error("Upload failed:", err);
        throw new Error("Image upload failed");
      }

      const uploadData = await uploadRes.json();
      console.log("Upload data:", uploadData);

      const productData = {
        ...data,
        image: uploadData.url || uploadData.imageUrl,
        category: data.category || "All",
        price: Number(data.price || 0),
        stock: Number(data.stock || 0),
        dmc: Number(data.dmc || 0),
        discount: Number(data.discount || 0),
      };

      console.log("Product payload:", productData);

      const res = await axios.post("/api/product", productData);
      console.log("Product created:", res.data);

      toast.success("Product created");
      router.push("/admin/manage-products");
    } catch (error: any) {
      if (error && typeof error === 'object' && 'response' in error && error.response) {
        console.error("CREATE PRODUCT ERROR:", error.response.data);
        toast.error(error.response.data?.message || "Failed to create product");
      } else {
        console.error("CREATE PRODUCT ERROR:", error);
        toast.error("Failed to create product");
      }
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Header title="Add Product" center />

      <Input id="name" label="Product Name" register={register} errors={errors} required />
      <TextArea id="description" label="Description" register={register} errors={errors} required />

      <Input id="brand" label="Brand" register={register} errors={errors} required />

      <style jsx>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
      <div className="grid grid-cols-2 gap-4">
        <Input id="price" label="Price" type="number" register={register} errors={errors} required />
        <Input id="stock" label="Stock" type="number" register={register} errors={errors} />
        <Input id="discount" label="Discount" type="number" register={register} errors={errors} />
        <Input id="dmc" label="DMC" type="number" register={register} errors={errors} />
      </div>

      <div className="flex gap-4 mt-4">
        <CustomCheckbox id="inStock" register={register} label="In Stock" />
        <CustomCheckbox id="isVisible" register={register} label="Visible to customers" />
      </div>

      <div className="mt-6">
        <label htmlFor="category" className="block mb-2 font-medium text-slate-700">Category</label>
        <select
          id="category"
          {...register("category")}
          className="w-full p-2 border rounded"
          disabled={isLoading}
          value={category}
          onChange={e => setCustomValue("category", e.target.value)}
        >
          {categories.map((item) => (
            <option key={item.label} value={item.label}>{item.label}</option>
          ))}
        </select>
        {/* Category is now optional, no error shown */}
      </div>

      <div className="mt-6">
        <input
          type="file"
          accept="image/*"
          disabled={isLoading}
          onChange={(e) => e.target.files && setImage(e.target.files[0])}
        />
        {image && (
          <img
            src={URL.createObjectURL(image)}
            className="mt-3 max-w-xs rounded"
            alt="Preview"
          />
        )}
      </div>

      <div className="mt-8">
        <Button
          label={isLoading ? "Creating..." : "Add Product"}
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default AddProductForm;
