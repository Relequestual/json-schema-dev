import LZ from 'lz-string';
import Yourls from 'yourls';

const yourls = new Yourls('https://l.schema.is', '714173792d')

const compressData = data => LZ.compressToEncodedURIComponent(JSON.stringify(data));

const generateDataURL = data => `/s/${data}`;

const genSaveURL = async ({sharedSchema, sharedInstance}) => {

  const compressedData = compressData({
    s: sharedSchema,
    i: sharedInstance,
  });

  const url =  generateDataURL(compressedData);

  return url;
};

const shortenURL = async (url) => {

  const shorten = (url) => {
    return new Promise((resolve, reject) => {
      yourls.shorten(`https://jsonschema.dev${url}`, function (error, result) {
        if(error){
          reject(error);
        }
        resolve(result);
      }
    )});
  }

  const result = await shorten(url);
  if(result.status === 'fail') {
    throw new Error(`Unable to save URL  - ${result.message}`);
  }
  return result.url.keyword;
}

const retrieveDataFromURL = async (urlPath) => {
  const resolveShort = (urlPath) => {
    return new Promise((resolve, reject) => {
      yourls.expand(urlPath, function(error, result) {

        if(error){
          return reject(error);
        }
        if(result.errorCode) {
          return reject(new Error(`${result.message} - ${result.errorCode}`));
        }

        //=> "https://github.com/neocotic/yourls-api"
        const matches = result.longurl.match(/.+\.dev\/s\/(.+)$/);
        if(matches === null){
          return reject(new Error('Unable to find short URL'));
        }else {
          const data = matches[1];
          resolve(data);
        }
      });
    });
  }

  const result = await resolveShort(urlPath);
  return result;
};

export default {
  genSaveURL,
  shortenURL,
  retrieveDataFromURL
};
