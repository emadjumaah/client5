import AWS from 'aws-sdk';
import { nanoid } from 'nanoid';
import Resizer from 'react-image-file-resizer';
import { ACCESS_KEY_ID, REGION, BUCKET, SECRET_ACCESS_KEY } from '../constants';

AWS.config.update({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
});

const myBucket = new AWS.S3({
  params: { Bucket: BUCKET },
  region: REGION,
});

export const uploadAwsFile = async ({
  buf,
  file,
  setProgress,
  addFileData,
  opId,
  itemId,
  customerId,
  supplierId,
  departmentId,
  employeeId,
  projectId,
  resourseId,
  contractId,
  reminderId,
  userId,
}) => {
  const filename = file.name;
  const size = file.size / 1000000;
  const id = nanoid();
  const namedata = file.name.split('.');
  const name = namedata.slice(0, -1).join('.');
  const filetype = namedata.pop();
  const onlinename = buf ? `${id}___.${name}.jpeg` : `${id}___.${filename}`;
  const params = buf
    ? {
        Key: onlinename,
        Body: buf,
        ACL: 'public-read',
        Bucket: BUCKET,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
      }
    : {
        Key: onlinename,
        Body: file,
        ACL: 'public-read',
        Bucket: BUCKET,
      };

  myBucket
    .putObject(params)
    .on('httpUploadProgress', (evt) => {
      setProgress(Math.round((evt.loaded / evt.total) * 100));
    })
    .on('complete', (res: any) => {
      const variables = {
        filename,
        filetype,
        onlinename,
        url: `https://jadwalio.s3.us-west-2.amazonaws.com/${onlinename}`,
        size,
        opId,
        itemId,
        customerId,
        supplierId,
        departmentId,
        employeeId,
        projectId,
        resourseId,
        contractId,
        reminderId,
        userId,
      };
      addFileData({ variables });
      return variables;
    })
    .send((err) => {
      if (err) console.log(err);
    });
};

export const resizeImage = ({ file, size = 600 }: any) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      size,
      size,
      'JPEG',
      95,
      0,
      (uri) => {
        resolve(uri);
      },
      'base64'
    );
  });
