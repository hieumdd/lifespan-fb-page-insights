import { http } from '@google-cloud/functions-framework';
import express from 'express';

import { pipelineService } from './facebook/facebook.service';

const app = express();

app.use(({ path, body }, res, next) => {
    const log = { path, body };
    console.log(JSON.stringify(log));
    next();
});

app.use('/', (req, res) => {
    pipelineService({ start: req.body.start, end: req.body.end })
        .then((result) => res.status(200).json({ result }))
        .catch((error) => res.status(500).json({ error }));
});

http('main', app);
