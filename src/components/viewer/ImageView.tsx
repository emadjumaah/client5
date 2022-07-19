import { Paper } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import ImageViewer from 'react-simple-image-viewer';

const imageslist = [
  'http://placeimg.com/1200/800/nature',
  'http://placeimg.com/800/1200/nature',
  'http://placeimg.com/1920/1080/nature',
  'http://placeimg.com/1500/500/nature',
  'http://placeimg.com/1200/800/nature',
  'http://placeimg.com/800/1200/nature',
  'http://placeimg.com/1920/1080/nature',
  'http://placeimg.com/1500/500/nature',
  'http://placeimg.com/1200/800/nature',
  'http://placeimg.com/800/1200/nature',
];

function ImageView({ images = imageslist }) {
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

  return (
    <Paper style={{ height: 200, overflow: 'auto' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          marginRight: 10,
          marginLeft: 10,
        }}
      >
        {images.map((src, index) => (
          <img
            src={src}
            onClick={() => openImageViewer(index)}
            width={100}
            height={100}
            key={index}
            style={{
              padding: 5,
              overflow: 'hidden',
              objectFit: 'cover',
            }}
            alt=""
          />
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
