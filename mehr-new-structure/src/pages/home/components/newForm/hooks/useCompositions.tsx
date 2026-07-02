import { usePostQuery } from './queries/usePostQuery';
import { useGetQuery } from './queries/useGetQuery';
import { useEditQuery } from './queries/useEditQuery';
import { useLanguageContext } from '@/context/LanguageContext';
import { useSchema } from './useSchema';
import { useFields } from './useFields';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { DEFAULT_VALUE } from "../helpers/defaultValues";
import { useMemo } from 'react';


export const useCompositions = () => {
    const { data: getData, isPending: isGetPending } = useGetQuery();
    const { isPending: isPostPending } = usePostQuery();
    const { isPending: isEditPending } = useEditQuery();
    const { dict } = useLanguageContext();
    const { goods } = dict.crm;
    const { consumableGood, unit, quantity, receiveDate, receiver, registerRequest } = goods.form
    const { schema } = useSchema({consumableGood, unit, quantity, receiveDate, receiver});
    const { fields } = useFields(dict);


    const handleSubmit = () => {
        if(id) {
          useMutation()  
        } else {
            useMutation() 
        }
    };

    const defaultValues = useMemo();
    

    const formMethods = useForm({
        resolver: yupResolver(schema),
        defaultValues: getData,
    }) 

    return {
        isGetPending,
        isPostPending,
        isEditPending,
        fields,
        formMethods,
        handleSubmit,
        registerRequest
    };
}