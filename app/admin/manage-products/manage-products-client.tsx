"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/utils/format-price";
import Heading from "@/app/components/heading";
import Status from "@/app/components/status";
import {
  RefreshCw,
  X,
  Trash2,
  Check,
  Pencil,
  Eye,
  EyeIcon,
  EyeOff,
} from "lucide-react";
import ActionButton from "@/app/components/action-button";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import AlertDialog from "@/app/components/alert-dialog";

interface ManageProductsClientProps {
  products: any[]; // Accept plain objects from server
}

const ManageProductsClient: React.FC<ManageProductsClientProps> = ({
  products,
}) => {
  const [open, setOpen] = useState(false);
  const [nameToDelete, setNameToDelete] = useState("");
  const [idToDelete, setIdToDelete] = useState("");
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();
  let rows: any = [];

  if (products) {
    rows = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: formatPrice(product.price),
        dmc: formatPrice((product as any).dmc || 0),
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
        isVisible: (product as any).isVisible ?? true,
        images: product.images,
        stock: (product as any).remainingStock ?? (product as any).stock ?? 0,
      };
    });
  }

  const handleToggleStock = useCallback((id: string, inStock: boolean) => {
    setLoadingActions((prev) => ({ ...prev, [`stock-${id}`]: true }));
    axios
      .put("/api/product", {
        id,
        inStock: !inStock,
      })
      .then((res) => {
        toast.success("Product status changed.");
        router.refresh();
      })
      .catch((error) => {
        toast.error("Oops! Something went wrong.");
        console.log(error);
      })
      .finally(() => {
        setLoadingActions((prev) => ({ ...prev, [`stock-${id}`]: false }));
      });
  }, [router]);

  const handleToggleVisibility = useCallback((id: string, isVisible: boolean) => {
    setLoadingActions((prev) => ({ ...prev, [`visibility-${id}`]: true }));
    axios
      .put("/api/product", {
        id,
        isVisible: !isVisible,
      })
      .then((res) => {
        toast.success("Product visibility changed.");
        router.refresh();
      })
      .catch((error) => {
        toast.error("Oops! Something went wrong.");
        console.log(error);
      })
      .finally(() => {
        setLoadingActions((prev) => ({ ...prev, [`visibility-${id}`]: false }));
      });
  }, [router]);

  const handleStockEdit = useCallback(async (params: any) => {
    // params: { id, field, value }
    const id = params.id as string;
    const newValue = Number(params.value);

    if (Number.isNaN(newValue) || newValue < 0) {
      toast.error("Invalid stock value");
      router.refresh();
      return;
    }

    try {
      await axios.put(`/api/product/${id}`, {
        remainingStock: newValue,
      });

      toast.success("Stock updated");
      router.refresh();
    } catch (error) {
      console.error("Failed to update stock", error);
      toast.error("Failed to update stock");
      router.refresh();
    }
  }, [router]);

  const handleDelete = useCallback(async (id: string, images: any[]) => {
    toast("Deleting product, please wait...");

    const handleImageDelete = async () => {
      try {
        for (const item of images) {
          if (item.image) {
            // Delete via server API
            await fetch("/api/upload", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: item.image }),
            });
          }
        }
      } catch (error) {
        return console.log("Deleting image error", error);
      }
    };

    await handleImageDelete();

    axios
      .delete(`/api/product/${id}`)
      .then((res) => {
        toast.success("Product status changed");
        router.refresh();
      })
      .catch((error) => {
        console.log(error);
      });
  }, [router]);

  const columns: GridColDef[] = [
    { 
      field: "id", 
      headerName: "ID", 
      width: 80,
      renderCell: (params) => {
        const id = params.row.id;
        return id ? id.slice(-5) : "N/A";
      },
    },
    { field: "name", headerName: "Name", width: 220 },
    {
      field: "price",
      headerName: "Price(₦)",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="font-bold text-slate-800">{params.row.price}</div>
        );
      },
    },
    {
      field: "dmc",
      headerName: "DMC(₦)",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="font-semibold text-blue-600">{params.row.dmc}</div>
        );
      },
    },
    { field: "category", headerName: "Category", width: 100 },
    { field: "brand", headerName: "Brand", width: 100 },
    {
      field: "inStock",
      headerName: "In Stock",
      width: 120,
      renderCell: (params) => {
        return (
          <div>
            {params.row.inStock === true ? (
              <Status
                text="in stock"
                icon={Check}
                bg="bg-teal-200"
                color="text-teal-700"
              />
            ) : (
              <Status
                text="out of stock"
                icon={X}
                bg="bg-rose-200"
                color="text-rose-700"
              />
            )}
          </div>
        );
      },
    },
    {
      field: "stock",
      headerName: "Stock",
      width: 120,
      editable: true,
      renderCell: (params) => {
        return <div className="font-bold">{params.row.stock}</div>;
      },
    },
    {
      field: "isVisible",
      headerName: "Visible",
      width: 120,
      renderCell: (params) => {
        return (
          <div>
            {params.row.isVisible ? (
              <Status
                text="visible"
                icon={EyeIcon}
                bg="bg-blue-200"
                color="text-blue-700"
              />
            ) : (
              <Status
                text="hidden"
                icon={EyeOff}
                bg="bg-gray-200"
                color="text-gray-700"
              />
            )}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex justify-between gap-4 w-full">
            <ActionButton
              icon={RefreshCw}
              onClick={() => {
                handleToggleStock(params.row.id, params.row.inStock);
              }}
              isLoading={loadingActions[`stock-${params.row.id}`]}
              label="Stock"
            />
            <ActionButton
              icon={params.row.isVisible ? EyeOff : EyeIcon}
              onClick={() => {
                handleToggleVisibility(params.row.id, params.row.isVisible);
              }}
              isLoading={loadingActions[`visibility-${params.row.id}`]}
              label="Visibility"
            />
            <ActionButton
              icon={Pencil}
              onClick={() => {
                router.push(`/admin/add-products/${params.row.id}`);
              }}
              label="Edit"
            />
            <ActionButton
              icon={Trash2}
              onClick={() => {
                setNameToDelete(params.row.name);
                setIdToDelete(params.row.id);
                setImagesToDelete(params.row.images);
                setOpen(true);
              }}
              label="Delete"
            />
            <ActionButton
              icon={Eye}
              onClick={() => {
                router.push(`product/${params.row.id}`);
              }}
              label="View"
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mb-4 mt-8">
        <Heading title="Manage Products" center />
      </div>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 9 },
            },
          }}
          pageSizeOptions={[9, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          {...({ onCellEditCommit: handleStockEdit } as any)}
        />
      </div>
      <AlertDialog
        open={open}
        setOpen={setOpen}
        action={"delete"}
        name={nameToDelete}
        handleOK={() => handleDelete(idToDelete, imagesToDelete)}
      />
    </div>
  );
};

export default ManageProductsClient;
