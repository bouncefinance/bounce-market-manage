import React, { useState } from "react"
import styled from 'styled-components'
import errorImg from '../assets/images/errorImg.svg'

const AutoStretchBaseWidthOrHeightImgStyled = styled.div`
div{
  background-repeat: no-repeat;
  background-size: 63px;
  background-position: center;
  /* background-color: rgba(0, 0, 0, 1); */
  background-color: rgb(224,224,224);
  img{
    /* background-color: rgb(247, 247, 247); */
    background-color: white;
    object-fit: contain;
  }
}
`
export function ImgFit ({ src, width, height }: { src: string; width: number; height: number }) {
  const [imgShow, setImgShow] = useState(true)
  return <AutoStretchBaseWidthOrHeightImgStyled>
    <div style={{ width: `${width}px`, height: `${height}px`, backgroundImage: `url(${errorImg})` }}>
      {imgShow && <img width={width} height={height} src={src} alt="" onError={() => setImgShow(false)} />}
    </div>
  </AutoStretchBaseWidthOrHeightImgStyled>
}