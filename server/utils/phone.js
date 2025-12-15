import { parsePhoneNumberFromString } from "libphonenumber-js";

export const validatePhone = (phone, defaultCountry=undefined)=>{
    const parsedPhone = parsePhoneNumberFromString(phone, defaultCountry);

    if(!parsedPhone || !parsedPhone.isValid()) return false;

    return true;
}