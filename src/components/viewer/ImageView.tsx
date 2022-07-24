import { Box, Paper } from '@material-ui/core';
import { useCallback, useState } from 'react';
import ImageViewer from 'react-simple-image-viewer';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

function ImageView({ images, height, width, removePhoto, big }: any) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };
  const refsize = big ? (height * 3) / 4 + 10 : width / 2 - 10;
  if (!images || images.length === 0) {
    return <Paper style={{ height, width, overflow: 'auto' }}></Paper>;
  }
  return (
    <Paper style={{ height, width, overflow: 'auto' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          marginRight: big ? 8 : 3,
        }}
      >
        {images.map((src: any, index: any) => (
          <Box>
            {removePhoto && (
              <div
                onClick={() => removePhoto(src, index)}
                style={{
                  position: 'relative',
                  marginBottom: -30,
                  marginRight: 10,
                  zIndex: 116,
                  cursor: 'pointer',
                }}
              >
                <HighlightOffIcon
                  style={{ color: '#ff9d2d' }}
                ></HighlightOffIcon>
              </div>
            )}
            <img
              src={src}
              onClick={() => openImageViewer(index)}
              width={refsize}
              height={refsize}
              key={index}
              style={{
                padding: big ? 10 : 5,
                overflow: 'hidden',
                objectFit: 'cover',
                cursor: 'pointer',
              }}
              alt=""
            />
          </Box>
        ))}

        {isViewerOpen && (
          <ImageViewer
            src={images}
            currentIndex={currentImage}
            onClose={closeImageViewer}
            disableScroll={false}
            backgroundStyle={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              zIndex: 150,
            }}
            closeOnClickOutside={true}
          />
        )}
      </div>
    </Paper>
  );
}

export default ImageView;
