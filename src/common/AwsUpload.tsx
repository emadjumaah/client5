import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import createFileData from '../graphql/mutation/createFileData';
import { uploadAwsFile } from './uploadAws';

const AwsUpload = ({
  opId,
  itemId,
  customerId,
  supplierId,
  departmentId,
  employeeId,
  projectId,
  resourseId,
  reminderId,
  contractId,
  userId,
}: any) => {
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const [addFileData] = useMutation(createFileData);

  const handleFileInput = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFile = async (file: any) => {
    await uploadAwsFile({
      buf: null,
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
      reminderId,
      contractId,
      userId,
    });
    return;
  };

  return (
    <div>
      <div>Native SDK File Upload Progress is {progress}%</div>
      <input type="file" onChange={handleFileInput} />
      <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>
    </div>
  );
};

export default AwsUpload;
