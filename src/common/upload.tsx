/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import imageCompression from 'browser-image-compression';
import {
  CLOUD_NAME,
  imageUploadOptions,
  UPLOAD_PRESET,
} from '../constants/sizes';
import React from 'react';

const serverURL = 'http://jadwal-server:4000';

export const FileUpload = () => {
  const [data, setFile] = useState({ name: '', path: '' });

  const handleChange = (e) => {
    const file = e.target.files[0];
    uploadFile(file);
  };
  const uploadFile = (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
    axios
      .post(`${serverURL}/uploadfile`, formData)
      .then((res) => {
        setFile({
          name: res.data.filename,
          path: serverURL + res.data.path,
        });
      })
      .catch((err) => console.log(err));
  };
  const renderFile = () => {
    return (
      <div style={{ padding: 10 }}>
        <p>file location {data.path}</p>
      </div>
    );
  };

  return (
    <div>
      <div style={{ marginTop: 20, marginBottom: 10 }}>
        <input type="file" name="file" onChange={handleChange} />
        {data.path && renderFile()}
      </div>
    </div>
  );
};

export const ImageUpload = ({ setLogo, disabled }) => {
  const [file, setFile] = useState({ name: '', path: '' });
  console.log(file);

  const handleChange = (e: any) => {
    const file = e.target.files[0];
    uploadFile(file);
  };

  const uploadFile = (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
    axios
      .post(`${serverURL}/uploadimage`, formData)
      .then((res) => {
        setFile({
          name: res.data.filename,
          path: serverURL + res.data.path,
        });
        if (setLogo) {
          setLogo(serverURL + res.data.path);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div style={{ marginTop: 20, marginBottom: 10 }}>
        <input
          disabled={disabled}
          type="file"
          name="file"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export const ImageOnlineUpload = ({
  url,
  setUrl,
  image,
  setImage,
  width,
  height,
  size,
}) => {
  const [localimage, setLocalImage]: any = useState(null);

  const fileInput = useRef(null);

  const selectImage = (e: any) => {
    const img = e.target?.files?.[0];
    if (img) {
      setImage(img);
    }
  };

  const removeImage = () => {
    setImage(null);
    setUrl(null);
  };

  useEffect(() => {
    if (image) {
      setLocalImage(URL.createObjectURL(image));
    } else {
      setLocalImage(null);
    }
  }, [image]);

  return (
    <Box>
      <input
        ref={fileInput}
        style={{
          width: 0.1,
          height: 0.1,
          opacity: 0,
          position: 'absolute',
          zIndex: -1,
        }}
        type="file"
        onChange={selectImage}
      />
      {localimage && (
        <Box>
          <div
            onClick={() => removeImage()}
            style={{
              position: 'relative',
              marginTop: 15,
              marginBottom: -30,
              zIndex: 115,
              marginLeft: 10,
              cursor: 'pointer',
            }}
          >
            <HighlightOffIcon style={{ color: '#ff9d2d' }}></HighlightOffIcon>
          </div>
          <img
            onClick={() => fileInput.current.click()}
            style={{
              overflow: 'hidden',
              borderRadius: 5,
              cursor: 'pointer',
              objectFit: 'cover',
            }}
            width={width}
            height={height}
            src={localimage}
          />
        </Box>
      )}
      {url && !localimage && (
        <Box>
          <div
            onClick={() => removeImage()}
            style={{
              position: 'relative',
              marginTop: 15,
              marginBottom: -30,
              zIndex: 115,
              marginLeft: 10,
              cursor: 'pointer',
            }}
          >
            <HighlightOffIcon style={{ color: '#ff9d2d' }}></HighlightOffIcon>
          </div>
          <img
            onClick={() => fileInput.current.click()}
            style={{
              overflow: 'hidden',
              borderRadius: 5,
              cursor: 'pointer',
              objectFit: 'cover',
            }}
            width={width}
            height={height}
            src={url}
          />
        </Box>
      )}
      {!localimage && !url && (
        <Box
          display="flex"
          style={{
            marginTop: 10,
            borderRadius: 10,
            overflow: 'hidden',
            width: width,
            height: height,
            cursor: 'pointer',
            backgroundColor: '#f5f5f5',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => fileInput.current.click()}
        >
          <Typography style={{ color: '#bbb', fontSize: 14 }}>
            {size}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export const uploadPhotoOnline = async (image: any) => {
  try {
    const compressedImage = await imageCompression(image, imageUploadOptions);
    const d = new FormData();
    d.append('file', compressedImage);
    d.append('upload_preset', UPLOAD_PRESET);
    d.append('cloud_name', CLOUD_NAME);

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/fivegstore/image/upload',
      {
        method: 'post',
        body: d,
      }
    );
    const json = await res.json();
    return json.url;
  } catch (error) {
    return undefined;
  }
};
