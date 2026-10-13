import { identity } from './data'

interface AvatarProps {
  className: string
  size: number
}

export default function Avatar({ className, size }: AvatarProps) {
  return (
    <picture>
      <source srcSet="/avatar-360.avif 360w, /avatar-720.avif 720w" sizes={`${size}px`} type="image/avif" />
      <img
        src={identity.avatar}
        srcSet="/avatar-360.jpg 360w, /avatar.jpg 720w"
        sizes={`${size}px`}
        alt=""
        className={className}
        width={size}
        height={size}
        decoding="async"
      />
    </picture>
  )
}
