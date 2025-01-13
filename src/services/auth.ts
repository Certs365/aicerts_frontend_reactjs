import { toast } from "react-toastify";
import { preLoginUserInstance } from "../utils/PreLoginUserAxios";
import { useRouter } from "next/router";
import { States, StateSetters } from '../utils/types';
import { commonApi } from "./common";
import { TWO_FACTOR_AUTH } from "@/utils/Constants";
import axios from "axios";
interface LoginData {
    JWTToken?: string;
    [key: string]: any;
    message?: string
}

interface LoginResponse {
    data: LoginData;
    message?: string;
    JWTToken?: string;
}

interface VerifyOtpResponse {
    data: LoginData;
    message?: string;
}

interface ResetPasswordResponse {
    data: {
        message?: string;
    };
}


export const loginApi = async (
    data: Record<string, any>,
    stateSetters?: StateSetters,
): Promise<LoginData | null> => {
    try {
        // Example of setting loading state
        if (stateSetters?.setLoading) stateSetters.setLoading(true);

        const response = await preLoginUserInstance.post<LoginResponse>('/api/login', data);
        const responseData = response?.data?.data;
        if (responseData?.JWTToken) {
            const response = await commonApi(TWO_FACTOR_AUTH, { email: data?.email }, 'post');
            toast.success("OTP send to your registered email successfully", {
                style: { fontSize: "16px" },
            })
            stateSetters?.setUser?.(responseData);
            stateSetters?.setTimer?.(60);
            stateSetters?.setShowVerify?.(true);

            return responseData;
        } else {
             
            toast.error(response?.data?.message || "Login failed", {
                style: { fontSize: "16px" },
            });

            return null;
        }
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong", {
            style: { fontSize: "16px" },
        });
        
 
        return null;
    } finally {
        if (stateSetters?.setLoading) stateSetters.setLoading(false);
    }
};


export const verifyOtpApi = async (
    data: Record<string, any>,
    states?: States,
    stateSetters?: StateSetters,
    router?: ReturnType<typeof useRouter>
): Promise<boolean> => {
    try {
        if (stateSetters?.setLoading) stateSetters.setLoading(true);
        const response = await preLoginUserInstance.post<VerifyOtpResponse>(
            `/api/verify-issuer`,
            data
        );
        if (response) {
            localStorage.setItem('token', states?.user?.JWTToken);
            localStorage.setItem('user', JSON.stringify(states?.user));
            toast.success(response?.data?.message || "OTP verified successfully", {
                style: { fontSize: "16px" },
            });
            router?.push("/dashboard");
            return true;
        }
        return false;
    } catch (error: any) {
        // Accessing message from error response data
        toast.error(error?.response?.data?.message || "Something went wrong", {
            style: { fontSize: "16px" },
        });
        return false;
    } finally {
        if (stateSetters?.setLoading) stateSetters.setLoading(false);
    }
};


export const resetPasswordApi = async (token: string, data: Record<string, any>): Promise<boolean> => {
    try {
        const response = await preLoginUserInstance.put<ResetPasswordResponse>(
            `/admin/user/reset-password/${token}`,
            data
        );
        // Accessing message from response.data.data.message
        toast.success(response.data.data.message || "Password reset successfully", {
            style: { fontSize: "16px" },
        });
        return true;
    } catch (error: any) {
        // Accessing message from error response data
        toast.error(error?.response?.data?.message || "Something went wrong", {
            style: { fontSize: "16px" },
        });
        return false;
    }
};

