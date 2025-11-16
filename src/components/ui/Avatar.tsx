type AvatarProps = {
  fullName: string;
};

export const Avatar = ({ fullName }: AvatarProps) => {
  const initials = fullName
    .trim()
    .split(/\s+/)
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="flex w-10 h-10 rounded-full bg-[#5B48E8] justify-center items-center"
      aria-label={`Avatar for ${fullName}`}
      title={fullName}>
      <p className="font-bold text-white">{initials}</p>
    </div>
  );
};
