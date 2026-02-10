interface HeaderProps {
  name: string
  tagline: string
  avatar: string
}

export default function Header({ name, tagline, avatar }: HeaderProps) {
  return (
    <header className="header">
      <div className="avatar-wrap">
        <img src={avatar} alt="" className="avatar" />
      </div>
      <h1 className="name">{name}</h1>
      <p className="tagline">{tagline}</p>
    </header>
  )
}
