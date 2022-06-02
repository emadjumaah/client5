import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import createFileData from '../graphql/mutation/createFileData';
import { uploadAwsFile, resizeImage } from './uploadAws';

const AwsImageUpload = ({
  opId,
  itemId,
  customerId,
  supplierId,
  departmentId,
  employeeId,
  projectId,
  resourseId,
  taskId,
  reminderId,
  userId,
}: any) => {
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [addFileData] = useMutation(createFileData);

  const handleFileInput = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFile = async (file: any) => {
    const resized: any = await resizeImage({ file });
    var buf = Buffer.from(
      resized.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );
    await uploadAwsFile({
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
      taskId,
      reminderId,
      userId,
    });
    return;
  };

  return (
    <div>
      <div>Image Upload Progress is {progress}%</div>
      <input type="file" accept="image/*" onChange={handleFileInput} />
      <button onClick={() => uploadFile(selectedFile)}>
        Upload Image to S3
      </button>
    </div>
  );
};

export default AwsImageUpload;
