import * as config from 'nconf';

export const DEFAULT_ENV = 'development';

export default () => {
    config.argv().env({lowerCase: true});
    const environment = process.env.NODE_ENV || DEFAULT_ENV;
    const configDir = `${__dirname}/../../config`;
    config.file('local', {file: `${configDir}/local.json`});
    config.file(environment, {file: `${configDir}/${environment}.json`});
    config.file('default', {file: `${configDir}/default.json`});
};
