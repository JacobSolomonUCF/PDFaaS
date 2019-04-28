exports.pdfHandler = async (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'HELLO from PDF',
      input: event,
    }),
  };

  callback(null, response);
};