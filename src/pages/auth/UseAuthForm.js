import { useState } from "react"

export default function UseAuthForm({
    intialValues,
    validate,
    onSubmit,
    fallbackError='Something went wrong. Please try again',
}) {

    const [values,setValues]=useState(intialValues);
    const [errors,setErrors]=useState({});
    const [formError,setFormError]=useState("");
    const [loading,setLoading]=useState(false);


    //INPUT FIELD CHANGE HANDLER
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setValues((prev) => ({...prev,[name]: type === "checkbox" ? checked : value,}));
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setFormError("");
    };

    //SUBMIT HANDLER
    const HandleSubmit = async (e)=>{
        e.preventDefault()

        const validateErrors = validate(values);
        setErrors(validateErrors);
        if (Object.keys(validateErrors).length>0)return;

        setLoading(true)
        setFormError("")

        try {
            await onSubmit(values)
        } catch (error) {
            setFormError(error.message || fallbackError);
        }finally{
            setLoading(false)
        }
    }


  return({values,errors,formError,loading,handleInputChange,HandleSubmit})
}
