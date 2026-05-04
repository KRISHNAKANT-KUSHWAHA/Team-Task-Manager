const Avatar = ({ user, size = "md" }) => {
  const sizeClasses = {
    sm: "h-9 w-9 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-28 w-28 text-3xl"
  };

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (user?.profilePhoto) {
    return (
      <img
        src={user.profilePhoto}
        alt={user.name}
        className={`${sizeClasses[size]} rounded-full border border-white object-cover shadow-sm ring-2 ring-emerald-100`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-emerald-700 font-bold text-white shadow-sm ring-2 ring-emerald-100`}>
      {initials || "U"}
    </div>
  );
};

export default Avatar;
