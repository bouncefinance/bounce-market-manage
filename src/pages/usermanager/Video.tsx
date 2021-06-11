import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import defaultImg from './assets/3.svg';
import play from './assets/play_gray.svg';

import Grow from '@material-ui/core/Grow';

const VideoStyled = styled.div<{
  playButtonVisiable: any;
  hasBackgroundColor: any;
}>`
  .videoWrapper {
    position: relative;
    background-color: ${({ hasBackgroundColor }: { [key: string]: any }) => {
      return hasBackgroundColor ? 'rgb(244,244,244)' : 'none';
    }};
    background-repeat: no-repeat;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 63px;
    /* background-color: white; */

    .img-loading {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      background: rgb(234, 234, 234);
    }

    .defaultImg {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -50px;
      margin-left: -33.5px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .playButton {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 10;
      margin-top: -15px;
      margin-left: -15px;
      background-color: transparent;
      img {
        width: 30px;
        height: 30px;
        /* opacity: 1; */
      }
    }
  }
`;
interface params {
  src: string;
  width?: any;
  height?: any;
  margin?: any;
  style?: object;
  initPlayButtonVisible?: boolean;
  hasBackgroundColor?: boolean;
  initShowDefaultImage?: boolean;
}

export function VideoItem({
  src,
  width,
  height,
  margin = 'auto',
  style = {},
  initPlayButtonVisible = true,
  hasBackgroundColor = true,
  initShowDefaultImage = true,
}: params) {
  const videoRef = useRef(null);
  /* const [imgShow, setImgShow] = useState(true)
  const [imgLoading, setImgLoading] = useState(!true) */
  const [playButtonVisiable, setPlayButtonVisiable] = useState(
    initPlayButtonVisible,
  );
  const [playButtonClickable, setPlayButtonClickable] = useState(true);
  /* const [videoError, setVideoError] = useState(false) */
  const [showDefaultImage, setShowDefaultImage] =
    useState(initShowDefaultImage);
  // let [isHover, setIsHover] = useState(false)

  /* const onMouseMove = () => {
    const video = videoRef?.current
      if (!video) return
    // TODO   The error you provided does not contain a stack trace.
    video?.play()
    // video.defaultMuted = true
  } */

  const onMouseLeave = () => {
    const video: object | any = videoRef?.current;
    if (!initPlayButtonVisible) return;
    if (!video) return;
    video?.pause();
    setPlayButtonVisiable(true);
  };

  useEffect(() => {
    const videoRefCurrent: HTMLElement | any = videoRef?.current;
    if (!videoRefCurrent) return;
    const mediaSourse = new MediaSource();
    videoRefCurrent.src = URL.createObjectURL(mediaSourse);
    videoRefCurrent.setAttribute('crossOrigin', 'anonymous');
    mediaSourse.addEventListener('sourceopen', (e) =>
      sourceOpen(e, videoRefCurrent),
    );
  }, []);

  const sourceOpen = (e: any, videoRefCurrent: HTMLElement | any) => {
    URL.revokeObjectURL(videoRefCurrent.src);
    const mime: string = 'video/webm; codecs="vorbis,vp8"';
    const mediaSourse = e.target;
    let sourceBuffer = mediaSourse.addSourceBuffer(mime);
    fetch(src)
      .then((res) => {
        return res.arrayBuffer();
      })
      .then((arrayBuffer) => {
        sourceBuffer.addEventListener('updateend', () => {
          if (!sourceBuffer.updating && mediaSourse.readyState === 'open') {
            mediaSourse.endOfStream();
            videoRefCurrent
              .play()
              .then()
              .catch((err: any) => {
                console.log(err);
              });
          }
        });
        sourceBuffer.appendBuffer(arrayBuffer);
      });
  };

  return (
    <VideoStyled
      playButtonVisiable={playButtonVisiable}
      hasBackgroundColor={hasBackgroundColor}
    >
      <div
        className="videoWrapper"
        style={{
          ...style,
          width: `${width}px`,
          height: `${height}px` /* , backgroundImage: `url(${errorImg})` */,
          margin: `${margin}`,
        }}
      >
        {
          /* imgShow
        && */
          <video
            /* onMouseOver={onMouseMove} */
            onMouseLeave={onMouseLeave}
            ref={videoRef}
            style={{ objectFit: 'contain' }}
            width={width}
            height={height}
            src={src}
            onError={() => {
              setPlayButtonClickable(false);
              console.log('onError');
            }}
            onCanPlay={() => {
              setShowDefaultImage(false);
            }}
          />
        }

        {/* {
        imgLoading
        &&
        <div className="img-loading">
        </div>
      } */}

        {
          /* videoError */
          showDefaultImage && (
            <div className="defaultImg">
              <img src={defaultImg} alt="" />
            </div>
          )
        }

        {playButtonVisiable && (
          <Grow
            in={playButtonVisiable}
            style={{ transformOrigin: 'center' }}
            {...(playButtonVisiable ? { timeout: 500 } : {})}
          >
            <div
              className="playButton"
              onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();

                if (!playButtonClickable) return;
                setPlayButtonVisiable(false);
                const video: any = videoRef!.current;
                if (!video) return;
                video!.play();
              }}
            >
              <img src={play} alt="" />
            </div>
          </Grow>
        )}
      </div>
    </VideoStyled>
  );
}

// 'https://vodm0pihssv.vod.126.net/edu-video/nos/mp4/2013/03/07/206001_7179dc6b829a49e29d53d63d941d996d_sd.mp4?ak=7909bff134372bffca53cdc2c17adc27a4c38c6336120510aea1ae1790819de8914c542fa3373cc1e6158acaa03a2359c451c5ef6bd3d51342659c80414047823059f726dc7bb86b92adbc3d5b34b1327c7f4eb5a3208751c748f68b0af6e3dc'
