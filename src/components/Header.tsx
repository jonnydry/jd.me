interface HeaderProps {
  name: string
  handle: string
  tagline: string
  avatar: string
}

export default function Header({ name, handle, tagline, avatar }: HeaderProps) {
  return (
    <header className="header">
      <div className="avatar-wrap">
        <img src={avatar} alt="" className="avatar" />
      </div>
      <h1 className="name">{name}</h1>
      <p className="handle">{handle}</p>
      <p className="tagline">{tagline}</p>
    </header>
  )
}
