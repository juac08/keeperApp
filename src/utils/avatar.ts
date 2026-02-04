export const getInitials = (name: string): string => {
  const names = name.trim().split(/\s+/);
  if (names.length === 0) return "";
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (
    names[0].charAt(0).toUpperCase() +
    names[names.length - 1].charAt(0).toUpperCase()
  );
};

const isImageUrl = (value?: string): boolean => {
  if (!value) return false;
  return value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:");
};

export const getAvatarUrl = (seed: string): string => {
  const normalized = seed.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < normalized.length; i += 1) {
    hash = (hash * 31 + normalized.charCodeAt(i)) % 9973;
  }
  const imageId = (hash % 70) + 1;
  return `https://i.pravatar.cc/150?img=${imageId}`;
};

export const resolveAvatarSrc = (
  avatar: string | undefined,
  seed: string,
): string => {
  if (isImageUrl(avatar)) return avatar as string;
  return getAvatarUrl(seed);
};
