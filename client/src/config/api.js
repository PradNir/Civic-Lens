const RAW_API_BASE =
  process.env.REACT_APP_API_URL ||
  'https://figure-yields-roles-contributors.trycloudflare.com';

const API_BASE = RAW_API_BASE.replace(/\/+$/, '');

export default API_BASE;
