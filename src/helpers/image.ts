// helpers/image.ts
export function toMediaUrl(input: string) {
  try {
    // ví dụ: http://103.211.201.141:9000/uniseapshop-bucket/products/abc.png?... 
    const u = new URL(input);
    const parts = u.pathname.split('/'); // ["", "uniseapshop-bucket", "products", "abc.png"]
    // lấy phần sau tên bucket
    const idx = parts.indexOf('uniseapshop-bucket');
    const key = parts.slice(idx + 1).join('/'); // "products/abc.png"
    return `/media/${key}`;                      // proxy qua vercel
  } catch {
    // nếu input đã là objectKey thuần
    return `/media/${input.replace(/^\/+/, '')}`;
  }
}
