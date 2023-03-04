import { pipelineService } from './facebook.service';

it('pipeline', async () => {
    return pipelineService({
        start: '2023-02-01',
        end: '2023-03-01',
    }).then((res) => {
        expect(res).toBeTruthy();
    });
});
