import React, { useRef, useState } from "react";
import { Container, VStack, Input, Button, Box, Image, HStack, IconButton } from "@chakra-ui/react";
import { FaPen, FaEraser, FaSave } from "react-icons/fa";

const Index = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [annotateMode, setAnnotateMode] = useState(false);
  const [blurMode, setBlurMode] = useState(false);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const handleImageLoad = () => {
    setImageLoaded(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctxRef.current = ctx;
    };
  };

  const handleAnnotate = () => {
    setAnnotateMode(true);
    setBlurMode(false);
  };

  const handleBlur = () => {
    setBlurMode(true);
    setAnnotateMode(false);
  };

  const handleCanvasClick = (e) => {
    if (annotateMode) {
      const ctx = ctxRef.current;
      ctx.fillStyle = "red";
      ctx.font = "20px Arial";
      ctx.fillText("Annotation", e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    } else if (blurMode) {
      const ctx = ctxRef.current;
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      const width = 100;
      const height = 100;
      ctx.filter = "blur(5px)";
      ctx.drawImage(canvasRef.current, x, y, width, height, x, y, width, height);
      ctx.filter = "none";
    }
  };

  const getImageDataURI = () => {
    const canvas = canvasRef.current;
    return canvas.toDataURL("image/jpeg");
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Input placeholder="Enter image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        <Button onClick={handleImageLoad}>Load Image</Button>
        {imageLoaded && (
          <>
            <Box position="relative">
              <canvas ref={canvasRef} onClick={handleCanvasClick} style={{ border: "1px solid black" }} />
              <HStack spacing={4} position="absolute" top={2} left={2}>
                <IconButton aria-label="Annotate" icon={<FaPen />} onClick={handleAnnotate} />
                <IconButton aria-label="Blur" icon={<FaEraser />} onClick={handleBlur} />
              </HStack>
            </Box>
            <Button onClick={() => console.log(getImageDataURI())} leftIcon={<FaSave />}>
              Get Image Data URI
            </Button>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
