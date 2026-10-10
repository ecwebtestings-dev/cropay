const PhoneRegex = /^\+?[0-9\s-]{9,15}$/

export const ValidatePhone =(value="")=>{
    const phone =value.trim();

    if(!phone) return 'Phone number required';
    if(!PhoneRegex.test(phone)) return 'Invalid phone number'
    return "";
}