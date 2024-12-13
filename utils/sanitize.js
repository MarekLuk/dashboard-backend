const sanitizeHtml = require('sanitize-html');

const sanitizeInput = (input) => {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
};

const sanitizeData = (data) => {
  const sanitized = {};
  for (const key in data) {
    if (typeof data[key] === 'string') {
      sanitized[key] = sanitizeInput(data[key]);
    } else {
      sanitized[key] = data[key];
    }
  }
  return sanitized;
};

module.exports = { sanitizeInput, sanitizeData, };
