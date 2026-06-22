import { isVideoMediaRef } from "@/lib/mediaUrl";

/** Превью плитки — статичное фото или зацикленное беззвучное видео. */
export function TileMedia({
  src,
  isVideo,
  className = "w-full h-full object-cover",
}: {
  src: string;
  isVideo?: boolean;
  className?: string;
}) {
  const video = isVideo ?? isVideoMediaRef(src);

  if (video) {
    return (
      <video
        src={src}
        className={className}
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        draggable={false}
      />
    );
  }

  return <img src={src} alt="" className={className} draggable={false} />;
}
