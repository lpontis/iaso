import { sendRequest } from '../utils/networking';
import { useSnackMutation } from '../../../../../hat/assets/js/apps/Iaso/libs/apiHooks';

// This retrieve data but since it contact data from an external service this is
// implemented as a post
export const useGetPreparednessData = () => {
    return useSnackMutation(
        googleSheetURL =>
            sendRequest('POST', '/api/polio/campaigns/preview_preparedness/', {
                google_sheet_url: googleSheetURL,
            }),
        null,
    );
};

export const useGeneratePreparednessSheet = campaign_id => {
    return useSnackMutation(googleSheetURL =>
        sendRequest(
            'POST',
            `/api/polio/campaigns/${campaign_id}/create_preparedness_sheet/`,
            {
                google_sheet_url: googleSheetURL,
            },
        ),
    );
};

// This retrieve data but since it contact data from an external service this is
// implemented as a post
export const useSurgeData = () => {
    return useSnackMutation(
        (body, countryName) =>
            sendRequest('POST', '/api/polio/campaigns/preview_surge/', body),
        null,
    );
};
