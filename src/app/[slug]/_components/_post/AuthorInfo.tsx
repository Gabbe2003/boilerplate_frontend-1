import { normalizeName } from "@/lib/globals/actions";
import { Post } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export interface AuthorInfoProps {
  author: Post["author"];
  noLink?: true | false
}

export default function AuthorInfo({ author, noLink = false }: AuthorInfoProps) {
  if (!author?.node) return null;

  const { name, avatar } = author.node;
  const avatarUrl = avatar?.url;

  return (
    <div className="flex items-center gap-2">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name || "Author"}
          width={28}
          height={28}
          className="rounded-full object-cover border border-gray-200"
        />
      ) : (
        <span
          className="inline-flex items-center justify-center rounded-full bg-gray-300 text-gray-600 font-semibold border border-gray-200"
          style={{
            width: 28,
            height: 28,
            fontSize: "0.9rem",
            userSelect: "none",
          }}
          aria-label="Author initial"
        >
          {name ? name[0].toUpperCase() : "A"}
        </span>
      )}
      

      {name && (
        <>
          {noLink ? (
            <div className="text-gray-700 text-sm font-medium">{name}</div>
          ) : 
          <Link href={`author/${normalizeName(name)}`} className="text-gray-700 text-sm font-medium">{name}</Link>
          }
        </>
      )}
    </div>
  );
}
