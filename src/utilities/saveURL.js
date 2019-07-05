// import _ from 'lodash';
import LZ from 'lz-string';

const compressData = data => LZ.compressToEncodedURIComponent(JSON.stringify(data));

const generateDataURL = data => `${window.location.origin}/s/${data}`;

const genSaveURL = ({sharedSchema, sharedInstance}, vueRouter) => {

  const compressedData = compressData({
    s: sharedSchema,
    i: sharedInstance,
  });

  const dataURL = generateDataURL(compressedData);

  // generate short URL

  vueRouter.push(dataURL);
};

export {
  genSaveURL,
};

// Alternatively export and define in one line
// export const genSaveURL = () => { ... }

// export default genSaveURL;
