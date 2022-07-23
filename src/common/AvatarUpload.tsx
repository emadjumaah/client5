/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import imageCompression from 'browser-image-compression';
import {
  CLOUD_NAME,
  imageUploadOptions,
  UPLOAD_PRESET,
} from '../constants/sizes';
import React from 'react';

const serverURL = 'http://jadwal-main';

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

export const AvatarUpload = ({
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
        accept="image/*"
        onChange={selectImage}
      />
      {localimage && (
        <Box>
          <div
            onClick={() => removeImage()}
            style={{
              position: 'relative',
              marginBottom: -30,
              marginRight: 10,
              zIndex: 116,
              cursor: 'pointer',
            }}
          >
            <HighlightOffIcon style={{ color: '#ff9d2d' }}></HighlightOffIcon>
          </div>
          <Paper
            elevation={2}
            style={{ width, height, borderRadius: width / 2 }}
          >
            <img
              onClick={() => fileInput.current.click()}
              style={{
                overflow: 'hidden',
                borderRadius: width / 2,
                cursor: 'pointer',
                objectFit: 'cover',
              }}
              width={width}
              height={height}
              src={localimage}
            />
          </Paper>
        </Box>
      )}
      {url && !localimage && (
        <Box>
          <div
            onClick={() => removeImage()}
            style={{
              position: 'relative',
              marginBottom: -30,
              marginRight: 10,
              zIndex: 116,
              cursor: 'pointer',
            }}
          >
            <HighlightOffIcon style={{ color: '#ff9d2d' }}></HighlightOffIcon>
          </div>
          <Paper
            elevation={2}
            style={{ width, height, borderRadius: width / 2 }}
          >
            <img
              onClick={() => fileInput.current.click()}
              style={{
                overflow: 'hidden',
                borderRadius: width / 2,
                cursor: 'pointer',
                objectFit: 'cover',
              }}
              width={width}
              height={height}
              src={url}
            />
          </Paper>
        </Box>
      )}
      {!localimage && !url && (
        <Box
          display="flex"
          style={{
            borderRadius: width / 2,
            overflow: 'hidden',
            width: width,
            height: height,
            cursor: 'pointer',
            backgroundColor: '#ddd',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => fileInput.current.click()}
        >
          <Typography
            style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}
          >
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
      'https://api.cloudinary.com/v1_1/jadwalio/image/upload',
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
export const uploadMultiPhotoOnline = async (images: any) => {
  if (!images || images.length === 0) return null;
  const urls = [];
  try {
    for (const image of images) {
      const compressedImage = await imageCompression(image, imageUploadOptions);
      const d = new FormData();
      d.append('file', compressedImage);
      d.append('upload_preset', UPLOAD_PRESET);
      d.append('cloud_name', CLOUD_NAME);

      const res = await fetch(
        'https://api.cloudinary.com/v1_1/jadwalio/image/upload',
        {
          method: 'post',
          body: d,
        }
      );
      const json = await res.json();
      urls.push(json.url);
    }

    return urls;
  } catch (error) {
    console.log('error', error);
    return null;
  }
};
