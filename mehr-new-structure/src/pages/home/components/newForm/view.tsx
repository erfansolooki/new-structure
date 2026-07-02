import { useCompositions } from './hooks/useCompositions';
import FormConfigProvider from '@/libs/shared-components/form/providers/FormConfigProvider';
import { FormRenderer } from '@/libs/shared-components/form';

export const NewForm = () => {
     const { 
        fields,
        formMethods,
        handleSubmit,
        registerRequest,
        isEditPending,
        isGetPending,
        isPostPending,
    } = useCompositions();

    return (
        <FormConfigProvider formMethods={formMethods}>
            <FormRenderer onSubmit={handleSubmit} fields={fields}>
            <div className="flex items-center justify-center col-span-2 mt-5">
                <Button color="secondary" type="submit" disabled={isEditPending || isGetPending || isPostPending}>
                {registerRequest}
                </Button>
            </div>
            </FormRenderer>
        </FormConfigProvider>
    )
}