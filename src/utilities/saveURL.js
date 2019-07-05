import LZ from 'lz-string';

const compressData = data => LZ.compressToEncodedURIComponent(JSON.stringify(data));

const generateDataURL = data => `/s/${data}`;

const genSaveURL = ({sharedSchema, sharedInstance}) => {

  const compressedData = compressData({
    s: sharedSchema,
    i: sharedInstance,
  });

  const url =  generateDataURL(compressedData);

  return url
};

export {genSaveURL}
