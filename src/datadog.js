// src/datadog.js
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
    applicationId: '6a127ad2-645b-4398-9974-873b49d7a4af',
    clientToken: 'pub627c58de05c2724378b7d4c8d16df9dc',
    site: 'us5.datadoghq.com',
    service: 'pluto-learning',
    env: 'production', // or 'staging', 'development'
    version: '1.0.0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    defaultPrivacyLevel: 'mask-user-input',
});
