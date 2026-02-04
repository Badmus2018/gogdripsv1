"use client";

import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import Button from "@/app/components/button";
import Header from "@/app/components/heading";
import CategoryInput from "@/app/components/inputs/category-input";
import * as Icons from "lucide-react";
import CustomCheckbox from "@/app/components/inputs/custom-checkbox";
import Input from "@/app/components/inputs/input";
import TextArea from "@/app/components/inputs/text-area";

// Use central ImageType definition
import { ImageType } from "@/app/types/image-type";

interface EditProduct {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  inStock: boolean;
  stock?: number;
  remainingStock?: number;
  isVisible?: boolean;
  image?: string; // single image string
  price: number;
  dmc?: number;
  discount?: number;
}

const EditProductForm = ({ product }: { product: EditProduct }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<ImageType>(null);
  const [oldImage, setOldImage] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<{ label: string; icon: string }[]>([]);

  // Helper to get icon component from string
  const getIconComponent = (iconName: string) => {
    return (Icons as any)[iconName] || Icons.Circle;
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        const allCategory = { label: "All", icon: "Circle" };
        if (!data || !Array.isArray(data) || data.length === 0) {
          setCategories([allCategory]);
        } else {
          const filtered = data.filter((cat: any) => cat.label !== "All");
          setCategories([allCategory, ...filtered]);
        }
      } catch (err) {
        setCategories([{ label: "All", icon: "Circle" }]);
      }
    };
    fetchCategories();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      category: "",
      inStock: false,
      stock: 0,
      isVisible: true,
      price: "",
      dmc: "",
      discount: "",
    },
  });

  const setCustomValue = useCallback((id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [setValue]);

  useEffect(() => {
    setCustomValue("name", product.name);
    setCustomValue("description", product.description);
    setCustomValue("brand", product.brand);
    setCustomValue("category", product.category);
    setCustomValue("inStock", product.inStock);
    setCustomValue("stock", (product as any).stock ?? (product as any).remainingStock ?? 0);
    setCustomValue("isVisible", (product as any).isVisible ?? true);
    setCustomValue("price", product.price);
    setCustomValue("dmc", (product as any).dmc || 0);
    setOldImage(product.image);
  }, [product, setCustomValue]);

  useEffect(() => {
    setCustomValue("image", image);
  }, [image, setCustomValue]);

  const category = watch("category");

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    if (!data.category) {
      setIsLoading(false);
      return alert("Category is not selected!");
    }
    if (!image && !oldImage) {
      setIsLoading(false);
      return alert("No image selected!");
    }
    let imageUrl = oldImage;
    if (image && typeof image !== "string") {
      const formData = new FormData();
      formData.append("file", image);
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("Upload failed");
        const { url } = await response.json();
        imageUrl = url;
      } catch (error) {
        setIsLoading(false);
        alert("Image upload failed");
        return;
      }
    }
    if (image && oldImage && typeof image !== "string") {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: oldImage }),
        });
      } catch (e) {
        // Log but don't block update
        console.error("Failed to delete old image", oldImage, e);
      }
    }
    const dmc = data.dmc === "" || data.dmc === 0 ? 0 : Number(data.dmc);
    const discount = data.discount === "" || data.discount === 0 ? 0 : Number(data.discount);
    const productData = {
      ...data,
      image: imageUrl,
      dmc: dmc,
      discount: discount,
      stock: data.stock !== undefined ? Number(data.stock) : undefined,
      remainingStock:
        data.remainingStock !== undefined
          ? Number(data.remainingStock)
          : undefined,
    };
    axios
      .put("/api/product/" + product.id, productData)
      .then(() => {
        alert("Product edited successfully");
        router.back();
      })
      .catch((error) => {
        alert("Oops! Something went wrong.");
        console.log("Error editing product", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Header title="Edit a Product" center />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <div className="flex w-full gap-3">
        <Input
          id="price"
          label="Price"
          disabled={isLoading}
          register={register}
          errors={errors}
          type="number"
          required
        />
        <Input
          id="discount"
          label="Discount"
          disabled={isLoading}
          register={register}
          errors={errors}
          type="number"
        />
        <Input
          id="dmc"
          label="DMC"
          disabled={isLoading}
          register={register}
          errors={errors}
          type="number"
        />
        <Input
          id="stock"
          label="No. in Stock"
          disabled={isLoading}
          register={register}
          errors={errors}
          type="number"
        />
      </div>
      <Input
        id="brand"
        label="Brand"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <TextArea
        id="description"
        label="Description"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <CustomCheckbox
        id="inStock"
        register={register}
        label="This product is in stock"
      />
      <CustomCheckbox
        id="isVisible"
        register={register}
        label="Make this product visible to customers"
      />
      <div className="w-full font-medium">
        <div className="mb-2 font-semibold">Select a Category</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto">
          {categories.map((item) => {
            if (item.label === "All") {
              return null;
            }
            return (
              <div key={item.label} className="col-span">
                <CategoryInput
                  onClick={(category) => setCustomValue("category", category)}
                  selected={category === item.label}
                  label={item.label}
                  icon={getIconComponent(item.icon)}
                />
              </div>
            );
          })}
        </div>
        <div className="w-full flex flex-col gap-4 mt-5">
          <div className="font-bold">Product Image</div>
          <div className="text-small mb-2">Upload a single image for this product.</div>
          <input
            type="file"
            accept="image/*"
            disabled={isLoading}
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0]);
              }
            }}
          />
          {oldImage && !image && (
            <div className="mt-2">
              <span className="text-xs">Current image:</span>
              <img src={oldImage} alt="Current product" className="w-32 h-32 object-cover rounded mt-1" />
            </div>
          )}
          {image && typeof image !== "string" && (
            <div className="mt-2">
              <span className="text-xs">Selected image:</span>
              <img src={URL.createObjectURL(image)} alt="Selected" className="w-32 h-32 object-cover rounded mt-1" />
            </div>
          )}
        </div>
      </div>
      <Button
        label={isLoading ? "Loading..." : "Save Product"}
        disabled={isLoading}
        onClick={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default EditProductForm;