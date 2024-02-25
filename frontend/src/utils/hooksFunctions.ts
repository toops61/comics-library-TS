import { useEffect } from "react";
import { useAppDispatch } from "../redux/hooks";
import { changeBodySize } from "./utilsFuncs";
import { updateGeneralParams } from "../redux/generalParamsSlice";

export const useStartFuncs = () => {
    const dispatch = useAppDispatch();

    const showAlert = (message:string,type:string) => {
        const alertType = type ? type : '';
        dispatch(updateGeneralParams({alertMessage:message,alertVisible:true,alertType}));
        setTimeout(() => {
        dispatch(updateGeneralParams({alertVisible:false}));
        }, 2000);
    };

    useEffect(() => {
        window.addEventListener('resize', changeBodySize);
        changeBodySize();

        return () => {
        window.removeEventListener('resize', changeBodySize);
        }
    }, []);

    return showAlert;
}