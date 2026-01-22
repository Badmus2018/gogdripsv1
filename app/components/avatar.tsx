import Image from "next/image";
import { UserCircle2 } from "lucide-react";

interface AvatarProps {
  src?: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({ src }) => {
  if (src) {
    return (
      <Image
        src={src}
        alt="Avatar"
        className="rounded-full border-[1px] border-slate-400"
        height={28}
        width={28}
      />
    );
  }

  return <UserCircle2 size={28} />;
};

export default Avatar;
