import dayjs from 'dayjs';

import { get } from './facebook.repository';
import { load } from '../bigquery/bigquery.service';

type PipelineOptions = {
    start?: string;
    end?: string;
};

export const pipelineService = async (options: PipelineOptions) => {
    const [start, end] = [
        options.start ? dayjs(options.start) : dayjs().subtract(3, 'days'),
        options.end ? dayjs(options.end) : dayjs(),
    ];

    return get({
        metrics: [
            'page_engaged_users',
            'page_post_engagements',
            'page_impressions',
            'page_impressions_paid',
            'page_impressions_organic',
            'page_impressions_viral',
            'page_posts_impressions',
            'page_posts_impressions_paid',
            'page_posts_impressions_organic',
            'page_posts_impressions_viral',
            'post_impressions',
            'post_impressions_paid',
            'post_impressions_organic',
            'post_impressions_viral',
            'page_actions_post_reactions_total',
            'page_fans',
            'page_fan_removes',
            'page_video_views',
            'page_video_views_paid',
            'page_video_views_organic',
            'page_video_complete_views_30s',
            'page_video_complete_views_30s_paid',
            'page_video_complete_views_30s_organic',
        ],
        pageId: '284846431694459',
        start: start.format('YYYY-MM-DD'),
        end: end.format('YYYY-MM-DD'),
    })
        .then((rows) => {
            return rows.map((row) => ({
                ...row,
                end_time: dayjs(row.end_time).format('YYYY-MM-DDTHH:mm:ss[Z]'),
            }));
        })
        .then((data) => {
            const table = `PageInsights`;

            return load(data, {
                table,
                schema: [
                    { name: 'end_time', type: 'TIMESTAMP' },
                    { name: 'page_engaged_users', type: 'INT64' },
                    { name: 'page_post_engagements', type: 'INT64' },
                    { name: 'page_impressions', type: 'INT64' },
                    { name: 'page_impressions_paid', type: 'INT64' },
                    { name: 'page_impressions_organic', type: 'INT64' },
                    { name: 'page_impressions_viral', type: 'INT64' },
                    { name: 'page_posts_impressions', type: 'INT64' },
                    { name: 'page_posts_impressions_paid', type: 'INT64' },
                    { name: 'page_posts_impressions_organic', type: 'INT64' },
                    { name: 'page_posts_impressions_viral', type: 'INT64' },
                    {
                        name: 'page_actions_post_reactions_total',
                        type: 'record',
                        fields: [
                            { name: 'like', type: 'INT64' },
                            { name: 'love', type: 'INT64' },
                            { name: 'wow', type: 'INT64' },
                            { name: 'haha', type: 'INT64' },
                            { name: 'sorry', type: 'INT64' },
                            { name: 'anger', type: 'INT64' },
                        ],
                    },
                    { name: 'page_fans', type: 'INT64' },
                    { name: 'page_fan_removes', type: 'INT64' },
                    { name: 'page_video_views', type: 'INT64' },
                    { name: 'page_video_views_paid', type: 'INT64' },
                    { name: 'page_video_views_organic', type: 'INT64' },
                    { name: 'page_video_complete_views_30s', type: 'INT64' },
                    { name: 'page_video_complete_views_30s_paid', type: 'INT64' },
                    { name: 'page_video_complete_views_30s_organic', type: 'INT64' },
                ],
            });
        });
};
