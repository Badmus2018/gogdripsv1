"use client";

import Button from "@/app/components/button";
import Heading from "@/app/components/heading";
import TextArea from "@/app/components/inputs/text-area";
import { Rating } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";


interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdDate: string;
}

interface Product {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  price: number;
  dmc?: number;
  quantity?: number;
  reviews: Review[];
}

interface Order {
  id: string;
  amount: number;
  paymentConfirmed: boolean;
  deliveryStatus: string;
  cancelled?: boolean;
  products?: any[];
}

interface SafeUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
  accessiblePages?: string[];
  createdAt?: string;
}

interface AddRatingProps {
  product: Product;
  user:
    | (SafeUser & {
        orders: Order[];
      })
    | null;
}

const AddRating: React.FC<AddRatingProps> = ({ product, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      comment: "",
      rating: 0,
    },
  });

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldTouch: true,
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (!user) {
      setIsLoading(false);
      return toast.error("You must be logged in.");
    }

    if (userReview) {
      setIsLoading(false);
      return toast.error("You have already reviewed this product.");
    }

    if (!deliveredOrder) {
      setIsLoading(false);
      return toast.error("You have not recibed this product yet.");
    }

    if (data.rating === 0) {
      setIsLoading(false);
      return toast.error("No rating selected.");
    }
    const ratingData = { ...data, userId: user?.id, product: product };

    axios
      .post("/api/rating", ratingData)
      .then(() => {
        toast.success("Rating submitted.");
        router.refresh();
        reset();
      })
      .catch((error) => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (!product) return null;

  const deliveredOrder = user?.orders.some(
    (order) => {
      return (
        (order.products ?? [])
          .map((itemStr: any) => {
            let item = itemStr;
            if (typeof itemStr === "string") {
              try {
                item = JSON.parse(itemStr);
              } catch {
                item = {};
              }
            }
            return item;
          })
          .find((item: any) => item.id === product.id) &&
        order.deliveryStatus === "delivered"
      );
    }
  );

  const userReview = product?.reviews.find((review: Review) => {
    return review.userId === user?.id;
  });

  return (
    <div className="flex flex-col gap-3 max-w-[550px] h-full">
      <Heading title="Rate this product" />
      <div>
        <Rating
          onChange={(event, newValue) => setCustomValue("rating", newValue)}
        />
      </div>
      <TextArea
        id="comment"
        label="Comment"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Button
        label={isLoading ? "Loading..." : "Rate Product"}
        onClick={handleSubmit(onSubmit)}
      />
    </div>
  );
};

export default AddRating;
