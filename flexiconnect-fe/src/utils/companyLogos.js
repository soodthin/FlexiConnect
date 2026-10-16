/**
 * Company logo mapping for demo and authentic display
 */
export const COMPANY_LOGOS = {
  masan: '/logos/masan.svg',
  kiotviet: '/logos/kiotviet.svg',
  viettel: '/logos/viettel.svg',
  misa: '/logos/misa.svg',
  'axon active': '/logos/axonactive.svg',
  'hoa sen': '/logos/hoasen.svg',
  acecook: '/logos/acecook.svg',
  'thế giới di động': '/logos/thegioididong.svg',
  'the gioi di dong': '/logos/thegioididong.svg',
  'bảo việt': '/logos/baoviet.svg',
  'bao viet': '/logos/baoviet.svg',
  vinamilk: '/logos/vinamilk.svg',
  shopee: '/logos/shopee.svg',
  vng: '/logos/vng.svg',
  ghn: '/logos/ghn.svg',
  'giao hàng nhanh': '/logos/ghn.svg',
  fpt: '/logos/fpt.svg',
  tiki: '/logos/tiki.svg',
  vinfast: '/logos/vinfast.svg',
  be: '/logos/be.svg',
  'be group': '/logos/be.svg',
  grab: '/logos/grab.svg',
  lazada: '/logos/lazada.svg',
  zalopay: '/logos/zalopay.svg',
  'an cường': '/logos/ancuong.svg',
  'an cuong': '/logos/ancuong.svg',
  'đại dương': '/logos/daiduong.svg',
  'dai duong': '/logos/daiduong.svg',
  'việt nhật': '/logos/vietnhat.svg',
  'viet nhat': '/logos/vietnhat.svg',
  'green design': '/logos/greendesign.svg',
};

/**
 * Get logo URL for a company name
 * @param {string} companyName 
 * @param {string} defaultAvatar 
 * @returns {string}
 */
export const getCompanyLogo = (companyName, defaultAvatar = null) => {
  if (defaultAvatar && defaultAvatar.startsWith('http')) {
    return defaultAvatar;
  }
  if (!companyName) return defaultAvatar || null;

  const normalized = companyName.toLowerCase();

  for (const [key, logoPath] of Object.entries(COMPANY_LOGOS)) {
    if (normalized.includes(key)) {
      return logoPath;
    }
  }

  return defaultAvatar || null;
};
