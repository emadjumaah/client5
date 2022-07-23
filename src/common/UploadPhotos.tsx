import { useRef } from 'react';
import { Box, Button, Typography } from '@material-ui/core';

export const UploadPhotos = ({ setImages, isRTL }) => {
  const fileInput = useRef(null);

  const selectImage = (e: any) => {
    const images = e.target?.files;
    setImages(images);
  };

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
        multiple
        onChange={selectImage}
      />

      <Box
        style={{
          display: 'flex',
          height: 40,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button
          onClick={() => fileInput.current.click()}
          variant="outlined"
          color="primary"
          fullWidth
        >
          <Typography style={{ fontWeight: 'bold' }}>
            {isRTL ? 'تحميل صور' : 'Upload Photos'}
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};
