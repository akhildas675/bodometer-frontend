import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { TableAction } from "@/components/ui/table/table.types";
import type { UpdateCategory } from "@/interface/admin.interface";
import adminServices from "@/services/admin/admin.services";

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
     onClick:(cat)=>{
       setModalConfig({
        isOpen:true,
        title:"Block category",
        message:`Are you sure you want to block ${cat.name}?`,
        variant:"danger",
        onConfirm:async()=>{
          try{
            await adminServices.toggleCategoryStatus(cat.categoryId)
            toast.success("Category blocked successfully");
            refetch();
          }catch{
            toast.error("Failed to block category");
          }
        }
       })
     }    
    },
    {
      label:"Unblock",
      variant:"primary",
      onClick:(cat)=>{
        setModalConfig({
          isOpen:true,
          title:"Unblock category",
          message:`Are you sure you want to unblock ${cat.name}?`,
          variant:"primary",
          onConfirm:async()=>{
            try{
              await adminServices.toggleCategoryStatus(cat.categoryId)
              toast.success("Category unblocked successfully");
              refetch();
            }catch{
              toast.error("Failed to unblock category");
            }
          }
        })
      }
    }
  ];
};
