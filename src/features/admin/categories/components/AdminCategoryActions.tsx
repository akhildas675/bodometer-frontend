import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { TableAction } from "@/components/ui/DataTable.types";
import { UpdateCategory } from "@/features/admin/categories/types/category.types";


import { parseApiError } from "@/infrastructure/api/api-error";
import { categoryService } from "@/features/admin/categories/services/category.service";

export type CategoryModalConfig = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant?: "danger" | "primary";
};

export const useCategoryActions = (
  refetch: () => void,
  setModalConfig: React.Dispatch<React.SetStateAction<CategoryModalConfig>>
): TableAction<UpdateCategory>[] => {
  const navigate = useNavigate();

  return [
    {
      label: "Edit",
      variant: "primary",
      onClick: (cat) => {
        navigate(`/admin/category/edit/${cat.categoryId}`);
      },
    },
    {
     label:"Block",
     variant:"danger",
     visible: (cat) => cat.isActive !== false,
     onClick:(cat)=>{
       setModalConfig({
        isOpen:true,
        title:"Block category",
        message:`Are you sure you want to block ${cat.name}?`,
        variant:"danger",
        onConfirm:async()=>{
          try{
            const res = await categoryService.toggleCategoryStatus(cat.categoryId)
            toast.success(res.message);
            refetch();
          }catch (error: unknown) {
            const apiError = parseApiError(error);
            toast.error(apiError.message);
          }
        }
       })
     }    
    },
    {
      label:"Unblock",
      variant:"primary",
      visible: (cat) => cat.isActive === false,
      onClick:(cat)=>{
        setModalConfig({
          isOpen:true,
          title:"Unblock category",
          message:`Are you sure you want to unblock ${cat.name}?`,
          variant:"primary",
          onConfirm:async()=>{
            try{
              const res = await categoryService.toggleCategoryStatus(cat.categoryId)
              toast.success(res.message);
              refetch();
            }catch (error: unknown) {
              const apiError = parseApiError(error);
              toast.error(apiError.message);
            }
          }
        })
      }
    }
  ];
};
