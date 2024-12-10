import { toast } from "react-toastify";
import { postLoginAdminInstance, postLoginUserInstance } from "../utils/PostLoginAxios";
import { AxiosResponse } from "axios";

// Define utility types
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

// Common API response type
interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}



// Generic API function to get data
export const getDataApi = async <T>(
    url: string,
    setData: SetState<T>, // State setter to update data
    setLoading?: SetState<boolean> // Optional state setter to handle loading state
): Promise<void> => {
    try {
        setLoading?.(true); // If setLoading is provided, set loading to true
        const response = await postLoginUserInstance.get<ApiResponse<T>>(url);
        setData(response.data.data); // Update state with data
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        setData(null as unknown as T); // Reset state on error
    } finally {
        setLoading?.(false); // Set loading to false when done
    }
};

// Generic function for common authenticated APIs
export const commonApi = async <T>(
    url: string,
    data: Record<string, any> = {}, // Data to send in the request
    method: "post" | "get" | "put" | "patch" | "delete" = "post", // HTTP method
    setResult?: SetState<T>, // Optional state setter for result
    setLoading?: SetState<boolean> // Optional state setter for loading
): Promise<T | null> => { // Promise returns T or null in case of an error
    try {
        setLoading?.(true); // Set loading to true

        const response: AxiosResponse<ApiResponse<T>> = await postLoginUserInstance.request({
            url,
            method,
            data,
        });

        const result = response.data.data;
        setResult?.(result);
        return result;
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        setResult?.(null as unknown as T); // Reset state on error
        return null; // Explicitly return null in case of an error
    } finally {
        setLoading?.(false); // Set loading to false when done
    }
};

// Generic function for common authenticated APIs
export const commonAuthApi = async <T>(
    url: string,
    data: Record<string, any> = {}, // Data to send in the request
    method: "post" | "get" | "put" | "patch" | "delete" = "post", // HTTP method
    setResult?: SetState<T>, // Optional state setter for result
    setLoading?: SetState<boolean> // Optional state setter for loading
): Promise<void> => {
    try {
        setLoading?.(true); // Set loading to true
        const response = await postLoginAdminInstance.request<ApiResponse<T>>({
            url,
            method,
            data,
        });
        setResult?.(response.data.data); // Update state with response data
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        setResult?.(null as unknown as T); // Reset state on error
    } finally {
        setLoading?.(false); // Set loading to false when done
    }
};

// Generic POST API function with additional delete handling
export const commonPostApi = async <T>(
    url: string,
    data: Record<string, any> = {}, // Data to send in the request
    method: "post" | "put" | "patch" | "delete" = "post", // HTTP method
    setResult?: SetState<T>, // Optional state setter for result
    setLoading?: SetState<boolean> // Optional state setter for loading
): Promise<void> => {
    try {
        setLoading?.(true); // Set loading to true
        if (method.toLowerCase() === "delete") {
            const response = await postLoginAdminInstance.delete<ApiResponse<T>>(url);
            toast.success(response.data.message);
            setResult?.(response.data.data); // Update state with response data
        } else {
            const response = await postLoginAdminInstance.request<ApiResponse<T>>({
                url,
                method,
                data,
            });
            setResult?.(response.data.data); // Update state with response data
        }
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        setResult?.(null as unknown as T); // Reset state on error
    } finally {
        setLoading?.(false); // Set loading to false when done
    }
};
