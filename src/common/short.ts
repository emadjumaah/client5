import validurl from 'valid-url';

export const getShortLink = async ({ apiKey, link }: any) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey, link }),
  };
  const response = await fetch(
    'https://jdwl.me/api/create-short',
    requestOptions
  );
  const data = await response.json();
  return data;
};

export const getShortLinkInfo = async ({ apiKey, code }: any) => {
  const response = await fetch(
    `https://jdwl.me/api/get-linkinfo/?apiKey=${apiKey}&code=${code}`
  );
  const data = await response.json();
  return data?.data;
};

export const isURL = (str: string) => {
  return validurl.isUri(str);
};
