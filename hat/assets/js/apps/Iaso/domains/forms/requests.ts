import { useMutation, useQuery } from 'react-query';
import { createFormVersion, iasoGetRequest, updateFormVersion } from '../../utils/requests';

export type Project={
    id:number,
    name:string,
    app_id:string
}

export type OrgUnitType = {
    id:number,
    depth:number|null,
    name:string,
    short_name:string,
    created_at:number,
    updated_at:number,
    sub_unit_types?:OrgUnitType[]
}

export type FormDetails = {
    id:number,
    name:string,
    org_unit_types:OrgUnitType[],
    label_keys:string[] | null, 
    period_type:string|null,
    derived:boolean,
    single_per_period:boolean,
    periods_before_allowed?:number, // smae as periods_before_allowed:number|null, except it will also accept undefined. Is maybe a bit better performance wise
    periods_after_allowed?:number,
    device_field?:string,
    location_field:string,
    possible_fields:string[],
    projects:Project[]
}

export const fetchFormDetails = async (formId:string):Promise<FormDetails> => {
    return iasoGetRequest({
        requestParams: {
            // eslint-disable-next-line max-len
            url: `/api/forms/${formId}/?fields=id,name,org_unit_types,projects,period_type,derived,single_per_period,periods_before_allowed,periods_after_allowed,device_field,location_field,label_keys,possible_fields`,
        },
        disableSuccessSnackBar: true,
        errorKeyMessage: 'Fetch form details',
        consoleError: 'fetchFormDetails',
    });
};

export const useFetchFormDetails = (formId:string, enabled:boolean) => {
    // useQuery<FormDetails,any> will work, but there are other generic types to override that can create headaches in some use cases
    // The best result is achieved by typing the query function:
    return useQuery(['fetchFormDetails', formId], async ()=>fetchFormDetails(formId), {enabled})
}
// Compare with existing useAPI hook
// const { data: form, isLoading: isFormLoading } = useAPI<FormDetails>(
//     fetchFormDetails,
//     params.formId,
//     {
//         preventTrigger: !(params.formId && params.formId !== '0'),
//         additionalDependencies: [],
//     },
// );

// the 2 types below could be more detailed by looking at the data the API actually accepts
export type FormVersionPostData = {
    xls_file:any,
    data:any
}

export interface FormVersionPutData  {
    id:number,
    form_id:number,
}

export const useCreateFormVersion = ()=>{
    return useMutation(['createFormVersion'],(formVersionData:FormVersionPostData)=>createFormVersion(formVersionData));
}
export const useUpdateFormVersion = (formId:number)=>{
    return useMutation(['updateFormVersion',formId],(data:FormVersionPutData)=>updateFormVersion(data));
}