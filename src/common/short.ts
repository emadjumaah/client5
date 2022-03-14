import validurl from 'valid-url';

export const getShortLink = async (link: any) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ link }),
  };
  const response = await fetch('https://jdwl.me/api/short', requestOptions);
  const data = await response.json();
  return data.short;
};

export const getShortLinkInfo = async (code: any) => {
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  const response = await fetch(`https://jdwl.me/api/inspect/${code}`, options);
  const data = await response.json();
  return data;
};

export const isURL = (str: string) => {
  return validurl.isUri(str);
};