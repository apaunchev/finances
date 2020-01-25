exports.catchErrors = fn =>
  function(req, res, next) {
    return fn(req, res, next).catch(next);
  };

exports.notFound = (req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
};

exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || "";
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      "<mark>$&</mark>"
    )
  };
  res.status(err.status || 500);
  res.format({
    "text/html": () => {
      res.render("error", errorDetails);
    },
    "application/json": () => res.json(errorDetails) // Ajax call, send JSON back
  });
};

exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
};
