import axios from 'axios';
import { chain } from 'lodash';

type PageInsightsResponse = {
    data: {
        name: string;
        values: {
            value: number;
            end_time: string;
        }[];
    }[];
};

type GetPageInsightsOptions = {
    pageId: string;
    metrics: string[];
    start: string;
    end: string;
};

type PageInsights = { end_time: string } & {
    [key: string]: number;
};

export const get = async (options: GetPageInsightsOptions) => {
    const API_VERSION = 'v16.0';

    const { data } = await axios
        .request<PageInsightsResponse>({
            method: 'GET',
            url: `https://graph.facebook.com/${API_VERSION}/${options.pageId}/insights/`,
            params: {
                access_token: process.env.FB_PAGE_ACCESS_TOKEN,
                metric: options.metrics.join(','),
                since: options.start,
                until: options.end,
            },
        })
        .then((response) => response.data);

    return chain(data)
        .flatMap((metric) => {
            return metric.values.map((value) => ({
                [metric.name]: value.value,
                end_time: value.end_time,
            }));
        })
        .groupBy((row) => row.end_time)
        .values()
        .flatMap((dateValues) => {
            return dateValues.reduce((acc, cur) => ({ ...acc, ...cur }), {
                end_time: '',
            } as PageInsights);
        })
        .filter((row) => !!row.end_time)
        .value();
};
