import  * as yup from "yup";
import type { DictType } from '@/context/LanguageContext';

export const useSchema = (
  { consumableGood, quantity , receiveDate, receiver, unit} : DictType["crm"]["goods"]["form"]
) => {

  const schema = yup.object({
      consumableGoodId: yup.string().required(consumableGood.required),
      unitId: yup.string().required(unit.required),
      quantity: yup.number().typeError(quantity.typeError).required(quantity.required).positive(quantity.positive),
      receiveDate: yup.string().required(receiveDate.required),
      receiverId: yup
        .string()
        .uuid(receiver.uuuid)
        .required(receiver.required),
    });


    return { schema }
}